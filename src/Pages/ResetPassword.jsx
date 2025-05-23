// src/Pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { confirmPasswordReset, getAuth } from "firebase/auth";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import showSuccessToast from "../Components/showSuccessToast";
import showErrorToast from "../Components/showErrorToast";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) setOobCode(code);
    else showErrorToast("Invalid or expired reset link.");
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      showSuccessToast("Password reset successful!");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.message || "Failed to reset password.");
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
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your new password below to reset your account.
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-500" />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-sky-700 text-white font-medium rounded hover:bg-sky-800 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
