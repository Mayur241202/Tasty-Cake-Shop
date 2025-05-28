import React from "react";

const OffersSection = ({ offers }) => (
  <div className="my-8 flex flex-col items-center">
    <h2 className="text-3xl font-bold mb-8 text-pink-700 text-center">Current Offers</h2>
    {offers.length === 0 ? (
      <div className="text-gray-500 text-lg">No offers available at the moment.</div>
    ) : (
      <div className="flex flex-col items-center gap-10 w-full">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-pink-50 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-3 text-pink-800 text-center">{offer.title}</h3>
            <div className="mb-2 text-base text-gray-600 text-center">
              {offer.branch === "all" ? "All Branches" : `Branch: ${offer.branch}`}
            </div>
            <div className="mb-4 text-base text-gray-600 text-center">
              Duration: {offer.fromDate} to {offer.toDate}
            </div>
            <div className="flex justify-center w-full">
              {offer.fileUrl && offer.fileName && offer.fileName.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <img
                  src={offer.fileUrl}
                  alt={offer.title}
                  className="max-h-[400px] rounded shadow mb-2 object-contain w-full"
                  style={{ background: "#fff" }}
                />
              )}
              {offer.fileUrl && offer.fileName && offer.fileName.match(/\.pdf$/i) && (
                <iframe
                  src={offer.fileUrl}
                  title={offer.title}
                  className="w-full h-[500px] rounded shadow mb-2"
                />
              )}
              {offer.fileUrl && offer.fileName && !offer.fileName.match(/\.(jpg|jpeg|png|gif|pdf)$/i) && (
                <div className="text-gray-500">{offer.fileName}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OffersSection;
