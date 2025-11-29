import React, { useEffect, useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const token = localStorage.getItem("authToken");

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8000/api/categories/");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ You must be logged in to add a category.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/categories/", formData, {
        headers: { Authorization: `Token ${token}` },
      });
      setMessage("✅ Category added successfully!");
      setFormData({ name: "", slug: "" });
      fetchCategories(); // refresh list
    } catch (error: any) {
      const errMsg =
        error.response?.data?.name?.[0] ||
        error.response?.data?.slug?.[0] ||
        error.response?.data?.detail ||
        "Unknown error";
      setMessage("❌ Failed to add category: " + errMsg);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">📂 Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Category Name" required className="w-full p-2 border rounded" />
        <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Add Category</button>
      </form>
      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">📋 Existing Categories</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name} <span className="text-gray-500">({cat.id})</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCategory;
