import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { toast } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false); // <--- Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    try {
      const result = await login({
        email: form.email,
        password: form.password,
      });
      toast.dismiss(toastId);
      if (result.success) {
        showSuccessToast("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      toast.dismiss(toastId);
      showErrorToast(err.message || "Login failed. Please try again.");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800";

  return (
    <motion.div
      className="relative pt-24 px-6 flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-sky-50 sm:px-4 py-10 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative Background Blobs */}
      <div className="absolute -top-24 -left-24 w-60 h-60 sm:w-96 sm:h-96 bg-sky-200/20 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-[420px] sm:h-[420px] bg-sky-200/15 blur-3xl rounded-full z-0" />
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-20 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent mb-2">
          Login
        </h2>
        <p className="text-sm sm:text-base text-center text-slate-600 mb-7">
          Welcome back to ResuMate! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
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
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-sky-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors text-lg pointer-events-none" />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiLock className="text-sky-600" />
              Password
            </label>
            <div className="relative group rounded-xl focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 pr-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-sky-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              {/* Lock Icon */}
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors text-lg pointer-events-none" />
              {/* Eye Toggle Button */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors text-lg"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg `}
          >
            Login
          </button>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sky-700 text-xs font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        {/* Link to Signup */}
        <p className="mt-6 text-sm text-center text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-sky-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
