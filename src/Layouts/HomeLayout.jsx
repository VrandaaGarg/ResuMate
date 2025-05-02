// src/Layouts/HomeLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { motion } from 'framer-motion';

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-primary">
      <Navbar />

      <motion.main
        className="flex-grow pt-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>

      <Footer />
    </div>
  );
};

export default HomeLayout;
