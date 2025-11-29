import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/token/login/", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("authToken", response.data.auth_token);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error: any) {
      const errMsg =
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Login failed. Please check your credentials.";
      setMessage("❌ " + errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
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
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Login
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-red-600">{message}</p>}
      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <button onClick={() => navigate("/register")} className="text-blue-600 underline">
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
