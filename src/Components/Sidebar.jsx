import {
  FaUser,
  FaFileAlt,
  FaHome,
  FaCogs,
  FaChartLine,
  FaRobot,
  FaUpload,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      icon: FaHome,
      label: "Dashboard",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      path: "/resume-form",
      icon: FaFileAlt,
      label: "Edit Resume",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      path: "/upload-resume",
      icon: FaUpload,
      label: "Upload Resume",
      gradient: "from-yellow-500 to-orange-400",
    },
    {
      path: "/resume",
      icon: FaFileAlt,
      label: "My Resume",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      path: "/job-fit-analyzer",
      icon: FaChartLine,
      label: "Job Fit Analyzer",
      gradient: "from-orange-500 to-red-400",
    },
    {
      path: "/ats-checker",
      icon: FaRobot,
      label: "ATS Compatibility",
      gradient: "from-indigo-500 to-blue-400",
    },
    {
      path: "/templates",
      icon: FaCogs,
      label: "Templates",
      gradient: "from-teal-500 to-green-400",
    },
    {
      path: "/profile",
      icon: FaUser,
      label: "Profile",
      gradient: "from-pink-500 to-rose-400",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Optional Backdrop (for mobile) */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />

          <motion.aside
            id="sidebar"
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] pt-8 md:pt-12 pb-5 px-4 bg-white/95 backdrop-blur-md border-r border-white/20 shadow-xl overflow-y-auto overflow-x-hidden"
          >
            {/* Background Gradient Blobs */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl" />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block relative z-10 mb-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg mb-2">
                <span>🚀</span>
                <span>Navigation</span>
              </div>
              <p className="text-sm text-gray-500">Build your career journey</p>
            </motion.div>

            {/* Menu Items */}
            <ul className="relative z-10 space-y-3 text-sm font-medium">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeSidebar} // auto-close on click
                      className={classNames(
                        "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden",
                        isActive
                          ? "bg-white/80 backdrop-blur-sm shadow-lg border border-white/40"
                          : "hover:bg-white/60 backdrop-blur-sm hover:shadow-md"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl`}
                        />
                      )}

                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={classNames(
                          "relative z-10 p-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : "bg-gray-100 text-gray-600 group-hover:bg-white group-hover:shadow-md"
                        )}
                      >
                        <IconComponent size={18} />
                      </motion.div>

                      <span
                        className={classNames(
                          "relative z-10 font-semibold transition-colors duration-300",
                          isActive
                            ? "text-gray-900"
                            : "text-gray-700 group-hover:text-gray-900"
                        )}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Footer
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative z-10 mt-8 pt-6 border-t border-gray-200/50 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl">
                <span className="text-sm text-gray-600">Made with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-red-500"
                >
                  ❤️
                </motion.span>
                <span className="text-sm text-gray-600">by ResuMate</span>
              </div>
            </motion.div> */}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
