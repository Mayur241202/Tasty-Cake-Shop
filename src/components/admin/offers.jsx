import React, { useState, useEffect, useRef } from "react";
import API_BASE_URL from '../../config';

const branches = [
  { id: 1, name: "Central" },
  { id: 2, name: "West" },
  { id: 3, name: "East" },
];

const isOfferActive = (toDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(toDate);
  endDate.setHours(0, 0, 0, 0);
  return endDate >= today;
};

const AdminOffers = () => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerFile, setOfferFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load offers from backend on mount
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers`);
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleFileChange = (e) => {
    setOfferFile(e.target.files[0]);
  };

  const resetForm = () => {
    setOfferTitle("");
    setOfferFile(null);
    setCurrentFileName("");
    setSelectedBranch("all");
    setFromDate("");
    setToDate("");
    setEditingId(null);
    // Clear the file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerTitle || !fromDate || !toDate) return;
    if (!editingId && !offerFile) return;

    // Validate dates - properly compare just the date part, not time
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const todayObj = new Date();
    
    // Set time to 00:00:00 for proper comparison
    fromDateObj.setHours(0, 0, 0, 0);
    toDateObj.setHours(0, 0, 0, 0);
    todayObj.setHours(0, 0, 0, 0);

    // Check if end date is before start date
    if (toDateObj < fromDateObj) {
      setMessage("End date cannot be before start date");
      return;
    }

    // Check that start date is not in the past (for new offers)
    if (!editingId && fromDateObj < todayObj) {
      setMessage("Start date cannot be in the past");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", offerTitle);
      if (offerFile) {
        formData.append("file", offerFile);
      }
      formData.append("branch", selectedBranch);
      formData.append("fromDate", fromDate);
      formData.append("toDate", toDate);

      const url = editingId 
        ? `${API_BASE_URL}/api/offers/${editingId}`
        : `${API_BASE_URL}/api/offers`;
      
      const method = editingId ? "PUT" : "POST";

      console.log("Sending request to:", url, "Method:", method);

      const response = await fetch(url, {
        method,
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const text = await response.text();
      console.log("Response text:", text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        setMessage(`Server error: Invalid response format. Check if backend is running on ${API_BASE_URL}`);
        setLoading(false);
        return;
      }

      if (response.ok) {
        if (editingId) {
          setOffers(offers.map(o => o._id === editingId ? data : o));
          setMessage("Offer updated successfully!");
        } else {
          setOffers([data, ...offers]);
          setMessage("Offer created successfully!");
        }
        
        resetForm();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || (editingId ? "Failed to update offer" : "Failed to create offer"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error processing request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setOfferTitle(offer.title);
    setSelectedBranch(offer.branch);
    setFromDate(offer.fromDate);
    setToDate(offer.toDate);
    setOfferFile(null);
    setCurrentFileName(offer.fileName);
  };

  const handleDelete = async (offerId) => {
    setOfferToDelete(offerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!offerToDelete) return;

    setDeleting(offerToDelete);
    setShowDeleteModal(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers/${offerToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOffers(offers.filter(o => o._id !== offerToDelete));
        setMessage("Offer deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      setMessage("Error deleting offer");
    } finally {
      setDeleting(null);
      setOfferToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Manage Offers</h2>
      {message && (
        <div className={`mb-4 p-3 rounded text-center font-semibold ${message.includes("success") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center flex-wrap"
      >
        <input
          type="text"
          placeholder="Offer Title"
          value={offerTitle}
          onChange={(e) => setOfferTitle(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="border rounded px-3 py-2"
          required={!editingId}
        />
        {editingId && currentFileName && !offerFile && (
          <span className="text-sm text-gray-600 italic">Current: {currentFileName}</span>
        )}
        {offerFile && (
          <span className="text-sm text-green-600">Selected: {offerFile.name}</span>
        )}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="border rounded px-3 py-2"
          required
        />
        <span className="font-semibold">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate || new Date().toISOString().split('T')[0]}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading || (fromDate && toDate && (() => {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);
            return to < from;
          })())}
          className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : editingId ? "Update Offer" : "Upload Offer"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>
      
      {/* Active Offers */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-green-700">Active Offers</h3>
        <table className="min-w-full bg-white rounded shadow text-center overflow-hidden">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 border-b text-center">Title</th>
              <th className="py-2 px-4 border-b text-center">File</th>
              <th className="py-2 px-4 border-b text-center">Branch</th>
              <th className="py-2 px-4 border-b text-center">From</th>
              <th className="py-2 px-4 border-b text-center">To</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.filter(o => isOfferActive(o.toDate)).length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No active offers</td>
              </tr>
            ) : (
              offers.filter(o => isOfferActive(o.toDate)).map((offer) => (
                <tr key={offer._id} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-b text-center">{offer.title}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <a
                      href={`${API_BASE_URL}${offer.filePath}`}
                      download={offer.fileName}
                      className="text-pink-600 underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {offer.fileName}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {offer.branch === "all" ? "All Branches" : offer.branch}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{offer.fromDate}</td>
                  <td className="py-2 px-4 border-b text-center">{offer.toDate}</td>
                  <td className="py-2 px-4 border-b text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      disabled={deleting === offer._id}
                      className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 disabled:bg-gray-400"
                    >
                      {deleting === offer._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expired Offers */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-red-700">Expired Offers</h3>
        <table className="min-w-full bg-white rounded shadow text-center overflow-hidden">
          <thead>
            <tr className="bg-red-100">
              <th className="py-2 px-4 border-b text-center">Title</th>
              <th className="py-2 px-4 border-b text-center">File</th>
              <th className="py-2 px-4 border-b text-center">Branch</th>
              <th className="py-2 px-4 border-b text-center">From</th>
              <th className="py-2 px-4 border-b text-center">To</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.filter(o => !isOfferActive(o.toDate)).length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No expired offers</td>
              </tr>
            ) : (
              offers.filter(o => !isOfferActive(o.toDate)).map((offer) => (
                <tr key={offer._id} className="hover:bg-red-50">
                  <td className="py-2 px-4 border-b text-center">{offer.title}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <a
                      href={`${API_BASE_URL}${offer.filePath}`}
                      download={offer.fileName}
                      className="text-pink-600 underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {offer.fileName}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {offer.branch === "all" ? "All Branches" : offer.branch}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{offer.fromDate}</td>
                  <td className="py-2 px-4 border-b text-center">{offer.toDate}</td>
                  <td className="py-2 px-4 border-b text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      disabled={deleting === offer._id}
                      className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 disabled:bg-gray-400"
                    >
                      {deleting === offer._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Offers: {offers.length} (Active: {offers.filter(o => isOfferActive(o.toDate)).length}, Expired: {offers.filter(o => !isOfferActive(o.toDate)).length})
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 text-center">Delete Offer</h3>
            </div>
            
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to delete this offer? This action cannot be undone.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="inline-block animate-spin">⟳</span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
