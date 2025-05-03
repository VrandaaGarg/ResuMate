import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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

    if (name === 'password') {
      setPasswordValid({
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        number: /[0-9]/.test(value),
      });
    }
  };

  const saveToLocalStorage = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    localStorage.setItem('users', JSON.stringify([...users, userData]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allValid = Object.values(passwordValid).every(Boolean);
    if (!allValid) return toast.error("Password doesn't meet all criteria.");
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match.");

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find((u) => u.email === form.email);
    if (userExists) return toast.error("Email already registered!");

    const newUser = {
      name: form.name,
      email: form.email,
      password: btoa(form.password),
    };

    saveToLocalStorage(newUser);
    toast.success("Signup successful! You can now log in.");
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const inputStyle = 'w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800';

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-gray-500" />
            <input
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
            <FiMail className="absolute top-3 left-3 text-gray-500" />
            <input
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
            <FiLock className="absolute top-3 left-3 text-gray-500" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <button type="button" className="absolute top-3 right-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-500" />
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={inputStyle}
            />
            <button type="button" className="absolute top-3 right-3 text-gray-500" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Password Criteria */}
          <div className="text-sm text-gray-700 space-y-1 bg-sky-50 p-3 rounded-md border border-sky-100">
            <p className={passwordValid.upper ? 'text-green-600' : 'text-red-500'}>• At least 1 Uppercase Letter</p>
            <p className={passwordValid.lower ? 'text-green-600' : 'text-red-500'}>• At least 1 Lowercase Letter</p>
            <p className={passwordValid.special ? 'text-green-600' : 'text-red-500'}>• At least 1 Special Character</p>
            <p className={passwordValid.number ? 'text-green-600' : 'text-red-500'}>• At least 1 Number</p>
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
