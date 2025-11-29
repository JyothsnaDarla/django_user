import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, LogOut, User, Edit } from "lucide-react";

interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
}

const UserProfileIndex = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/auth/users/me/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        // ✅ If user is admin, redirect to admin dashboard
        if (res.data.is_staff) {
          navigate("/admin-dashboard");
        } else {
          setUser(res.data);
        }
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4 bg-muted">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted">
              <User className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          {user && (
            <>
              <h2 className="text-xl font-semibold mb-2 text-foreground">
                स्वागत है, {user.username}
              </h2>
              <p className="text-muted-foreground mb-3">{user.email}</p>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:text-accent hover:bg-accent/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            एडिट करें
          </Button>
        </div>

        {/* Menu Card */}
        <Card className="overflow-hidden">
          {/* Membership Details */}
          <button className="w-full px-6 py-4 text-left border-b border-border hover:bg-muted/50 transition-colors">
            <h3 className="font-semibold text-foreground">मेंबरशिप डिटेल्स</h3>
          </button>

          {/* Order History */}
          <button className="w-full px-6 py-4 text-left border-b border-border hover:bg-muted/50 transition-colors flex items-center justify-between">
            <span className="font-semibold text-foreground">ऑर्डर हिस्ट्री</span>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Log Out */}
          <button
            onClick={logout}
            className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-foreground">लॉग आउट करें</span>
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>
      </main>
    </div>
  );
};

export default UserProfileIndex;
