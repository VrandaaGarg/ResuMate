import React, { useState } from "react";
import { FiEdit2, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    toast.success("Profile updated!");
    setEditing(false);
  };

  return (
    <div className="min-h-[67lvh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-sky-700/90 text-white flex items-center justify-center text-2xl font-semibold uppercase">
            {user?.name?.charAt(0)}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            {editing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded text-sm"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{user?.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            {editing ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded text-sm"
              />
            ) : (
              <p className="text-gray-700">{user?.email}</p>
            )}
          </div>
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="w-full py-2 bg-sky-700 text-white rounded hover:bg-sky-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="w-full py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-sky-700 text-sky-700 rounded hover:bg-sky-50 transition"
            >
              <FiEdit2 /> Edit Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition"
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
