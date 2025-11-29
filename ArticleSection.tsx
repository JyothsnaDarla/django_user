// src/components/ArticleSection.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NewsCard from "./NewsCard";

interface Article {
  id: number;
  title: string;
  short_description: string;
  category?: { name: string };
  images: { image: string }[];
  image?: string;
}

const categoryLabels: Record<string, string> = {
  "top-news": "टॉप न्यूज़",
  sports: "स्पोर्ट्स",
  politics: "राजनीति",
  business: "बिज़नेस",
  entertainment: "मनोरंजन",
  local: "स्थानीय",
  international: "अंतरराष्ट्रीय",
  health: "स्वास्थ्य",
  crime: "क्राइम",
  education: "शिक्षा",
};

const ArticleSection = () => {
  const { name } = useParams(); // 👈 must match your <Route path="/category/:name" />
  const [articles, setArticles] = useState<Article[]>([]);
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const url = name
      ? `${BASE_URL}/api/news/category/${encodeURIComponent(name)}/`
      : `${BASE_URL}/api/news/`;

    axios
      .get(url)
      .then((res) => setArticles(res.data))
      .catch((err) => console.error("Error fetching articles:", err));
  }, [name]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {name ? `${categoryLabels[name] || name} न्यूज़` : "सभी न्यूज़"}
      </h2>

      {articles.length === 0 ? (
        <p className="text-gray-500">इस श्रेणी में कोई लेख उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              category={article.category?.name}
              short_description={article.short_description}
              image={
                article.image
                  ? article.image
                  : article.images?.[0]?.image
                  ? `${BASE_URL}${article.images[0].image}`
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleSection;
