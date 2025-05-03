import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

        {/* Page Content */}
        <div className="flex-1 sm:ml-64"> {/* only shift on desktop */}
          <motion.main
            className="px-4 md:px-6 py-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
