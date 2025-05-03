import { useState, useContext } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const allValid = Object.values(passwordValid).every(Boolean);
    if (!allValid) return toast.error("Password doesn't meet all criteria.");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800";

  const progress = Object.values(passwordValid).filter(Boolean).length;

  return (
    <motion.div
      className="min-h-screen py-11 pb-16 flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          Join ResuMate
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Create your account to start building professional resumes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          {/* Name */}
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <FiUser className="absolute top-9 left-3 text-gray-500" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <FiMail className="absolute top-9 left-3 text-gray-500" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <FiLock className="absolute top-9 left-3 text-gray-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <FiLock className="absolute top-9 left-3 text-gray-500" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password Criteria Loader */}
          <div>
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
          <button
            type="submit"
            className="w-full py-2 bg-sky-700 text-white font-medium rounded hover:bg-sky-800 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Signup;
