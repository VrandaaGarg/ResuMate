import { FaUser, FaFileAlt, FaHome, FaCogs, FaChartLine, FaRobot } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { 
      path: "/dashboard", 
      icon: FaHome, 
      label: "Dashboard",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      path: "/resume-form",
      icon: FaFileAlt,
      label: "Edit Resume",
      gradient: "from-green-500 to-emerald-400"
    },
    { 
      path: "/resume", 
      icon: FaFileAlt, 
      label: "My Resume",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      path: "/job-fit-analyzer",
      icon: FaChartLine,
      label: "Job Fit Analyzer",
      gradient: "from-orange-500 to-red-400"
    },
    {
      path: "/ats-checker",
      icon: FaRobot,
      label: "ATS Compatibility",
      gradient: "from-indigo-500 to-blue-400"
    },
    { 
      path: "/templates", 
      icon: FaCogs, 
      label: "Templates",
      gradient: "from-teal-500 to-green-400"
    },
    { 
      path: "/profile", 
      icon: FaUser, 
      label: "Profile",
      gradient: "from-pink-500 to-rose-400"
    },
  ];

  return (
    <motion.aside
      id="sidebar"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-16 left-0 z-40 w-72 h-screen pt-8 px-6 bg-white/95 backdrop-blur-md border-r border-white/20 shadow-xl transition-transform duration-300 ease-in-out sm:translate-x-0 -translate-x-full overflow-y-auto"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 mb-8"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg mb-2">
            <span>🚀</span>
            <span>Navigation</span>
          </div>
          <p className="text-sm text-gray-500">Build your career journey</p>
        </div>
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
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Link
                to={item.path}
                className={classNames(
                  "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden",
                  isActive
                    ? "bg-white/80 backdrop-blur-sm shadow-lg border border-white/40"
                    : "hover:bg-white/60 backdrop-blur-sm hover:shadow-md"
                )}
              >
                {/* Active Background Gradient */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-2xl`}
                  />
                )}

                {/* Icon Container */}
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

                {/* Label */}
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

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 mt-8 pt-6 border-t border-gray-200/50"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl">
            <span className="text-sm text-gray-600">Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-red-500"
            >
              ❤️
            </motion.span>
            <span className="text-sm text-gray-600">by ResuMate</span>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
