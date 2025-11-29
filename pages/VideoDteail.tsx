// src/pages/VideoDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Video {
  id: number;
  video_file: string;
  caption?: string;
  description?: string;
}

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/videos/${id}/`)
      .then((res) => setVideo(res.data))
      .catch((err) => console.error("Error fetching video details:", err));
  }, [id]);

  if (!video) return <p className="text-center p-8">Loading video...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🎬 Video Details
      </h2>

      {/* ✅ Video Player */}
      <video
        src={video.video_file}
        controls
        autoPlay
        className="w-full rounded-lg shadow-lg"
      />

      {/* ✅ Caption */}
      {video.caption && (
        <p className="text-gray-800 mt-4 text-lg font-semibold">
          🎯 {video.caption}
        </p>
      )}

      {/* ✅ Description */}
      {video.description ? (
        <p className="text-gray-700 text-base mt-2">{video.description}</p>
      ) : (
        <p className="text-gray-500 italic mt-3">No description available.</p>
      )}
    </div>
  );
};

export default VideoDetail;
