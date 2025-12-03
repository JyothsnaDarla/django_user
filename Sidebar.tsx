// src/components/Sidebar.tsx
import { useNavigate } from "react-router-dom";
import {
  Flame, Trophy, Landmark, Briefcase, Film, MapPin,
  Globe, HeartPulse, ShieldAlert, GraduationCap
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "टॉप न्यूज़", slug: "top-news", icon: <Flame /> },
    { label: "स्पोर्ट्स", slug: "sports", icon: <Trophy /> },
    { label: "राजनीति", slug: "politics", icon: <Landmark /> },
    { label: "बिज़नेस", slug: "business", icon: <Briefcase /> },
    { label: "मनोरंजन", slug: "entertainment", icon: <Film /> },
    { label: "स्थानीय", slug: "local", icon: <MapPin /> },
    { label: "अंतरराष्ट्रीय", slug: "international", icon: <Globe /> },
    { label: "स्वास्थ्य", slug: "health", icon: <HeartPulse /> },
    { label: "क्राइम", slug: "crime", icon: <ShieldAlert /> },
    { label: "शिक्षा", slug: "education", icon: <GraduationCap /> },
  ];

  return (
    <aside className="w-64 bg-white p-4 space-y-2 shadow">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(`/category/${item.slug}`)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left w-full"
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
