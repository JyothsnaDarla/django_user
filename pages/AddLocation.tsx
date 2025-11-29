import React, { useEffect, useState } from "react";
import axios from "axios";

const AddLocation = () => {
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("authToken");

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/locations/", {
        headers: { Authorization: `Token ${token}` },
      });
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ You must be logged in to add a location.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/locations/", formData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Location added successfully!");
        setFormData({ city: "", state: "", country: "" });
        fetchLocations(); // refresh list
      } else {
        setMessage("❌ Failed to add location: Unexpected response");
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.city?.[0] ||
        error.response?.data?.state?.[0] ||
        error.response?.data?.country?.[0] ||
        error.response?.data?.detail ||
        "Unknown error";
      setMessage("❌ Failed to add location: " + errMsg);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">📍 Add Location</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State (optional)"
          className="w-full p-2 border rounded"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country (optional)"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
          Add Location
        </button>
      </form>
      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">📋 Existing Locations</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {locations.map((loc) => (
            <li key={loc.id}>
              {loc.city}
              {loc.state && `, ${loc.state}`}
              {loc.country && `, ${loc.country}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddLocation;
