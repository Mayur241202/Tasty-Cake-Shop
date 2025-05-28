import React from "react";

const Cart = ({ cart, onCheckout, onRemove }) => {
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="bg-pink-50 rounded-xl shadow p-6 mb-6 max-w-md">
      <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.id} className="flex justify-between items-center py-2 border-b">
              <span>{item.name} x {item.qty}</span>
              <span className="flex items-center gap-2">
                ₹{item.qty * item.price}
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemove(item.id)}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold text-right">Total: ₹{cartTotal}</div>
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={onCheckout}
        disabled={cart.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
