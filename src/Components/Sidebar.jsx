import { FaUser, FaFileAlt, FaHome, FaCogs } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <FaHome size={18} />, label: "Dashboard" },
    {
      path: "/resume-form",
      icon: <FaFileAlt size={18} />,
      label: "Edit Resume",
    },
    { path: "/resume", icon: <FaFileAlt size={18} />, label: "My Resume" },
    { path: "/templates", icon: <FaCogs size={18} />, label: "Templates" },
    { path: "/profile", icon: <FaUser size={18} />, label: "Profile" },
  ];

  return (
    <aside
      id="sidebar"
      className="fixed top-16 left-0 z-40 w-64 h-screen pt-8 px-4 bg-[#f8fafc] border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out sm:translate-x-0 -translate-x-full"
    >
      <ul className="space-y-1 text-sm font-medium text-gray-700">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={classNames(
                  "flex items-center gap-3 px-3 py-2 rounded-lg group transition-all duration-200",
                  isActive
                    ? "bg-sky-100 text-sky-800 font-semibold"
                    : "hover:bg-sky-50 text-gray-700"
                )}
              >
                <div
                  className={classNames(
                    "p-2 rounded-md flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-sky-200 text-sky-800"
                      : "bg-white group-hover:bg-sky-100 text-gray-500 group-hover:text-sky-700"
                  )}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
