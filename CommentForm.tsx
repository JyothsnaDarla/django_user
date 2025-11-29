import React, { useState } from "react";
import axios from "axios";

interface Props {
  articleId: string | undefined;
  onCommentSubmitted: () => void;
}

const CommentForm = ({ articleId, onCommentSubmitted }: Props) => {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);

    axios
      .post(`http://localhost:8000/api/articles/${articleId}/comments/`, {
        author_name: authorName || "Anonymous",
        content: content.trim(),
      })
      .then(() => {
        setContent("");
        setAuthorName("");
        onCommentSubmitted();
      })
      .catch((err) => {
        console.error("Error submitting comment:", err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <input
        type="text"
        placeholder="आपका नाम (वैकल्पिक)"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        placeholder="अपनी टिप्पणी लिखें..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "भेजा जा रहा है..." : "टिप्पणी भेजें"}
      </button>
    </form>
  );
};

export default CommentForm;
