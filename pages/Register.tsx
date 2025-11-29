import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/users/", formData);
      setMessage("✅ Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      const errMsg =
        error.response?.data?.email?.[0] ||
        error.response?.data?.username?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.re_password?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Unknown error";
      setMessage("❌ Registration failed: " + errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="username"
          type="text"
          onChange={handleChange}
          value={formData.username}
          placeholder="Username"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="re_password"
          type="password"
          onChange={handleChange}
          value={formData.re_password}
          placeholder="Confirm Password"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-red-600">{message}</p>}
    </div>
  );
};

export default Register;
