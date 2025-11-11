import React from "react";
import { FiBox, FiUsers, FiHeart, FiTrendingDown } from "react-icons/fi";

const OurImpact = ({
  foods = 4,
  members = 2847,
  meals = 15234,
  waste = 24,
}) => {
  return (
    <section className="bg-green-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          Our Community Impact
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          See the real difference we're making together in reducing food waste
          and helping our community
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group bg-white border border-green-100 rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-green-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center transition-colors group-hover:bg-green-200 group-hover:text-green-700">
              <FiBox className="w-6 h-6" />
            </div>
            <div className="mt-4 text-3xl font-bold text-green-700">
              {Number(foods).toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Food Items Available
            </div>
          </div>

          <div className="group bg-white border border-blue-100 rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-200 group-hover:text-blue-700">
              <FiUsers className="w-6 h-6" />
            </div>
            <div className="mt-4 text-3xl font-bold text-blue-700">
              {Number(members).toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-600">Active Members</div>
          </div>

          <div className="group bg-white border border-purple-100 rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center transition-colors group-hover:bg-purple-200 group-hover:text-purple-700">
              <FiHeart className="w-6 h-6" />
            </div>
            <div className="mt-4 text-3xl font-bold text-purple-700">
              {Number(meals).toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-600">Meals Shared</div>
          </div>

          <div className="group bg-white border border-orange-100 rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-orange-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center transition-colors group-hover:bg-orange-200 group-hover:text-orange-700">
              <FiTrendingDown className="w-6 h-6" />
            </div>
            <div className="mt-4 text-3xl font-bold text-orange-600">
              {Number(waste)}%
            </div>
            <div className="mt-1 text-xs text-gray-600">Food Waste Reduced</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurImpact;
