import React, { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  id: number;
  video_file: string;
  caption?: string;
}

const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/videos/")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="overflow-x-auto flex gap-4 py-4">
      {videos.length === 0 ? (
        <p className="text-muted text-sm">कोई वीडियो उपलब्ध नहीं है।</p>
      ) : (
        videos.map((video) => (
          <div key={video.id} className="min-w-[300px] space-y-2">
            <video
              src={`http://localhost:8000${video.video_file}`}
              controls
              className="w-full rounded-md shadow"
            />
            {video.caption && (
              <p className="text-sm font-medium">{video.caption}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VideoGallery;
