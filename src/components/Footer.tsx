import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import eloskLogo from '@/assets/eloska-logo.png';

const Footer = () => {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={eloskLogo} alt="Eloska World" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Leading manufacturer of premium Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, and Sari Mirrors. 
              Luxury in every detail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-playfair">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Home
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Contact
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-playfair">Products</h3>
            <div className="space-y-2">
              <Link to="/mirrors" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Mirror Collection
              </Link>
              <Link to="/scarfs" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Scarfs
              </Link>
              <Link to="/bag-fabric" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Bag Fabric
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-playfair">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@eloskaworld.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Your Business Address</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Eloska World. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;