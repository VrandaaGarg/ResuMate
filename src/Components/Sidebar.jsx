// src/Components/Sidebar.jsx
import { FaUser, FaFileAlt, FaHome, FaCogs } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/dashboard/profile', icon: <FaUser />, label: 'Profile' },
    { path: '/dashboard/resumes', icon: <FaFileAlt />, label: 'My Resumes' },
    { path: '/dashboard/templates', icon: <FaCogs />, label: 'Templates' },
  ];

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 px-4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform -translate-x-full sm:translate-x-0"
    >
      <ul className="space-y-2 text-sm font-medium">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={classNames(
                'flex items-center p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition-all',
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-800 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300'
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
