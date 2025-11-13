import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

import { AuthContext } from "../Provider/AuthContext";
import { Salad } from "lucide-react";

const Navbar = () => {
  const { user: currentUser, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const linkBase =
    "px-3 py-2 rounded-full text-sm font-medium transition-colors";
  const linkActive = "text-green-700 bg-green-100";
  const linkInactive = "text-gray-600 hover:text-green-700 hover:bg-green-100";

  const renderLinks = (onClick) => (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
        onClick={onClick}
      >
        Home
      </NavLink>

      <NavLink
        to="/available-foods"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
        onClick={onClick}
      >
        Available Foods
      </NavLink>

      {currentUser && (
        <NavLink
          to="/add-food"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
          onClick={onClick}
        >
          Add Food
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-600 text-white shadow-sm">
              <Salad className="h-8 w-8" />
            </span>
            <span className="text-xl font-semibold text-gray-900">
              PlateShare
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {renderLinks()}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
                <img
                  src={
                    currentUser.photoURL ||
                    "https://via.placeholder.com/32x32?text=U"
                  }
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-green-100"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:text-green-700 hover:bg-green-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-4">
              {renderLinks(() => setMobileOpen(false))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        currentUser.photoURL ||
                        "https://via.placeholder.com/32x32?text=U"
                      }
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.displayName || "User"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:text-green-700 hover:bg-green-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
