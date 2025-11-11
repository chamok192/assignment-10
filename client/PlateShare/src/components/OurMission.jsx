import React from "react";

const OurMission = () => {
  return (
    <section className="bg-green-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-3 text-sm text-gray-700">
                At PlateShare, we want to make sure extra food reaches people who need it. We connect donors with the community so good food never goes to waste.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl leading-none">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Reduce Food Waste</p>
                    <p className="text-xs text-gray-600">Help cut down the amount of food thrown away.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl leading-none">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Fight Hunger</p>
                    <p className="text-xs text-gray-600">Share extra food with families and individuals in need.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl leading-none">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Build Community</p>
                    <p className="text-xs text-gray-600">Bring people together through simple acts of sharing.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://media.istockphoto.com/id/1127769214/photo/zero-waste-shopping-concept.jpg?s=612x612&w=0&k=20&c=AE8mI6Jc16Wgico0nculuyKMMvKk62JakviABHJ2ECs="
                alt="People sharing food"
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
