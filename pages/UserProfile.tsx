import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/auth/users/me/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex gap-6 max-w-4xl mx-auto mt-10">
      {/* Sidebar */}
      <aside className="w-64 space-y-2">
        {user && user.email === "admin1234@gmail.com" ? (
          <>
            <button
              onClick={() => navigate("/add-article")}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              📰 Add Article
            </button>
            <button
              onClick={() => navigate("/add-video")}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              🎥 Add Video
            </button>
            <button
              onClick={() => navigate("/add-location")}
              className="w-full bg-purple-600 text-white py-2 rounded"
            >
              📍 Add Location
            </button>
            <button
              onClick={() => navigate("/add-category")}
              className="w-full bg-pink-600 text-white py-2 rounded"
            >
              📂 Add Category
            </button>
            <button
              onClick={() => navigate("/manage-users")}
              className="w-full bg-orange-600 text-white py-2 rounded"
            >
          👥 Manage Users
            </button>
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 rounded"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            🚪 Logout
          </button>
        )}
      </aside>

      {/* Main Section */}
      <section className="flex-1 space-y-2">
        <h2 className="text-2xl font-bold">👤 User Profile</h2>
        {user && (
          <>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
