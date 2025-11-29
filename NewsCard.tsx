// src/components/NewsCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  short_description?: string;
  category?: string;
  image?: string | null;
}

const BASE_URL = "http://localhost:8000";

const NewsCard = ({ id, title, short_description, category, image }: Props) => {
  // Ensure proper image URL
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`
    : "/placeholder.jpg";

  return (
    <Link to={`/articles/${id}`} className="block">
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white">
        {/* 🖼️ Image Section */}
        <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.jpg";
            }}
            loading="lazy"
          />
        </div>

        {/* 📝 Info Section */}
        <div className="p-3 text-center">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {title}
          </h3>
          {short_description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {short_description}
            </p>
          )}
          {category && (
            <p className="text-xs text-gray-400 mt-1">{category}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
