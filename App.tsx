// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FeaturedNews from "./components/FeaturedNews";
import VideoSection from "./components/VideoSection";
import ArticleSection from "./components/ArticleSection";
import ArticleDetail from "./components/ArticleDetail";
import SearchResults from "@/pages/SearchResults";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Videospage from "@/pages/Videospage";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import UserProfile from "@/pages/UserProfile";
import AddArticle from "@/pages/AddArticle";
import AddVideo from "@/pages/AddVideo";
import AddLocation from "@/pages/AddLocation";
import AddCategory from "@/pages/AddCategory";
import Guidelines from "./pages/Guidelines";
import VideoDetail from "./pages/VideoDteail";
import UserProfileIndex from "@/pages/UserProfileIndex";
import ManageUsers from "./pages/ManageUsers";
function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  return (
    <div className="flex">
      
      <main className="flex-1 p-4 space-y-6">
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><FeaturedNews /><ArticleSection /><VideoSection /></>} />
          <Route path="/videos" element={<Videospage />} />
          <Route path="/web-stories" element={<ArticleSection />} />
          <Route path="/epaper" element={<div>📄 E-Paper</div>} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:name" element={<ArticleSection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          {/* Protected Routes */}
          
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/add-article" element={<PrivateRoute><AddArticle /></PrivateRoute>} />
          <Route path="/add-video" element={<PrivateRoute><AddVideo /></PrivateRoute>} />
          <Route path="/add-location" element={<PrivateRoute><AddLocation /></PrivateRoute>} />
          <Route path="/add-category" element={<PrivateRoute><AddCategory /></PrivateRoute>} />
          <Route path="/user-profile" element={<PrivateRoute><UserProfileIndex /></PrivateRoute>} />
          <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
