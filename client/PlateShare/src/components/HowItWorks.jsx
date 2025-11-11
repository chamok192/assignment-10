import React from "react";
import { FiUpload } from "react-icons/fi";
import { IoLocationOutline, IoSearch } from "react-icons/io5";

const HowItWorks = () => {
  return (
    <section className="bg-green-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sharing food is simple! Follow these three easy steps to make a
            difference
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-green-100 rounded-2xl p-6 md:p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-green-300">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-700 text-white font-semibold flex items-center justify-center">
              1
            </div>
            <div className="mt-5 w-14 h-14 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <FiUpload className="w-7 h-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-green-800">
              Post Food
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              List your surplus food with details like quantity, expiry date,
              and pickup location.
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-6 md:p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-300">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-700 text-white font-semibold flex items-center justify-center">
              2
            </div>
            <div className="mt-5 w-14 h-14 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <IoSearch className="w-7 h-7 " />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-blue-800">
              Find Food
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Browse available food items, search by category, and filter by
              your location.
            </p>
          </div>

          <div className="bg-white border border-purple-100 rounded-2xl p-6 md:p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-purple-300">
            <div className="w-10 h-10 mx-auto rounded-full bg-green-700 text-white font-semibold flex items-center justify-center">
              3
            </div>
            <div className="mt-5 w-14 h-14 mx-auto rounded-full bg-purple-200 text-purple-700 flex items-center justify-center">
              <IoLocationOutline className="w-7 h-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-purple-800">
              Collect Food
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Request the food and coordinate pickup with the donor at their
              specified location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
