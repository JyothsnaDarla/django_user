import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "@/components/CommentForm";

interface Comment {
  id: number;
  content: string;
  author_name?: string;
}

interface Article {
  id: number;
  title: string;
  short_description?: string;
  detailed_description?: string;
  image?: string;
  images?: { image: string }[];
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const BASE_URL = "http://localhost:8000";

  // 📰 Fetch article + comments
  const fetchArticle = async () => {
    try {
      const articleRes = await axios.get(`${BASE_URL}/api/news/${id}/`);
      setArticle(articleRes.data);

      const commentsRes = await axios.get(`${BASE_URL}/api/articles/${id}/comments/`);
      setComments(commentsRes.data);
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (!article)
    return <div className="p-6 text-gray-500 text-center">Loading article...</div>;

  // ✅ Decide best image URL
  const imageUrl =
    article.image && article.image !== ""
      ? article.image.startsWith("http")
        ? article.image
        : `${BASE_URL}${article.image}`
      : article.images && article.images.length > 0
      ? `${BASE_URL}${article.images[0].image}`
      : "/placeholder.jpg";

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* 📰 Article Title + Description */}
      <h1 className="text-3xl font-bold text-gray-800">{article.title}</h1>
      {article.short_description && (
        <p className="text-gray-700 text-lg">{article.short_description}</p>
      )}
      {article.detailed_description && (
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.detailed_description}
        </p>
      )}

      {/* 🖼️ Main Image */}
      <div className="space-y-4">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full rounded-lg shadow-md object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder.jpg";
          }}
        />
      </div>

      {/* 💬 Comments Section */}
      <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
        <h2 className="text-xl font-bold text-gray-800">Comments</h2>

        {/* Comment Form */}
        <CommentForm articleId={id} onCommentSubmitted={fetchArticle} />

        {/* Display Comments */}
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
            >
              <p className="text-gray-800">{c.content}</p>
              <small className="text-gray-500">
                — {c.author_name || "Anonymous"}
              </small>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
