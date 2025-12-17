// src/components/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Header from './Header';
// import Footer from './footer';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { Email: email, Password: password }
      );
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-32">
      {/* <Header /> */}
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8 text-yellow-600 text-center">
          Admin Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600"
          >
            Login
          </button>
        </form>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminLogin;
