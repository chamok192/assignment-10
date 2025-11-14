import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCalendar, FiMapPin } from "react-icons/fi";

function FoodCard({ foods }) {
  const {
    id,
    _id,
    foodName,
    foodImage,
    foodQuantity,
    pickupLocation,
    expireDate,
    foodCategory,
    additionalNotes,
    donatorName,
    donatorImage,
    food_status,
  } = foods || {};

  const routeId = id ?? _id;
  const isAvailable =
    typeof food_status === "string" &&
    food_status.toLowerCase().includes("available");

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={
            foodImage || "https://via.placeholder.com/600x300?text=Food+Image"
          }
          alt={foodName || "Food"}
          className="w-full h-48 object-cover"
        />

        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {foodCategory || "Category"}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-400 text-red-800"
            }`}
          >
            {food_status || "Status"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">
          {foodName || "Food Item"}
        </h3>

        {additionalNotes ? (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {additionalNotes}
          </p>
        ) : null}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-green-600 text-sm">
            <FiClock className="w-4 h-4 mr-2" />
            <span>{foodQuantity || "Quantity not specified"}</span>
          </div>

          <div className="flex items-center text-red-500 text-sm">
            <FiCalendar className="w-4 h-4 mr-2" />
            <span>
              {expireDate ? `Expires in ${expireDate}` : "No expiry set"}
            </span>
          </div>

          <div className="flex items-center text-green-600 text-sm">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{pickupLocation || "Pickup location not set"}</span>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <img
            src={donatorImage || "https://via.placeholder.com/32x32?text=U"}
            alt={donatorName || "Donor"}
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {donatorName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500">{pickupLocation || ""}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/foods/${routeId}`}
            className="flex-1 bg-green-200 text-black py-2.5 px-4 rounded-lg font-medium hover:bg-green-500 transition-colors text-sm text-center"
          >
            View Details
          </Link>
          {/* <button className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
            Request
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
