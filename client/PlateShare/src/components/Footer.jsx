import { Salad } from "lucide-react";
import React from "react";
import { FaLeaf } from "react-icons/fa6";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center bg-green-600 text-white w-12 h-12 rounded-lg">
                <span ><Salad className="h-8 w-8" /></span>
              </div>
              <span className="text-2xl font-bold">PlateShare</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Sharing surplus food with the community to reduce waste and help
              those in need. Together, we can make a difference.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">
              Connect With Us
            </h3>
            <p className="text-gray-300 mb-6">
              Follow us on social media to stay updated on our mission to reduce
              food waste.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label="Visit our Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label="Visit our X (Twitter)"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label="Visit our Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                aria-label="Visit our LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 PlateShare. All rights reserved. Made with ❤️ for a better
              community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
