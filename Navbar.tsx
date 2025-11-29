import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-2 shadow">
      <h1 className="text-xl font-bold"></h1>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="खोजें..."
          className="border px-2 py-1 rounded w-48"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          खोजें
        </button>
      </div>
    </div>
  );
};

export default Navbar;
