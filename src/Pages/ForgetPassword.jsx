// src/Pages/ForgotPassword.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      showSuccessToast("Reset email sent! Check your inbox.");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative min-h-[70lvh] flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-sky-50 px-2 sm:px-4 py-10 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative Background Blobs */}
      <div className="absolute -top-24 -left-24 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-r from-sky-100/30 to-cyan-100/30 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-[420px] sm:h-[420px] bg-gradient-to-r from-blue-100/30 to-pink-100/30 blur-3xl rounded-full z-0" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-r from-green-100/20 to-emerald-100/20 blur-3xl rounded-full z-0" />
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-20 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm sm:text-base text-center text-slate-600 mb-7">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiMail className="text-sky-600" />
              Email Address
            </label>
            <div className="relative group focus-within:border-sky-300 rounded-xl focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-sky-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors text-lg pointer-events-none" />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <span className="animate-pulse">Sending...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Send Reset Email
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-sky-700 font-medium hover:underline"
          >
            Back to login
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
