// src/Pages/Signup.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [checkingStrength, setCheckingStrength] = useState(false);
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
      setCheckingStrength(true);
      setTimeout(() => {
        setPasswordValid({
          upper: /[A-Z]/.test(value),
          lower: /[a-z]/.test(value),
          special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
          number: /[0-9]/.test(value),
        });
        setCheckingStrength(false);
      }, 400);
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

    // "Hashing" the password - just for simulation
    const newUser = {
      name: form.name,
      email: form.email,
      password: btoa(form.password), // Base64 encode as placeholder
    };

    saveToLocalStorage(newUser);
    toast.success("Signup successful! You can now log in.");

    // Reset form
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-primary dark:text-white mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            required
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />

          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {checkingStrength ? (
              <p className="text-blue-500">Checking password strength...</p>
            ) : (
              <>
                <p className={passwordValid.upper ? 'text-green-500' : 'text-red-500'}>• At least 1 Uppercase Letter</p>
                <p className={passwordValid.lower ? 'text-green-500' : 'text-red-500'}>• At least 1 Lowercase Letter</p>
                <p className={passwordValid.special ? 'text-green-500' : 'text-red-500'}>• At least 1 Special Character</p>
                <p className={passwordValid.number ? 'text-green-500' : 'text-red-500'}>• At least 1 Number</p>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-accent text-white rounded hover:bg-opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Signup;
