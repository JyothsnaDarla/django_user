import React, { useEffect, useState } from "react";
import axios from "axios";

const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    detailed_description: "",
    category: "",
    location: "",
    is_published: true,
    image: null as File | null,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]); // ✅ For preview
  const [message, setMessage] = useState("");
  const [translating, setTranslating] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const token = localStorage.getItem("authToken");

  // ✅ Fetch categories, locations, and articles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes, articleRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories/"),
          axios.get("http://127.0.0.1:8000/api/locations/"),
          axios.get("http://127.0.0.1:8000/api/news/"),
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
        setArticles(articleRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle input fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // ✅ Translate text using Azure API
  const translateText = async (text: string) => {
    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const apiKey =
      "9OdIkAcmTArBMcFXURX0z0OlQSyrohiqdS2WraHmFERRHcYzAafCJQQJ99BJACqBBLyXJ3w3AAAbACOGpFJZ";
    const region = "southeastasia";

    try {
      const response = await axios.post(
        `${endpoint}/translate?api-version=3.0&to=hi`,
        [{ Text: text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": region,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data[0].translations[0].text;
    } catch (error) {
      console.error("Translation failed:", error);
      throw error;
    }
  };

  // ✅ Translate all fields
  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const [title, shortDesc, detailedDesc] = await Promise.all([
        translateText(formData.title),
        translateText(formData.short_description),
        translateText(formData.detailed_description),
      ]);
      setFormData({
        ...formData,
        title,
        short_description: shortDesc,
        detailed_description: detailedDesc,
      });
      setMessage("✅ Translated successfully!");
    } catch {
      setMessage("❌ Translation failed. Please check your API key or connection.");
    } finally {
      setTranslating(false);
    }
  };

  // ✅ Submit article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Please login before submitting.");
      return;
    }

    if (!agreed) {
      setMessage("⚠️ Please agree to the Guidelines for Online News before submitting.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("short_description", formData.short_description);
    data.append("detailed_description", formData.detailed_description);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("is_published", String(formData.is_published));
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/news/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Article added successfully!");
      setFormData({
        title: "",
        short_description: "",
        detailed_description: "",
        category: "",
        location: "",
        is_published: true,
        image: null,
      });
      setAgreed(false);

      // ✅ Refresh article list after submission
      const updatedArticles = await axios.get("http://127.0.0.1:8000/api/news/");
      setArticles(updatedArticles.data);
    } catch (error: any) {
      const errMsg =
        error.response?.data?.title?.[0] ||
        error.response?.data?.detail ||
        "Unknown error while submitting.";
      setMessage("❌ Submission failed: " + errMsg);
    }
  };

  // ✅ Delete article
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/news/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setArticles(articles.filter((article) => article.id !== id));
      setMessage(`🗑️ Article deleted successfully!`);
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("❌ Failed to delete article.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">📰 Add Article</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          placeholder="Short Description"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="detailed_description"
          value={formData.detailed_description}
          onChange={handleChange}
          placeholder="Detailed Description"
          required
          className="w-full p-2 border rounded"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Location Dropdown */}
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city || loc.name}
              {loc.state && `, ${loc.state}`}
              {loc.country && `, ${loc.country}`}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
          />
          Publish immediately
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {/* Guidelines Checkbox */}
        <div className="border-t pt-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                href="/guidelines"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Guidelines for Online News
              </a>
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!agreed}
            className={`flex-1 py-2 rounded text-white ${
              agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Article
          </button>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            {translating ? "Translating..." : "Translate to Hindi"}
          </button>
        </div>
      </form>

      {/* ✅ Article Preview Section */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-bold mb-4">🗞️ Existing Articles</h3>
        {articles.length === 0 ? (
          <p className="text-gray-500">No articles found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition relative"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h4 className="font-semibold text-lg">{article.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {article.short_description}
                </p>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default AddArticle;
