import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col">
      {/* Navbar */}
      <Navbar
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        {/* Page Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "sm:ml-72" : "ml-0"
          }`}
        >
          {" "}
          {/* only shift on desktop */}
          <motion.main
            className="px-3 md:px-6 py-2.5 overflow-x-hidden"
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
