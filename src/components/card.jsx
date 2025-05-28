import React from "react";

const Card = ({ title, price, image, description }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-md mb-2"
        loading="lazy"
      />
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-green-600 font-bold mb-1">₹{price}</p>
        <p className="text-gray-600 text-sm mb-2 flex-1">{description}</p>
      </div>
    </div>
  );
};

export default Card;
