import React, { useState } from "react";

const Cart = ({ cart, onCheckout, onRemove, onBack }) => {
  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: item.qty }), {})
  );

  const cartTotal = cart.reduce((sum, item) => sum + quantities[item.id] * item.price, 0);
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const handleQuantityChange = (id, newQty) => {
    if (newQty > 0) {
      setQuantities((prev) => ({ ...prev, [id]: newQty }));
    }
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => {
      const newQty = prev[id] - 1;
      if (newQty <= 0) {
        onRemove(id);
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-pink-100 mt-2">{totalItems} item(s) in cart</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {cart.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-center">
                Looks like you haven't added any items yet. Start shopping to fill your cart!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition duration-300 border border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-green-600 font-bold text-lg mt-1">₹{item.price}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 w-fit bg-white border border-gray-300 rounded-lg px-1 py-1">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="px-3 py-1 text-lg font-bold text-pink-600 hover:bg-pink-100 rounded transition"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantities[item.id]}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-12 text-center font-semibold text-gray-800 border-0 focus:outline-none bg-transparent"
                          />
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="px-3 py-1 text-lg font-bold text-pink-600 hover:bg-pink-100 rounded transition"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{(quantities[item.id] * item.price).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition font-semibold"
                          title="Remove from cart"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                  {/* Summary Items */}
                  <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-300">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (estimated)</span>
                      <span className="font-semibold">₹{(cartTotal * 0.05).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-bold text-pink-600">
                      ₹{(cartTotal + cartTotal * 0.05).toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105 mb-3"
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-gray-400 transition duration-300"
                    onClick={handleBackClick}
                  >
                    Continue Shopping
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600 space-y-2">
                    <div>✅ Secure Checkout</div>
                    <div>🚚 Fast Delivery</div>
                    <div>💰 Money Back Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;