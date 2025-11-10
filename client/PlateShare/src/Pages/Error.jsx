import React from "react";
import { useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Error = () => {
  const error = useRouteError();
  return (
    <div>
      <Navbar />

      <div className="my-8  flex flex-col justify-center items-center">
        <img alt="" />

        <h2 className="text-4xl font-bold mt-4">Oops! Page Not Found!</h2>
        <p className="text-lg mt-2 text-gray-600">
          The page you are looking for does not exist.
        </p>
        <p className="text-lg mt-2 text-gray-600">
          {error.statusText || error.message}
        </p>
        <a
          href="/"
          className="mt-6 px-4 py-2 bg-gradient-to-r from-[#0f8f2f] to-[#43c56a] text-white rounded"
        >
          Go Back!
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default Error;
