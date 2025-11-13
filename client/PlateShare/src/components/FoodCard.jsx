import React from "react";
import { FiClock, FiCalendar, FiMapPin } from "react-icons/fi";

export const FoodCard = (foods) => {
  const { id, foodName, additionalNotes, foodImage, availability, foodQuantity, expireDate, pickupLocation, donatorName, donatorImage } = foods;
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={foodImage} alt={foodName} className="w-full h-48 object-cover" />

        <div className="absolute top-3 left-3">
          {id.map((id, index) => (
            <span
              key={index}
              className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {id}
            </span>
          ))}
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {availability}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{foodName}</h3>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {additionalNotes}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-green-600 text-sm">
            <FiClock className="w-4 h-4 mr-2" />
            <span>{foodQuantity}</span>
          </div>

          <div className="flex items-center text-red-500 text-sm">
            <FiCalendar className="w-4 h-4 mr-2" />
            <span>Expires in {expireDate}</span>
          </div>

          <div className="flex items-center text-green-600 text-sm">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{pickupLocation}</span>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <img
            src={donatorImage}
            alt={donatorName}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{donatorName}</p>
            <p className="text-xs text-gray-500">{pickupLocation}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
            View Details
          </button>
          <button className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
