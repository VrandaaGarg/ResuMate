// src/Pages/Login.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === form.email);

    if (!user) return toast.error('User not found!');
    if (atob(user.password) !== form.password) return toast.error('Incorrect password');

    toast.success('Login successful!');
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute top-3 left-3 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white text-sm text-gray-800"
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-sky-700 text-white font-medium rounded hover:bg-sky-800 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account? <a href="/signup" className="text-sky-700 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </motion.div>
  );
}
