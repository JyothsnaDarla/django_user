import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch users (admin only)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/manage-users/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => {
        alert("Access denied! Only admin can view this page.");
        navigate("/profile");
      });
  }, [navigate]);

  // ✅ Delete user function
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Not authorized");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/manage-users/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      alert("User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u.id !== id)); // remove user locally
    } catch (error) {
      alert("Failed to delete user! Only admin can delete users.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users (Admin Only)</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Is Staff</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2 text-center">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2 text-center">
                {user.is_staff ? "✅ Yes" : "❌ No"}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
