import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SiGoogleforms } from "react-icons/si";
import { useAuth } from "../Contexts/AuthContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden text-gray-600 hover:text-sky-700 transition"
            onClick={() => {
              const sidebar = document.getElementById("sidebar");
              sidebar?.classList.toggle("-translate-x-full");
            }}
          >
            <FaBars size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <SiGoogleforms className="text-sky-700 text-2xl group-hover:scale-110 hover:rotate-3 transition-transform duration-200" />
            <span className="text-xl font-bold text-[#0f172a] transition">
              ResuMate
            </span>
          </Link>
        </div>

        {/* Right: Auth / Dropdown */}
        <div className="relative flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 bg-black text-white rounded-full hover:bg-sky-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-sky-700 text-white rounded-full hover:bg-sky-800 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center border border-gray-200 bg-sky-700/10 hover:shadow px-1.5 py-1 rounded-full transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-9 h-9 rounded-full bg-sky-700/85 text-white flex items-center justify-center font-semibold text-lg uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul className="text-sm divide-y divide-gray-100">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-sky-50 transition text-gray-700"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-sky-50 transition text-gray-700"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
