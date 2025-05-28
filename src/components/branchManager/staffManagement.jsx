import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", contact: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    "x-auth-token": token,
    "Content-Type": "application/json"
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/staff", { headers });
      setStaffList(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to load staff data: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", role: "", contact: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.contact) return;

    setLoading(true);
    const url = editId
      ? `http://localhost:5000/api/staff/${editId}`
      : "http://localhost:5000/api/staff";

    try {
      const res = editId
        ? await axios.put(url, form, { headers })
        : await axios.post(url, form, { headers });

      setStaffList((prev) =>
        editId ? prev.map((s) => (s._id === editId ? res.data : s)) : [...prev, res.data]
      );

      resetForm();
      setError(null);
    } catch (err) {
      console.error("Error submitting staff:", err);
      setError("Failed to submit: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`, { headers });
      setStaffList((prev) => prev.filter((s) => s._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError("Failed to delete staff: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setEditId(staff._id);
    setForm({ name: staff.name, role: staff.role, contact: staff.contact });
  };

  const getBranchName = (staff) => {
    if (!staff.branch) return "N/A";
    return typeof staff.branch === "object" ? staff.branch.name || "Unknown" : `ID: ${staff.branch}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Staff Management</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center"
      >
        {["name", "role", "contact"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        ))}
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white font-semibold ${
            loading
              ? "bg-gray-400"
              : editId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500"
            onClick={resetForm}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      {loading && !staffList.length ? (
        <div className="text-center py-4">Loading staff data...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow text-center">
          <thead>
            <tr>
              {["Name", "Role", "Contact", "Branch", "Actions"].map((title) => (
                <th key={title} className="py-2 px-4 border-b">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td className="py-2 px-4 border-b">{staff.name}</td>
                <td className="py-2 px-4 border-b">{staff.role}</td>
                <td className="py-2 px-4 border-b">{staff.contact}</td>
                <td className="py-2 px-4 border-b">{getBranchName(staff)}</td>
                <td className="py-2 px-4 border-b flex gap-2 justify-center">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(staff)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(staff._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No staff members available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Staff: {staffList.length}
      </div>
    </div>
  );
};

export default StaffManagement;
