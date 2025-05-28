import React, { useState } from "react";

const initialInventory = [
  { id: 1, name: "Chocolate Cake", quantity: 10, unit: "pcs", type: "Cakes", price: 300 },
  { id: 2, name: "Veg Puff", quantity: 20, unit: "pcs", type: "Snacks", price: 40 },
  { id: 3, name: "Vanilla Pastry", quantity: 15, unit: "pcs", type: "Pastries", price: 80 },
];

const productTypes = ["Cakes", "Pastries", "Snacks"];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "", type: "Cakes", price: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.unit || !form.type || !form.price) return;
    setInventory([
      ...inventory,
      {
        id: Date.now(),
        name: form.name,
        quantity: Number(form.quantity),
        unit: form.unit,
        type: form.type,
        price: Number(form.price),
      },
    ]);
    setForm({ name: "", quantity: "", unit: "", type: "Cakes", price: "" });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      type: item.type,
      price: item.price,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setInventory(
      inventory.map((item) =>
        item.id === editId
          ? {
              ...item,
              name: form.name,
              quantity: Number(form.quantity),
              unit: form.unit,
              type: form.type,
              price: Number(form.price),
            }
          : item
      )
    );
    setEditId(null);
    setForm({ name: "", quantity: "", unit: "", type: "Cakes", price: "" });
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ name: "", quantity: "", unit: "", type: "Cakes", price: "" });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Product Management</h2>
      <form
        onSubmit={editId ? handleUpdate : handleAdd}
        className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          min="0"
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        >
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          min="0"
          required
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white font-semibold ${
            editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", quantity: "", unit: "", type: "Cakes", price: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table className="min-w-full bg-white rounded shadow text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Quantity</th>
            <th className="py-2 px-4 border-b text-center">Unit</th>
            <th className="py-2 px-4 border-b text-center">Type</th>
            <th className="py-2 px-4 border-b text-center">Price</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b text-center">{item.name}</td>
              <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
              <td className="py-2 px-4 border-b text-center">{item.unit}</td>
              <td className="py-2 px-4 border-b text-center">{item.type}</td>
              <td className="py-2 px-4 border-b text-center">₹{item.price}</td>
              <td className="py-2 px-4 border-b flex gap-2 justify-center">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Products: {inventory.length}
      </div>
    </div>
  );
};

export default InventoryManagement;
