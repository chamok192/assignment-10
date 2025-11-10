import React from "react";

const Banner = () => {
  return (
    <section className="bg-green-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 mb-8">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Share Food, Reduce Waste, Build Community
          </h1>
          <p className="text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Join thousands of people sharing surplus food and making a positive
            impact on the environment. Together, we can fight hunger and reduce
            food waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search Food</span>
            </button>

            <button className="px-8 py-3 rounded-lg font-semibold text-white flex items-center gap-3 border border-white/60 bg-white/5 hover:bg-white/10 transition">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/70">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12M6 12h12"
                  />
                </svg>
              </span>
              <span>Donate Food</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
