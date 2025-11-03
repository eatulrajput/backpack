import { Button } from "@/components/ui/button";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on home page, just scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on different page, navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              ASTRA
            </span>
            <Terminal className="text-accent shrink-0" width={28} height={28} />
          </div>

          {/* Desktop Navigation - Hidden when menu is open */}
          <div className={`hidden md:flex items-center gap-8 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            
            <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">
              Home
            </Link>

            <button 
              onClick={() => handleSectionNavigation('features')}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Features
            </button>
            <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/chat" className="text-muted-foreground hover:text-accent transition-colors">
              AI Assistant
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">
              Contact
            </Link>
            <Link to="/login" className="text-muted-foreground hover:text-accent transition-colors">
              Login
            </Link>
            <Link to="/signup" className="text-muted-foreground hover:text-accent transition-colors">
              Sign Up
            </Link>
          </div>

          {/* Menu Button - Always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Full Screen Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg menu-overlay">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,133,0.1),transparent_50%)] opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(30,144,255,0.08),transparent_50%)] opacity-60"></div>
            
            <div className="flex items-start justify-start min-h-screen px-8 pt-20 relative z-10 bg-black backdrop-blur">

              <div className="text-left space-y-12 menu-content">
                <div className="space-y-8">
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    About
                  </Link>
                  <Link 
                    to="/chat" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    AI Assistant
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    Contact
                  </Link>
                </div>
                
                <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    Login
                  </Link>

                  <Link 
                    to="/signup" 
                    onClick={() => setIsMenuOpen(false)}
                    className="menu-link block text-5xl md:text-7xl font-light text-foreground relative 
                 hover:text-accent transition-colors duration-500
                 after:content-[''] after:block after:w-full after:h-[1px] 
                 after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-700
                 hover:after:scale-x-100"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;