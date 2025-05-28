import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence

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
    setLoading(true); // <-- start loading

    const result = await login({
      email: form.email,
      password: form.password,
    });

    setLoading(false); // <-- stop loading

    if (result.success) {
      showSuccessToast("Login successful!");
      navigate("/dashboard");
    } else {
      showErrorToast(result.error || "Login failed");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800";

  return (
    <motion.div
      className="py-9 md:py-20 flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-1">
          Login
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Welcome back to ResuMate! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-500" />
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={inputStyle}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-2 bg-sky-700 text-white font-medium rounded transition flex items-center justify-center relative ${
              loading ? "opacity-80 cursor-not-allowed" : "hover:bg-sky-800"
            }`}
            disabled={loading}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                  }}
                  className="flex items-center gap-2"
                >
                  <span className="animate-pulse">Loading...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Login
                </motion.span>
              )}
            </AnimatePresence>
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
        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-sky-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
