import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import NewsCard from "@/components/NewsCard";

interface Article {
  id: number;
  title: string;
  short_description?: string;
  category?: { name: string };
  images?: { image_file: string }[];
}

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌐 Translate English → Hindi
  const translateText = async (text: string) => {
    try {
      const endpoint = "https://api.cognitive.microsofttranslator.com";
      const apiKey =
        "9OdIkAcmTArBMcFXURX0z0OlQSyrohiqdS2WraHmFERRHcYzAafCJQQJ99BJACqBBLyXJ3w3AAAbACOGpFJZ";
      const region = "southeastasia";

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
      return text;
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const translatedQuery = await translateText(query);
        console.log("Translated:", translatedQuery);

        const response = await axios.get(
          `http://localhost:8000/api/search/?q=${query}&translated=${encodeURIComponent(
            translatedQuery
          )}`
        );

        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    // ✅ Fix path: if it already starts with "http", return as-is
    if (path.startsWith("http")) return path;
    // ✅ Ensure /media/ path is included
    if (!path.startsWith("/media/")) return `http://localhost:8000/media/${path}`;
    return `http://localhost:8000${path}`;
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">🔄 Searching...</p>;
  }

  if (results.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-gray-800">
          खोज परिणाम: {query}
        </h2>
        <p className="text-gray-600 mt-2">❌ कोई लेख नहीं मिला।</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔍 खोज परिणाम: {query}
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((article) => (
          <NewsCard
            key={article.id}
            id={article.id}
            title={article.title}
            short_description={article.short_description}
            category={article.category?.name}
            image={getImageUrl(article.images?.[0]?.image_file)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
