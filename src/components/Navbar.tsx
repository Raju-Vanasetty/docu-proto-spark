import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const readUser = () => {
      const raw = localStorage.getItem("fs_user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    readUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "fs_user") readUser();
    };
    const onAuthChange = () => readUser();
    window.addEventListener("storage", onStorage);
    window.addEventListener("fs-auth-change", onAuthChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("fs-auth-change", onAuthChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fs_user");
    window.dispatchEvent(new Event("fs-auth-change"));
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sprout className="h-6 w-6" />
          <span>FarmShare</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-foreground/70 hover:text-foreground transition-colors">
            Browse Plots
          </Link>
          <Link to="/equipment" className="text-foreground/70 hover:text-foreground transition-colors">
            Equipment
          </Link>
          <Link to="/marketplace" className="text-foreground/70 hover:text-foreground transition-colors">
            Marketplace
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={`/dashboard/${user.role || 'user'}`}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
