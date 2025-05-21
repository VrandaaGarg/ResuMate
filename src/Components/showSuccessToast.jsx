import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const showSuccessToast = (message) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-sky-200 bg-[#f9fcfe] text-sky-700`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <FaCheckCircle className="text-sky-700 text-xl" />
      </motion.div>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  ));
};
export default showSuccessToast;
