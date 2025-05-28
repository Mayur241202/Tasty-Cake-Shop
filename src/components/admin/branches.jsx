import React, { useEffect, useState } from "react";

const AdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: "", location: "" });

  // 🔁 Load Branches from Backend
  useEffect(() => {
    fetch("http://localhost:5000/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error("Error loading branches:", err));
  }, []);

  // 🧠 Handle Form Input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ➕ Add New Branch
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location) return;

    try {
      const res = await fetch("http://localhost:5000/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const newBranch = await res.json();
      setBranches([...branches, newBranch]);
      setForm({ name: "", location: "" });
    } catch (err) {
      console.error("Error adding branch:", err);
    }
  };

  // ❌ Delete Branch
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/branches/${id}`, {
        method: "DELETE",
      });
      setBranches(branches.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting branch:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Manage Branches</h2>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center"
      >
        <input
          type="text"
          name="name"
          placeholder="Branch Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
        >
          Add
        </button>
      </form>

      {/* Branch Table */}
      <table className="min-w-full bg-white rounded shadow text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Branch Name</th>
            <th className="py-2 px-4 border-b text-center">Location</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch._id}>
              <td className="py-2 px-4 border-b text-center">{branch.name}</td>
              <td className="py-2 px-4 border-b text-center">{branch.location}</td>
              <td className="py-2 px-4 border-b flex gap-2 justify-center">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(branch._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Branches: {branches.length}
      </div>
    </div>
  );
};

export default AdminBranches;