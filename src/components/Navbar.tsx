import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

const Navbar = () => {
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
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
