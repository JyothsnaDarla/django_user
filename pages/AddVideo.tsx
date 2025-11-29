import React, { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  id: number;
  caption: string;
  description?: string;
  video_file: string;
}

const AddVideo = () => {
  const [formData, setFormData] = useState({
    caption: "",
    description: "",
    video_file: null as File | null,
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [message, setMessage] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const token = localStorage.getItem("authToken");

  // ✅ Fetch all uploaded videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/videos/", {
        headers: { Authorization: `Token ${token}` },
      });
      setVideos(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle video file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, video_file: e.target.files[0] });
    }
  };

  // ✅ Azure Translator API (English → Hindi)
  const translateText = async (text: string) => {
    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const apiKey = "9OdIkAcmTArBMcFXURX0z0OlQSyrohiqdS2WraHmFERRHcYzAafCJQQJ99BJACqBBLyXJ3w3AAAbACOGpFJZ";
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
  };

  // ✅ Translate caption & description (like AddArticle)
  const handleTranslate = async () => {
    if (!formData.caption && !formData.description) {
      setMessage("⚠️ Please fill in caption or description to translate.");
      return;
    }
    setTranslating(true);
    try {
      const [caption, description] = await Promise.all([
        translateText(formData.caption),
        translateText(formData.description),
      ]);
      setFormData({
        ...formData,
        caption,
        description,
      });
      setTranslatedText(description);
      setMessage("✅ Translated to Hindi successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Translation failed. Check your API key or region.");
    } finally {
      setTranslating(false);
    }
  };

  // ✅ Submit video upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ You must be logged in to upload a video.");
      return;
    }

    const data = new FormData();
    data.append("caption", formData.caption);
    data.append("description", formData.description);
    if (formData.video_file) {
      data.append("video_file", formData.video_file);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/videos/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Video uploaded successfully!");
        setFormData({ caption: "", description: "", video_file: null });
        setTranslatedText("");
        fetchVideos();
      } else {
        setMessage("❌ Upload failed: Unexpected response");
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.caption?.[0] ||
        error.response?.data?.video_file?.[0] ||
        error.response?.data?.detail ||
        "Unknown error";
      setMessage("❌ Upload failed: " + errMsg);
    }
  };

  // ✅ Delete video
  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8000/api/videos/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchVideos();
      if (selectedVideo?.id === id) setSelectedVideo(null);
    } catch (error) {
      console.error("❌ Failed to delete video:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">🎥 Add Video</h2>

      {/* ✅ Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          placeholder="Video Caption"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Description..."
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* ✅ Translate Button */}
        <button
          type="button"
          onClick={handleTranslate}
          disabled={translating}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          {translating ? "Translating..." : "Translate to Hindi"}
        </button>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Upload Video
        </button>
      </form>

      {message && <p className="text-sm text-green-700 font-medium">{message}</p>}

      {/* ✅ Uploaded Videos List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">📋 Uploaded Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="border rounded-lg shadow hover:shadow-lg transition p-3"
            >
              <video
                className="w-full rounded-md cursor-pointer"
                muted
                onClick={() => setSelectedVideo(vid)}
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
              >
                <source src={vid.video_file} type="video/mp4" />
              </video>
              <p className="text-center font-medium mt-2">{vid.caption}</p>
              <button
                onClick={() => handleDelete(vid.id)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* ✅ Selected Video Details */}
        {selectedVideo && (
          <div className="mt-8 bg-white shadow-lg rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-3 text-center">
              {selectedVideo.caption}
            </h2>
            <video
              src={selectedVideo.video_file}
              controls
              autoPlay
              className="w-full rounded-lg mb-4"
            />
            <p className="text-gray-700 text-center mb-4">
              {selectedVideo.description || "No description available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVideo;
