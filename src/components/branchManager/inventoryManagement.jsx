import React, { useState, useEffect } from "react";

const productTypes = ["Cakes", "Pastries", "Snacks"];
const units = ["pcs", "kg", "g", "box", "pack", "dozen", "ml", "l"];

const InventoryManagement = ({ branch = "Central" }) => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", unit: "pcs", type: "Cakes", price: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [branch]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${branch}`);
      const data = await response.json();
      // Ensure only products from this branch are shown
      const filteredData = data.filter(product => product.branch === branch);
      setProducts(filteredData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error loading products");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm({ name: "", quantity: "", unit: "pcs", type: "Cakes", price: "", image: null });
    setPreviewImage(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.unit || !form.type || !form.price) return;

    // Frontend validation: Check if name contains only numbers
    if (/^\d+$/.test(form.name.trim())) {
      setMessage("Product name must contain letters, not just numbers");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Frontend validation: Check if unit contains only numbers
    if (/^\d+$/.test(form.unit.trim())) {
      setMessage("Unit must contain letters, not just numbers");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Frontend validation: Check if name has at least 3 characters
    if (form.name.trim().length < 3) {
      setMessage("Product name must be at least 3 characters long");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Frontend validation: Check if price is not negative
    if (Number(form.price) < 0) {
      setMessage("Price cannot be negative");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Frontend validation: Check if quantity is not negative
    if (Number(form.quantity) < 0) {
      setMessage("Quantity cannot be negative");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = editId
        ? `http://localhost:5000/api/products/${editId}`
        : `http://localhost:5000/api/products`;

      const method = editId ? "PUT" : "POST";
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("quantity", Number(form.quantity));
      formData.append("unit", form.unit);
      formData.append("type", form.type);
      formData.append("price", Number(form.price));
      if (!editId) {
        formData.append("branch", branch);
      }
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (editId) {
          setProducts(products.map(p => p._id === editId ? data : p));
          setMessage("Product updated successfully!");
        } else {
          setProducts([data, ...products]);
          setMessage("Product added successfully!");
        }
        resetForm();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      type: product.type,
      price: product.price,
      image: null,
    });
    if (product.image) {
      setPreviewImage(`http://localhost:5000${product.image}`);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeleting(productToDelete);
    setShowDeleteModal(false);

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productToDelete));
        setMessage("Product deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product");
    } finally {
      setDeleting(null);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="mb-6 pb-4 border-b-2 border-pink-200">
        <h2 className="text-3xl font-bold mb-2 text-pink-700">Inventory Management</h2>
        <p className="text-lg text-gray-600 font-semibold">
          Branch: <span className="text-pink-600">{branch}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">You can only manage inventory for your assigned branch</p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-center font-semibold ${message.includes("success") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-pink-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-pink-700">{editId ? "Edit Product" : "Add New Product"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            required
          />
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            {productTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded px-3 py-2"
          />
        </div>
        {previewImage && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Image Preview:</p>
            <img
              src={previewImage}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded border border-pink-300"
            />
          </div>
        )}
        <div className="flex gap-3 justify-start">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-pink-100">
              <th className="py-2 px-4 border-b">Product Name</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No products added yet</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id} className="hover:bg-pink-50">
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.type}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">{product.unit}</td>
                  <td className="py-2 px-4 border-b">₹{product.price}</td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-lg text-pink-700 font-semibold text-center">
        Total Products: {products.length}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-6">Delete Product</h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to delete this product? This action cannot be undone.
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
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;