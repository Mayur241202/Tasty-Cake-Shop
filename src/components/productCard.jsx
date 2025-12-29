import React, { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, selectedQty: quantity });
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-2"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col">
        <h3
          className="text-lg font-semibold mb-1"
          style={{ fontFamily: "'Pacifico', cursive, 'Comic Sans MS', cursive" }}
        >
          {product.title}
        </h3>
        <p className="text-green-600 font-bold mb-1">₹{product.price}</p>
        <p className="text-gray-600 text-sm mb-3 flex-1">
          {product.description}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-3 mb-3 bg-pink-50 p-2 rounded-lg">
          <button
            onClick={handleDecrement}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full font-bold transition"
            title="Decrease quantity"
          >
            −
          </button>
          <span className="text-lg font-bold text-pink-700 min-w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full font-bold transition"
            title="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="mt-auto bg-gradient-to-r from-pink-500 to-pink-700 text-white px-6 py-2 rounded-full font-cursive text-lg shadow-lg tracking-wide w-full whitespace-nowrap overflow-hidden text-ellipsis hover:shadow-2xl transition"
          style={{ fontFamily: "'Pacifico', cursive, 'Comic Sans MS', cursive" }}
          onClick={handleAddToCart}
        >
          Add {quantity} to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
