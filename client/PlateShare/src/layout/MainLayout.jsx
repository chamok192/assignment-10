import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import SpinnerSVG from "../components/SpinnerSVG";

const MainLayout = () => {
  const navigation = useNavigation();
  const routeLoading = navigation.state === "loading";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <main className="flex-grow relative">
        {routeLoading && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-white/60 backdrop-blur-sm"
            role="status"
            aria-label="Loading page"
          >
            <SpinnerSVG size={72} strokeWidth={6} label="Loading page" />
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
