import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";

interface Article {
  id: number;
  title: string;
  short_description?: string;
  category?: { name: string };
  images: { image: string; caption: string }[];
  image?: string;
}

const DynamicNewsGrid = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/news/")
      .then((res) => {
        console.log("✅ Articles fetched:", res.data);
        setArticles(res.data);
      })
      .catch((err) => console.error("❌ Error fetching articles:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 min-h-screen">
      {articles.length > 0 ? (
        articles.map((article) => {
          const imageUrl =
            article.image ||
            (article.images?.length > 0
              ? `http://localhost:8000${article.images[0].image}`
              : undefined);

          return (
            <NewsCard
              key={article.id}
              id={article.id}
              title={article.title}
              short_description={article.short_description}
              category={article.category?.name}
              image={imageUrl}
            />
          );
        })
      ) : (
        <p className="text-gray-600 text-center col-span-full">
          No Articles Found
        </p>
      )}
    </div>
  );
};

export default DynamicNewsGrid;
