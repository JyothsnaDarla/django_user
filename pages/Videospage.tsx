import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Videospage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/videos/");
        setVideos(response.data);
      } catch (err) {
        setError("Failed to fetch videos");
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎥 All Videos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg shadow hover:shadow-xl transition cursor-pointer p-2"
            onClick={() => navigate(`/videos/${video.id}`)} // ✅ Correct path
          >
            <video className="w-full rounded-md" muted>
              <source src={video.video_file} type="video/mp4" />
            </video>
            <p className="text-center font-semibold mt-2">{video.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videospage;
