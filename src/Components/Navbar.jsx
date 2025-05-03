import { FaBars } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SiGoogleforms } from "react-icons/si";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
    toast.success("Logged out successfully!");
    navigate('/');
  };

  return (
    <nav className="fixed z-50 w-full backdrop-blur-2xl border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden text-gray-600"
            onClick={() => {
              const sidebar = document.getElementById('sidebar');
              sidebar?.classList.toggle('-translate-x-full');
            }}
          >
            <FaBars size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <SiGoogleforms className="text-[#1e3a8a] text-2xl" />
            <span className="text-xl font-bold text-[#0f172a]">ResuMate</span>
          </Link>
        </div>

        <div className="relative flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-[#1e3a8a] font-medium hover:underline transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-[#1e3a8a] text-white rounded hover:bg-opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>

              <div className="relative">
                <button
                  className="flex items-center bg-gray-800 p-1.5 rounded-full focus:ring"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <img
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-md shadow-lg z-50"
                  >
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-[#0f172a]">{user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <ul className="text-sm divide-y divide-gray-100">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
