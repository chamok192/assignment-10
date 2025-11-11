import React from "react";
import { Link, useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Error = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="`flex-grow`">
        <section className="py-8 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-80 h-80 md:w-100 md:h-100 max-w-xl">
                <img
                  src="https://media.tenor.com/IHdlTRsmcS4AAAAM/404.gif"
                  alt="Page not found"
                  className="block mx-auto w-full rounded-xl object-cover"
                />
              </div>

              <h1 className="mt-8 text-3xl md:text-4xl font-bold text-gray-900">
                Oops! Page Not Found
              </h1>
              <p className="mt-3 max-w-2xl text-gray-700">
                The page you’re looking for doesn’t exist or may have been
                moved.
              </p>

              {error && (error.statusText || error.message) ? (
                <p className="mt-1 text-sm text-gray-500">
                  {error.statusText || error.message}
                </p>
              ) : null}

              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Error;
