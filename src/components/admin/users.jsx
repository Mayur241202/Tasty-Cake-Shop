// File: src/components/admin/Users.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getAccessLevel = role => {
  if (role === 'admin') return 'Full';
  if (role === 'branchmanager' || role === 'customer') return 'Limited';
  else return 'None';
};

const AdminUsers = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/users')
      .then(res => {
        const formatted = res.data.map(e => ({
          _id: e._id,
          name: e.name,
          role: e.role,
          branch: e.branch,
          access: getAccessLevel(e.role)
        }));
        setEntries(formatted);
      })
      .catch(err => console.error('Failed to fetch entries', err));
  }, []);

  const handleDelete = async _id => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${_id}`);
      setEntries(entries.filter(e => e._id !== _id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete entry');
    }
  };

  const handleAccessChange = (_id, access) => {
    setEntries(entries.map(e => (e._id === _id ? { ...e, access } : e)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Manage Users & Staff</h2>
      <table className="min-w-full bg-white rounded shadow text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Branch</th>
            <th className="py-2 px-4 border-b">Access</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry._id}>
              <td className="py-2 px-4 border-b">{entry.name}</td>
              <td className="py-2 px-4 border-b">{entry.role}</td>
              <td className="py-2 px-4 border-b">{entry.branch}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={entry.access}
                  onChange={e => handleAccessChange(entry._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Full">Full</option>
                  <option value="Limited">Limited</option>
                  <option value="None">None</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b flex gap-2 justify-center">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(entry._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Entries: {entries.length}
      </div>
    </div>
  );
};

export default AdminUsers;