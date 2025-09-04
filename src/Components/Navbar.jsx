import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaTachometerAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SiGoogleforms } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../Contexts/AuthContext";
import { useLocation } from "react-router-dom";
import showSuccessToast from "./showSuccessToast";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isloginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isForgotPasswordPage = location.pathname === "/forgot-password";

  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showSuccessToast("Logged out successfully!");
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/50 backdrop-blur-md border-b border-sky-100/50 shadow-lg shadow-zinc-200/60"
          : "bg-white/20 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-3 md:py-3 flex items-center justify-between w-full">
        {/* Left: Logo + Sidebar Toggle */}
        <div className="flex items-center gap-3 md:gap-4">
          {!isHomePage &&
            !isSignupPage &&
            !isloginPage &&
            !isForgotPasswordPage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-all duration-200 border border-transparent hover:border-sky-200 shadow-sm hover:shadow-md"
                onClick={toggleSidebar} // ← use the prop here directly
              >
                {isSidebarOpen ? <RxCross2 size={22} /> : <FaBars size={20} />}
              </motion.button>
            )}

          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 md:gap-3 group"
          >
            <img
              src="/logo.png"
              alt="ResuMate Logo"
              className="w-10 h-10 md:w-10 md:h-10"
            />
            <motion.span
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent tracking-wide"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              ResuMate
            </motion.span>
          </Link>
        </div>

        {/* Right: Auth / Dropdown */}
        <div className="relative flex items-center gap-3 md:gap-4">
          {!user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-white border border-sky-200 text-sky-700 rounded-xl font-medium hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-sky-600 to-sky-600 text-white rounded-xl font-medium hover:from-sky-700 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 md:gap-3 bg-white border border-sky-200 text-sky-700 px-3 md:px-4 py-2 md:py-2.5 rounded-xl hover:shadow-lg hover:border-sky-300 hover:bg-sky-50 transition-all duration-300"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-sky-600 to-sky-600 text-white flex items-center justify-center font-bold text-sm md:text-base uppercase shadow-lg">
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-24">
                    {user?.displayName || "User"}
                  </p>
                  {/* <p className="text-xs text-gray-500">Welcome back</p> */}
                </div>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <motion.div
                      key="dropdown"
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-16 w-72 bg-white border border-sky-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="px-6 py-4 bg-gradient-to-r from-sky-50 to-sky-50 border-b border-sky-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-600 to-sky-600 text-white flex items-center justify-center font-bold uppercase shadow-lg">
                            {user?.displayName?.charAt(0).toUpperCase() ||
                              user?.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900">
                              {user?.displayName || "User"}
                            </p>
                            <p className="text-sm text-gray-600 truncate max-w-48">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <motion.div
                          whileHover={{
                            backgroundColor: "rgba(14, 165, 233, 0.05)",
                          }}
                        >
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-sky-700 transition-colors duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaTachometerAlt className="text-sky-600" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </motion.div>

                        <motion.div
                          whileHover={{
                            backgroundColor: "rgba(14, 165, 233, 0.05)",
                          }}
                        >
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-sky-700 transition-colors duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaUser className="text-sky-600" />
                            <span className="font-medium">Profile</span>
                          </Link>
                        </motion.div>

                        <div className="border-t border-sky-100 mt-2 pt-2">
                          <motion.button
                            whileHover={{
                              backgroundColor: "rgba(239, 68, 68, 0.05)",
                            }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <FaSignOutAlt />
                            <span className="font-medium">Sign Out</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
