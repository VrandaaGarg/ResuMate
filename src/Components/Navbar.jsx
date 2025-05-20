import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SiGoogleforms } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../Contexts/AuthContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("-translate-x-full");
      setSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="sm:hidden text-gray-700 hover:text-sky-700 transition"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <RxCross2 size={22} /> : <FaBars size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <SiGoogleforms className="text-2xl text-sky-700 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-xl font-bold tracking-wide text-gray-900 group-hover:text-sky-700 transition">
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
                className="px-4 py-1.5 bg-white border border-sky-700 text-sky-700 rounded-full font-medium hover:bg-sky-50 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-sky-700 text-white rounded-full font-medium hover:bg-sky-800 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-sky-50 text-sky-700 px-2 py-1.5 rounded-full border border-sky-100 hover:shadow transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center font-semibold text-sm uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-14 w-64 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul className="text-sm divide-y divide-gray-100">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-sky-50 transition"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-sky-50 transition"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition"
                        >
                          <FaSignOutAlt className="text-sm" />
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
