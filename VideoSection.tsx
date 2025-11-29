import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface Video {
  id: number;
  video_file: string;
  caption?: string;
}

const VideoSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/videos/")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎥 वीडियो</h2>
        <Button variant="outline" size="sm">
          और देखें
        </Button>
      </div>

      {videos.length === 0 ? (
        <p className="text-muted text-sm">कोई वीडियो उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="space-y-2">
              <Link to={`/video/${video.id}`}>
                <video
                  src={video.video_file}
                  className="w-full rounded-md shadow cursor-pointer hover:opacity-90"
                />
              </Link>
              {video.caption && (
                <p className="text-sm font-medium">{video.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoSection;
