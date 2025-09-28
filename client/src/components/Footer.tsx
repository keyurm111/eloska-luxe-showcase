import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Download, Award, Shield, Truck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
// Logo from public folder
const eloskLogo = '/eloska logo.png';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Create AbortController for timeout (increased to 30 seconds for Render)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout for Render cold starts

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

          if (result.success) {
            toast({
              title: "Successfully Subscribed!",
              description: "Thank you for subscribing to our newsletter.",
            });
            setEmail('');
          } else {
            toast({
              title: "Error",
              description: result.message || "Failed to subscribe. Please try again.",
              variant: "destructive",
            });
          }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      
      let errorMessage = "Failed to subscribe. Please try again.";
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = `Failed to subscribe: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-glow to-primary"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={eloskLogo} alt="Eloska World" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" />
              <div>
                <h2 className="text-xl font-playfair font-bold text-white">Eloska World</h2>
                <p className="text-xs text-slate-400 font-medium">Luxury Manufacturing</p>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Leading manufacturer of premium Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, and Sari Mirrors. 
              <span className="text-primary font-semibold"> Luxury in every detail.</span>
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs text-slate-300">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs text-slate-300">Trusted Brand</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center group transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center group transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center group transition-all duration-300 hover:scale-110">
                <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-playfair font-bold text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></div>
            </h3>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Home
              </Link>
              <Link to="/about" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Contact
              </Link>
            </div>
            
            {/* Newsletter Section - Moved here and made smaller */}
            <div className="pl-0 pr-4 py-4">
              <div className="text-left">
                <h4 className="text-lg font-playfair font-bold text-white mb-2 relative">
                  Stay Updated
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></div>
                </h4>
                <p className="text-xs text-slate-300 mb-3 mt-4">Get latest updates on new products</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-primary hover:bg-primary-glow text-white font-semibold rounded-md transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
                    <Mail className="h-3 w-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-playfair font-bold text-white relative">
              Our Products
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></div>
            </h3>
            <div className="space-y-3">
              <Link to="/products/regular-silver" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Regular Silver Mirrors
              </Link>
              <Link to="/products/fancy" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Fancy Mirrors
              </Link>
              <Link to="/products/artistic" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Artistic Mirrors
              </Link>
              <Link to="/products/acrylic" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Acrylic Mirrors
              </Link>
              <Link to="/products/catalogues" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Catalogues
              </Link>
              <Link to="/products/mirror-sheet" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Mirrors Sheet
              </Link>
              <Link to="/products/bandhani" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Bandhani Scarf
              </Link>
              <Link to="/products/white-scarf" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                White Scarf
              </Link>
              <Link to="/products/baby-scarf" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Baby Scarf
              </Link>
              <Link to="/products/digital" className="block text-sm text-slate-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Digital Print Fabric
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-playfair font-bold text-white relative">
              Get in Touch
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Email Us</p>
                  <a href="mailto:info@eloskaworld.com" className="text-sm text-white hover:text-primary transition-colors duration-300">
                    info@eloskaworld.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Call Us</p>
                  <a href="tel:+919876543210" className="text-sm text-white hover:text-primary transition-colors duration-300">
                    +91 98765 43210
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Visit Us</p>
                  <span className="text-sm text-white leading-relaxed">
                    PLOT NO,3,GR FLOOR,<br />
                    OPP KATARGAM POLICE STATION,<br />
                    HAZRAT PALNAPIR DARGAH,<br />
                    Surat, Gujarat 395004
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Shipping</p>
                  <span className="text-sm text-white">
                    Pan India Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-sm text-slate-400">
                © 2024 Eloska World. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-slate-400 hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-slate-400 hover:text-primary transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-slate-400 hover:text-primary transition-colors duration-300">
                  Refund Policy
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Made with</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;