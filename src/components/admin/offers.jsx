import React, { useState, useEffect } from "react";

const branches = [
  { id: 1, name: "Central" },
  { id: 2, name: "West" },
  { id: 3, name: "East" },
];

const AdminOffers = () => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerFile, setOfferFile] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Load offers from localStorage on mount
    const saved = JSON.parse(localStorage.getItem("admin_offers") || "[]");
    setOffers(saved);
  }, []);

  const handleFileChange = (e) => {
    setOfferFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offerTitle || !offerFile || !fromDate || !toDate) return;

    // For demo, store file as just name (no upload), but you can use URL.createObjectURL for preview
    const newOffer = {
      id: Date.now(),
      title: offerTitle,
      fileName: offerFile.name,
      fileUrl: URL.createObjectURL(offerFile),
      branch: selectedBranch,
      fromDate,
      toDate,
    };
    const updatedOffers = [...offers, newOffer];
    setOffers(updatedOffers);
    localStorage.setItem("admin_offers", JSON.stringify(updatedOffers));

    setOfferTitle("");
    setOfferFile(null);
    setSelectedBranch("all");
    setFromDate("");
    setToDate("");
    e.target.reset();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Manage Offers</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center"
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
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="border rounded px-3 py-2"
          required
        />
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
          className="border rounded px-3 py-2"
          required
        />
        <span className="font-semibold">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
        >
          Upload Offer
        </button>
      </form>
      <table className="min-w-full bg-white rounded shadow text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Title</th>
            <th className="py-2 px-4 border-b text-center">File</th>
            <th className="py-2 px-4 border-b text-center">Branch</th>
            <th className="py-2 px-4 border-b text-center">From</th>
            <th className="py-2 px-4 border-b text-center">To</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td className="py-2 px-4 border-b text-center">{offer.title}</td>
              <td className="py-2 px-4 border-b text-center">
                <a
                  href={offer.fileUrl}
                  download={offer.fileName}
                  className="text-pink-600 underline"
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
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Offers: {offers.length}
      </div>
    </div>
  );
};

export default AdminOffers;
