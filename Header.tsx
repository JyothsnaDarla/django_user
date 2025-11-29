import { useNavigate } from "react-router-dom";
import { Home, Video, Search, Newspaper, FileText, User } from "lucide-react";
import { Button } from "./ui/button";
import Navbar from "./Navbar";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <h1 className="text-2xl font-bold">धाकर समाचार</h1>
          </div>
        </div>
        <Navbar />
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
            होम
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <User className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
