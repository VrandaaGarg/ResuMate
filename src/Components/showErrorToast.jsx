import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";

const showErrorToast = (msg) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 40 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border border-red-200 bg-red-50 text-red-700"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <MdErrorOutline className="text-red-600 text-xl" />
      </motion.div>
      <span className="text-sm font-medium">{msg}</span>
    </motion.div>
  ));
};
export default showErrorToast;
