import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { AnimatePresence } from "framer-motion";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // at the top in your component

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    upper: false,
    lower: false,
    special: false,
    number: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordValid({
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        number: /[0-9]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.password) {
      setLoading(false);
      return toast.error("Password cannot be empty.");
    }
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match.");
    }

    const result = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (result.success) {
      showSuccessToast("Signup successful!");
      navigate("/dashboard");
    } else {
      showErrorToast(result.error || "Signup failed");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800";

  const progress = Object.values(passwordValid).filter(Boolean).length;

  return (
    <motion.div
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 sm:px-4 py-10 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative Background Blobs */}
      <div className="absolute -top-24 -left-24 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 blur-3xl rounded-full z-0" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-[420px] sm:h-[420px] bg-gradient-to-r from-purple-100/30 to-pink-100/30 blur-3xl rounded-full z-0" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-r from-green-100/20 to-emerald-100/20 blur-3xl rounded-full z-0" />
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-20 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-xl bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-transparent mb-2">
          Join ResuMate
        </h1>
        <p className="text-sm sm:text-base text-center text-slate-600 mb-6">
          Create your account to start building professional resumes.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative group">
            <label
              htmlFor="name"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiUser className="text-blue-600" />
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-blue-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg pointer-events-none" />
            </div>
          </div>
          {/* Email */}
          <div className="relative group">
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiMail className="text-blue-600" />
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-blue-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg pointer-events-none" />
            </div>
          </div>
          {/* Password */}
          <div className="relative group">
            <label
              htmlFor="password"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiLock className="text-blue-600" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 pr-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-blue-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg pointer-events-none" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors text-lg"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div className="relative group">
            <label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
            >
              <FiLock className="text-blue-600" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-10 pr-10 border-2 border-slate-200/70 rounded-xl focus:outline-none focus:border-blue-400 bg-white/80 backdrop-blur-sm text-slate-800 font-medium transition-all text-sm sm:text-base"
              />
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-lg pointer-events-none" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors text-lg"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          {/* Password Criteria Loader */}
          <div>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">
              Password Strength:{" "}
              <span
                className={`font-semibold ${
                  progress === 4
                    ? "text-green-600"
                    : progress >= 2
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {progress === 4 ? "Strong" : progress >= 2 ? "Medium" : "Weak"}
              </span>
            </p>

            <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
              <div
                className="h-full bg-sky-600 rounded-full transition-all"
                style={{ width: `${(progress / 4) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-700 bg-sky-50 p-3 rounded-md border border-sky-100">
              <div className="grid grid-cols-2 gap-2">
                <p className="flex items-center gap-2">
                  {passwordValid.upper ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                  At least 1 Uppercase
                </p>
                <p className="flex items-center gap-2">
                  {passwordValid.lower ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                  At least 1 Lowercase
                </p>
                <p className="flex items-center gap-2">
                  {passwordValid.special ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                  1 Special Character
                </p>
                <p className="flex items-center gap-2">
                  {passwordValid.number ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiXCircle className="text-red-500" />
                  )}
                  At least 1 Number
                </p>
              </div>
            </div>
          </div>
          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg ${
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
                  <span className="animate-pulse">Loading...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Sign Up
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <p className="text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
