import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";

const NotFound = () => {
  const location = useLocation();

  // Set page title
  usePageTitle({
    title: "404 - Page Not Found | Eloska World",
    description: "The page you're looking for doesn't exist. Return to Eloska World's homepage to explore our luxury manufacturing products and services."
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-playfair font-bold text-white/20 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-white/80 mb-8">
            The page you're looking for doesn't exist. It might have been moved, deleted, 
            or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
            <Link to="/contact">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
