// src/Pages/ForgotPassword.jsx
import { useState } from "react";
import { motion } from "framer-motion";
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

  const inputStyle =
    "w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800";

  return (
    <motion.div
      className="py-12 md:py-20 flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-sky-700 text-white font-medium rounded hover:bg-sky-800 transition"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-sky-700 font-medium hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
