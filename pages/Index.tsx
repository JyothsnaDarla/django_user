// src/pages/Index.tsx
import { useState } from "react";
import Header from "@/components/Header";
import FeaturedNews from "@/components/FeaturedNews";
import VideoSection from "@/components/VideoSection";
import DynamicNewsGrid from "@/components/DynaminNewsGrid";
import VideoGallery from "@/components/VideoGallery";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Sidebar removed */}
      <main className="container py-6 px-4 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FeaturedNews />
            
          </div>
          <div className="lg:col-span-1">
            <VideoSection />
          </div>
        </div>

        {/* Added optional VideoGallery section */}
        <VideoGallery />
      </main>
    </div>
  );
};

export default Index;
