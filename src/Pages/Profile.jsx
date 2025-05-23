import React, { useState } from "react";
import { FiEdit2, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import showSuccessToast from "../Components/showSuccessToast";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(form);
    showSuccessToast("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="min-h-[67lvh] flex items-center justify-center px-4 bg-gradient-to-br from-white via-sky-50 to-white">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Profile Avatar */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-sky-700 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md">
            {user?.displayName?.charAt(0)}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-5 mb-6">
          <div>
            <label className="text-sm text-gray-500 font-medium">
              Full Name
            </label>
            {editing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.displayName || user?.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">
              Email Address
            </label>
            {editing ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <p className="text-gray-700 mt-1">{user?.email}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="w-full py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-1.5 md:py-2 border border-sky-700 text-sky-700 rounded-lg hover:bg-sky-50 transition font-medium"
            >
              <FiEdit2 /> Edit
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 md:py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
