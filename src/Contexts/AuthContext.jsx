import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);

  const signup = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some((u) => u.email === email);
    if (emailExists) return { error: "Email already registered" };

    const newUser = { name, email, password: btoa(password) };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
  };

  const login = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(
      (u) => u.email === email && u.password === btoa(password)
    );
    if (!existingUser) return { error: "Invalid credentials" };

    setUser(existingUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
