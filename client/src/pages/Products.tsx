import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Star, ArrowLeft, ChevronLeft, ChevronRight, Search, Filter, Grid, List, X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';

// Import images
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // Set page title based on category
  usePageTitle({
    title: category ? `${category.charAt(0).toUpperCase() + category.slice(1)} - Products | Eloska World` : "Products - Eloska World",
    description: category ? `Explore our premium ${category} collection at Eloska World. High-quality manufacturing with luxury finishes and designs.` : "Discover our complete range of premium products including Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, Sari Mirrors and more."
  });
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Quote form states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    message: ''
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Scroll animation hooks for different sections
  const [headerRef, headerVisible] = useScrollAnimation();
  const [filtersRef, filtersVisible] = useScrollAnimation();
  const [productsRef, productsVisible] = useScrollAnimation();
  const [paginationRef, paginationVisible] = useScrollAnimation();

  // All product data organized by category
  const productData = {
    'regular-silver': {
      title: 'Regular Silver Mirrors',
      description: 'High-quality regular silver mirrors with crystal clear reflection and premium finish.',
      products: [
        {
          id: 1,
          name: 'Round Shape Silver Mirrors for Art (4mm to 60mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Round shape silver mirrors for art ranging from 4mm to 60mm',
          features: ['Round Shape', '4mm to 60mm', 'Art Quality'],
          rating: 4.8
        },
        {
          id: 2,
          name: 'Almond Shape Silver Mirrors for Art (6mm to 27mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Almond shape silver mirrors for art ranging from 6mm to 27mm',
          features: ['Almond Shape', '6mm to 27mm', 'Art Quality'],
          rating: 4.7
        },
        {
          id: 3,
          name: 'Almond Shape Mirror AL-30',
          category: 'regular-silver',
          price: '₹198.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Almond shape mirror AL-30 with premium silver finish',
          features: ['Almond Shape', 'AL-30 Model', 'Premium Finish'],
          rating: 4.6
        },
        {
          id: 4,
          name: 'Diamond Shape Mirrors for Art (5mm to 48mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Diamond shape mirrors for art ranging from 5mm to 48mm',
          features: ['Diamond Shape', '5mm to 48mm', 'Art Quality'],
          rating: 4.7
        },
        {
          id: 5,
          name: 'Eye Shape Mirror (7mm to 48mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Eye shape mirror ranging from 7mm to 48mm',
          features: ['Eye Shape', '7mm to 48mm', 'Art Quality'],
          rating: 4.5
        },
        {
          id: 6,
          name: 'Square Shape Silver Mirrors for Art (4mm to 60mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Square shape silver mirrors for art ranging from 4mm to 60mm',
          features: ['Square Shape', '4mm to 60mm', 'Art Quality'],
          rating: 4.6
        },
        {
          id: 7,
          name: 'Square Shape Mirror (4,6,7,8 inch)',
          category: 'regular-silver',
          price: '₹250.00',
          image: mirrorsImage,
          description: 'Square shape mirror available in 4, 6, 7, 8 inch sizes',
          features: ['Square Shape', 'Multiple Sizes', '4-8 inch'],
          rating: 4.8
        },
        {
          id: 8,
          name: 'Rectangular Shape Silver Mirrors for Art',
          category: 'regular-silver',
          price: '₹81.00',
          image: mirrorsImage,
          description: 'Rectangular shape silver mirrors for art applications',
          features: ['Rectangular Shape', 'Art Quality', 'Silver Finish'],
          rating: 4.5
        },
        {
          id: 9,
          name: 'Rectangle Shape Mirror (5*7, 6*8 inch)',
          category: 'regular-silver',
          price: '₹200.00',
          image: mirrorsImage,
          description: 'Rectangle shape mirror in 5*7 and 6*8 inch sizes',
          features: ['Rectangle Shape', '5*7 inch', '6*8 inch'],
          rating: 4.7
        },
        {
          id: 10,
          name: 'Triangle Shape Silver Mirrors for Art (5mm to 38mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Triangle shape silver mirrors for art ranging from 5mm to 38mm',
          features: ['Triangle Shape', '5mm to 38mm', 'Art Quality'],
          rating: 4.6
        },
        {
          id: 11,
          name: 'Triangle Shape Mirror (SH 40*57mm)',
          category: 'regular-silver',
          price: '₹96.00',
          image: mirrorsImage,
          description: 'Triangle shape mirror with SH 40*57mm dimensions',
          features: ['Triangle Shape', '40*57mm', 'SH Model'],
          rating: 4.5
        },
        {
          id: 12,
          name: 'Fancy Shape Mirror-A',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type A with unique design',
          features: ['Fancy Shape', 'Type A', 'Unique Design'],
          rating: 4.4
        },
        {
          id: 13,
          name: 'Fancy Shape Mirror-B',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type B with elegant design',
          features: ['Fancy Shape', 'Type B', 'Elegant Design'],
          rating: 4.4
        },
        {
          id: 14,
          name: 'Fancy Shape Mirror-C',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type C with artistic design',
          features: ['Fancy Shape', 'Type C', 'Artistic Design'],
          rating: 4.4
        },
        {
          id: 15,
          name: 'Fancy Shape Mirror-D',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type D with decorative design',
          features: ['Fancy Shape', 'Type D', 'Decorative Design'],
          rating: 4.4
        },
        {
          id: 16,
          name: 'Fancy Shape Mirror-E',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type E with modern design',
          features: ['Fancy Shape', 'Type E', 'Modern Design'],
          rating: 4.4
        },
        {
          id: 17,
          name: 'Fancy Shape Mirror-F',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type F with contemporary design',
          features: ['Fancy Shape', 'Type F', 'Contemporary Design'],
          rating: 4.4
        },
        {
          id: 18,
          name: 'Fancy Shape Mirror-G',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type G with stylish design',
          features: ['Fancy Shape', 'Type G', 'Stylish Design'],
          rating: 4.4
        },
        {
          id: 19,
          name: 'Fancy Shape Mirror-H',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type H with premium design',
          features: ['Fancy Shape', 'Type H', 'Premium Design'],
          rating: 4.4
        },
        {
          id: 20,
          name: 'Fancy Shape Mirror-I',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type I with luxury design',
          features: ['Fancy Shape', 'Type I', 'Luxury Design'],
          rating: 4.4
        },
        {
          id: 21,
          name: 'Fancy Shape Mirror-J',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type J with exclusive design',
          features: ['Fancy Shape', 'Type J', 'Exclusive Design'],
          rating: 4.4
        },
        {
          id: 22,
          name: 'Fancy Shape Mirror-K',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type K with special design',
          features: ['Fancy Shape', 'Type K', 'Special Design'],
          rating: 4.4
        },
        {
          id: 23,
          name: 'Fancy Shape Mirror-L',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type L with unique design',
          features: ['Fancy Shape', 'Type L', 'Unique Design'],
          rating: 4.4
        },
        {
          id: 24,
          name: 'Fancy Shape Mirror-M',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type M with elegant design',
          features: ['Fancy Shape', 'Type M', 'Elegant Design'],
          rating: 4.4
        },
        {
          id: 25,
          name: 'Fancy Shape Mirror-N',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type N with artistic design',
          features: ['Fancy Shape', 'Type N', 'Artistic Design'],
          rating: 4.4
        },
        {
          id: 26,
          name: 'Fancy Shape Mirror-O',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror type O with decorative design',
          features: ['Fancy Shape', 'Type O', 'Decorative Design'],
          rating: 4.4
        },
        {
          id: 27,
          name: 'Fancy Fish Shape Mirror F-27',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy fish shape mirror model F-27',
          features: ['Fish Shape', 'F-27 Model', 'Fancy Design'],
          rating: 4.5
        },
        {
          id: 28,
          name: 'Fancy Shape Mirror P-22 (Right & Left)',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-22 available in right and left orientations',
          features: ['P-22 Model', 'Right & Left', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 29,
          name: 'Fancy Shape Mirror P-24 (Right & Left)',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-24 available in right and left orientations',
          features: ['P-24 Model', 'Right & Left', 'Fancy Shape'],
          rating: 4.5
        },
        {
          id: 30,
          name: 'Fancy Shape Mirror-M-Right',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror M in right orientation',
          features: ['M Model', 'Right Orientation', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 31,
          name: 'Fancy Shape Mirror-M-Left',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror M in left orientation',
          features: ['M Model', 'Left Orientation', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 32,
          name: 'Fancy Shape Mirror-SC',
          category: 'regular-silver',
          price: '₹100.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror SC model',
          features: ['SC Model', 'Fancy Shape', 'Special Design'],
          rating: 4.3
        },
        {
          id: 33,
          name: 'Fancy Shape Mirror-SS-Left',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror SS in left orientation',
          features: ['SS Model', 'Left Orientation', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 34,
          name: 'Fancy Shape Mirror-LF-100',
          category: 'regular-silver',
          price: '₹150.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror LF-100 model',
          features: ['LF-100 Model', 'Fancy Shape', 'Premium Design'],
          rating: 4.5
        },
        {
          id: 35,
          name: 'Fancy Shape Mirror-P-13',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-13 model',
          features: ['P-13 Model', 'Fancy Shape', 'Artistic Design'],
          rating: 4.5
        },
        {
          id: 36,
          name: 'Fancy Shape Mirror P-14',
          category: 'regular-silver',
          price: '₹126.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-14 model with special pricing',
          features: ['P-14 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.6
        },
        {
          id: 37,
          name: 'Fancy Shape Mirror P-15',
          category: 'regular-silver',
          price: '₹126.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-15 model with special pricing',
          features: ['P-15 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.6
        },
        {
          id: 38,
          name: 'Fancy Shape Mirror P-45',
          category: 'regular-silver',
          price: '₹198.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-45 model',
          features: ['P-45 Model', 'Fancy Shape', 'Premium Design'],
          rating: 4.5
        },
        {
          id: 39,
          name: 'Fancy Shape Mirror-LF',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror LF model',
          features: ['LF Model', 'Fancy Shape', 'Artistic Design'],
          rating: 4.4
        },
        {
          id: 40,
          name: 'Fancy Shape Mirror-SS-Right',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror SS in right orientation',
          features: ['SS Model', 'Right Orientation', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 41,
          name: 'Fancy Shape Mirror-V Left',
          category: 'regular-silver',
          price: '₹108.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror V in left orientation',
          features: ['V Model', 'Left Orientation', 'Fancy Shape'],
          rating: 4.7
        },
        {
          id: 42,
          name: 'Fancy Shape Mirror-V Right',
          category: 'regular-silver',
          price: '₹108.00',
          originalPrice: '₹299.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror V in right orientation',
          features: ['V Model', 'Right Orientation', 'Fancy Shape'],
          rating: 4.6
        },
        {
          id: 43,
          name: 'Fancy Bullet Shape Mirror Q-27,29',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy bullet shape mirror models Q-27 and Q-29',
          features: ['Bullet Shape', 'Q-27,29 Models', 'Fancy Design'],
          rating: 4.5
        },
        {
          id: 44,
          name: 'Fancy Shape Mirror-D-10,12',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror D models 10 and 12',
          features: ['D Model', '10,12 Sizes', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 45,
          name: 'Fancy Shape Mirror-C 16,20',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror C models 16 and 20',
          features: ['C Model', '16,20 Sizes', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 46,
          name: 'Fancy Shape Mirror-AB-10,12',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror AB models 10 and 12',
          features: ['AB Model', '10,12 Sizes', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 47,
          name: 'Fancy Shape Mirror-H 24,40 mm',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror H in 24 and 40 mm sizes',
          features: ['H Model', '24,40 mm', 'Fancy Shape'],
          rating: 4.5
        },
        {
          id: 48,
          name: 'Fancy Heart Shape Mirror-H-15,17,27,36',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy heart shape mirror H in sizes 15, 17, 27, 36',
          features: ['Heart Shape', 'H Model', 'Multiple Sizes'],
          rating: 4.6
        },
        {
          id: 49,
          name: 'Fancy Shape Mirror-OV 18,20',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror OV in sizes 18 and 20',
          features: ['OV Model', '18,20 Sizes', 'Fancy Shape'],
          rating: 4.4
        },
        {
          id: 50,
          name: 'Fancy Capsule Shape Mirror C-7,9',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy capsule shape mirror C in sizes 7 and 9',
          features: ['Capsule Shape', 'C Model', '7,9 Sizes'],
          rating: 4.5
        },
        {
          id: 51,
          name: 'Fancy Shape Mirror-Eye',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror in eye design',
          features: ['Eye Design', 'Fancy Shape', 'Artistic'],
          rating: 4.4
        },
        {
          id: 52,
          name: 'Fancy Shape Mirror-Q-18',
          category: 'regular-silver',
          price: '₹198.00',
          originalPrice: '₹299.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror Q-18 model with special pricing',
          features: ['Q-18 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.6
        },
        {
          id: 53,
          name: 'Fancy Shape Mirror-Q-30',
          category: 'regular-silver',
          price: '₹108.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror Q-30 model with special pricing',
          features: ['Q-30 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.7
        },
        {
          id: 54,
          name: 'Fancy Shape Mirror P-18',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-18 model',
          features: ['P-18 Model', 'Fancy Shape', 'Artistic Design'],
          rating: 4.5
        },
        {
          id: 55,
          name: 'Fancy Shape Mirror-HR',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror HR model',
          features: ['HR Model', 'Fancy Shape', 'Special Design'],
          rating: 4.4
        },
        {
          id: 56,
          name: 'Fancy Shape Mirror-Q1',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror Q1 model',
          features: ['Q1 Model', 'Fancy Shape', 'Premium Design'],
          rating: 4.5
        },
        {
          id: 57,
          name: 'Fancy Shape Mirror-P1',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P1 model',
          features: ['P1 Model', 'Fancy Shape', 'Artistic Design'],
          rating: 4.5
        },
        {
          id: 58,
          name: 'Heart Shape Fancy Mirror H-100',
          category: 'regular-silver',
          price: '₹150.00',
          image: mirrorsImage,
          description: 'Heart shape fancy mirror H-100 model',
          features: ['Heart Shape', 'H-100 Model', 'Fancy Design'],
          rating: 4.6
        },
        {
          id: 59,
          name: 'Fancy Shape Mirror-P47',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-47 model',
          features: ['P-47 Model', 'Fancy Shape', 'Artistic Design'],
          rating: 4.5
        },
        {
          id: 60,
          name: 'Fancy Shape Mirror-P48',
          category: 'regular-silver',
          price: '₹198.00',
          originalPrice: '₹1,999.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror P-48 model with special pricing',
          features: ['P-48 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.8
        },
        {
          id: 61,
          name: 'Fancy Shape Mirror-(H-9)',
          category: 'regular-silver',
          price: '₹198.00',
          originalPrice: '₹1,999.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror H-9 model with special pricing',
          features: ['H-9 Model', 'Special Price', 'Fancy Shape'],
          rating: 4.8
        },
        {
          id: 62,
          name: 'Fancy Shape Silver Mirror-(P-9)',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape silver mirror P-9 model',
          features: ['P-9 Model', 'Silver Finish', 'Fancy Shape'],
          rating: 4.5
        },
        {
          id: 63,
          name: 'Fancy Shape Silver Mirror-(LF-50)',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape silver mirror LF-50 model',
          features: ['LF-50 Model', 'Silver Finish', 'Fancy Shape'],
          rating: 4.5
        },
        {
          id: 64,
          name: 'Fancy Shape Silver Mirror-(G-1420)',
          category: 'regular-silver',
          price: '₹126.00',
          image: mirrorsImage,
          description: 'Fancy shape silver mirror G-1420 model',
          features: ['G-1420 Model', 'Silver Finish', 'Fancy Shape'],
          rating: 4.6
        },
        {
          id: 65,
          name: 'Fancy Shape Silver Mirror-(LF-45)',
          category: 'regular-silver',
          price: '₹198.00',
          image: mirrorsImage,
          description: 'Fancy shape silver mirror LF-45 model',
          features: ['LF-45 Model', 'Silver Finish', 'Fancy Shape'],
          rating: 4.5
        },
        {
          id: 66,
          name: 'Fancy Shape Mirror-110 D SHAPE',
          category: 'regular-silver',
          price: '₹100.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror 110 D shape model',
          features: ['110 D Shape', 'Fancy Design', 'Special Shape'],
          rating: 4.3
        },
        {
          id: 67,
          name: 'Fancy Shape Mirror-110 C SHAPE',
          category: 'regular-silver',
          price: '₹100.00',
          image: mirrorsImage,
          description: 'Fancy shape mirror 110 C shape model',
          features: ['110 C Shape', 'Fancy Design', 'Special Shape'],
          rating: 4.3
        },
        {
          id: 68,
          name: 'Fancy Shape Silver Magic Mirror - 1429 (A & B)',
          category: 'regular-silver',
          price: '₹216.00',
          image: mirrorsImage,
          description: 'Fancy shape silver magic mirror 1429 available in A and B variants',
          features: ['Magic Mirror', '1429 Model', 'A & B Variants'],
          rating: 4.7
        },
        {
          id: 69,
          name: 'Fancy Triangle Shape Silver Mirror - 1430',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy triangle shape silver mirror 1430 model',
          features: ['Triangle Shape', '1430 Model', 'Silver Finish'],
          rating: 4.5
        },
        {
          id: 70,
          name: 'Fancy Triangle Shape Silver Mirror - 1431',
          category: 'regular-silver',
          price: '₹108.00',
          image: mirrorsImage,
          description: 'Fancy triangle shape silver mirror 1431 model',
          features: ['Triangle Shape', '1431 Model', 'Silver Finish'],
          rating: 4.5
        },
        {
          id: 71,
          name: 'Kit Mirror-1001',
          category: 'regular-silver',
          price: '₹699.00',
          originalPrice: '₹899.00',
          image: mirrorsImage,
          description: 'Kit mirror for craft applications with premium quality',
          features: ['Craft Kit', 'Premium Quality', 'Mirror Glass'],
          rating: 4.6
        },
        {
          id: 72,
          name: 'Kit Mirror-1003',
          category: 'regular-silver',
          price: '₹699.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1003 for various craft projects',
          features: ['Craft Kit', 'Model 1003', 'Versatile Use'],
          rating: 4.5
        },
        {
          id: 73,
          name: 'Kit Mirror-1004',
          category: 'regular-silver',
          price: '₹749.00',
          originalPrice: '₹899.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1004 with special pricing',
          features: ['Craft Kit', 'Model 1004', 'Special Price'],
          rating: 4.6
        },
        {
          id: 74,
          name: 'Kit Mirror-1005',
          category: 'regular-silver',
          price: '₹699.00',
          originalPrice: '₹799.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1005 for craft and art projects',
          features: ['Craft Kit', 'Model 1005', 'Art Projects'],
          rating: 4.5
        },
        {
          id: 75,
          name: 'Kit Mirror-1006',
          category: 'regular-silver',
          price: '₹849.00',
          originalPrice: '₹899.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1006 with premium finish',
          features: ['Craft Kit', 'Model 1006', 'Premium Finish'],
          rating: 4.6
        },
        {
          id: 76,
          name: 'Kit Mirror-1007',
          category: 'regular-silver',
          price: '₹999.00',
          originalPrice: '₹1,199.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1007 with special pricing',
          features: ['Craft Kit', 'Model 1007', 'Special Price'],
          rating: 4.7
        },
        {
          id: 77,
          name: 'Kit Mirror-1008',
          category: 'regular-silver',
          price: '₹699.00',
          originalPrice: '₹799.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1008 for various applications',
          features: ['Craft Kit', 'Model 1008', 'Versatile'],
          rating: 4.5
        },
        {
          id: 78,
          name: 'Kit Mirror-1009',
          category: 'regular-silver',
          price: '₹405.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1009 with affordable pricing',
          features: ['Craft Kit', 'Model 1009', 'Affordable'],
          rating: 4.4
        },
        {
          id: 79,
          name: 'Kit Mirror-1010',
          category: 'regular-silver',
          price: '₹399.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1010 with special pricing',
          features: ['Craft Kit', 'Model 1010', 'Special Price'],
          rating: 4.5
        },
        {
          id: 80,
          name: 'Kit Mirror-1011',
          category: 'regular-silver',
          price: '₹353.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1011 with discount pricing',
          features: ['Craft Kit', 'Model 1011', 'Discount Price'],
          rating: 4.4
        },
        {
          id: 81,
          name: 'Kit Mirror-1012',
          category: 'regular-silver',
          price: '₹405.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1012 with special pricing',
          features: ['Craft Kit', 'Model 1012', 'Special Price'],
          rating: 4.5
        },
        {
          id: 82,
          name: 'Kit Mirror-1013',
          category: 'regular-silver',
          price: '₹405.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1013 with special pricing',
          features: ['Craft Kit', 'Model 1013', 'Special Price'],
          rating: 4.5
        },
        {
          id: 83,
          name: 'Kit Mirror-1014',
          category: 'regular-silver',
          price: '₹399.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1014 for craft applications',
          features: ['Craft Kit', 'Model 1014', 'Craft Use'],
          rating: 4.4
        },
        {
          id: 84,
          name: 'Kit Mirror-1016',
          category: 'regular-silver',
          price: '₹405.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1016 with special pricing',
          features: ['Craft Kit', 'Model 1016', 'Special Price'],
          rating: 4.5
        },
        {
          id: 85,
          name: 'Kit Mirror-1020',
          category: 'regular-silver',
          price: '₹405.00',
          originalPrice: '₹599.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1020 with special pricing',
          features: ['Craft Kit', 'Model 1020', 'Special Price'],
          rating: 4.6
        },
        {
          id: 86,
          name: 'Kit Mirror-1021',
          category: 'regular-silver',
          price: '₹846.00',
          originalPrice: '₹899.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1021 with premium quality',
          features: ['Craft Kit', 'Model 1021', 'Premium Quality'],
          rating: 4.6
        },
        {
          id: 87,
          name: 'Kit Mirror-1022',
          category: 'regular-silver',
          price: '₹405.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1022 with special pricing',
          features: ['Craft Kit', 'Model 1022', 'Special Price'],
          rating: 4.5
        },
        {
          id: 88,
          name: 'Kit Mirror-1023',
          category: 'regular-silver',
          price: '₹449.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1023 with special pricing',
          features: ['Craft Kit', 'Model 1023', 'Special Price'],
          rating: 4.5
        },
        {
          id: 89,
          name: 'Kit Mirror-1024',
          category: 'regular-silver',
          price: '₹405.00',
          image: mirrorsImage,
          description: 'Kit mirror model 1024 for craft projects',
          features: ['Craft Kit', 'Model 1024', 'Craft Projects'],
          rating: 4.4
        },
        {
          id: 90,
          name: 'Acrylic Kit Mirror - Silver',
          category: 'regular-silver',
          price: '₹1,400.00',
          originalPrice: '₹1,599.00',
          image: mirrorsImage,
          description: 'Acrylic kit mirror in silver finish for premium craft projects',
          features: ['Acrylic Material', 'Silver Finish', 'Premium Quality'],
          rating: 4.8
        },
        {
          id: 91,
          name: 'Acrylic Kit Mirror - Golden',
          category: 'regular-silver',
          price: '₹1,400.00',
          originalPrice: '₹1,599.00',
          image: mirrorsImage,
          description: 'Acrylic kit mirror in golden finish for luxury craft projects',
          features: ['Acrylic Material', 'Golden Finish', 'Luxury Quality'],
          rating: 4.8
        }
      ]
    },
    'fancy': {
      title: 'Fancy Mirrors',
      description: 'Unique and decorative fancy mirrors with artistic designs and special shapes.',
      products: [
        {
          id: 1,
          name: 'Fancy Butterfly Shape Silver Mirror 1421',
          category: 'fancy',
          price: '₹450/piece',
          image: mirrorsImage,
          description: 'Artistic butterfly-shaped mirror perfect for decorative purposes',
          features: ['Butterfly Shape', 'Decorative', 'Artistic Design'],
          rating: 4.7
        }
        // Add more products here
      ]
    },
    'artistic': {
      title: 'Artistic Mirrors',
      description: 'Beautiful and intricate artistic mirrors with unique shapes and designs for decorative purposes.',
      products: [
        {
          id: 92,
          name: 'Fancy Butterfly shape silver mirror 1421 (ONLY MIRROR)',
          category: 'artistic',
          price: '₹1,323.00',
          originalPrice: '₹1,890.00',
          image: mirrorsImage,
          description: 'Fancy butterfly shape silver mirror perfect for decorative purposes',
          features: ['Butterfly Shape', 'Silver Finish', 'Decorative'],
          rating: 4.8
        },
        {
          id: 93,
          name: 'Fancy Butterfly shape silver mirror P-1137',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy butterfly shape silver mirror with P-1137 design',
          features: ['Butterfly Shape', 'P-1137 Design', 'Silver Finish'],
          rating: 4.6
        },
        {
          id: 94,
          name: 'Fancy elephant shape mirror H-108',
          category: 'artistic',
          price: '₹150.00',
          image: mirrorsImage,
          description: 'Fancy elephant shape mirror with H-108 design',
          features: ['Elephant Shape', 'H-108 Design', 'Decorative'],
          rating: 4.5
        },
        {
          id: 95,
          name: 'Fancy elephant shape mirror H-1197 Left',
          category: 'artistic',
          price: '₹150.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy elephant shape mirror H-1197 Left design',
          features: ['Elephant Shape', 'H-1197 Left', 'Decorative'],
          rating: 4.4
        },
        {
          id: 96,
          name: 'Fancy Flower shape mirror (F 1414)',
          category: 'artistic',
          price: '₹126.00',
          image: mirrorsImage,
          description: 'Fancy flower shape mirror with F 1414 design',
          features: ['Flower Shape', 'F 1414 Design', 'Decorative'],
          rating: 4.3
        },
        {
          id: 97,
          name: 'Fancy Flower shape mirror (F 1417)',
          category: 'artistic',
          price: '₹126.00',
          image: mirrorsImage,
          description: 'Fancy flower shape mirror with F 1417 design',
          features: ['Flower Shape', 'F 1417 Design', 'Decorative'],
          rating: 4.3
        },
        {
          id: 98,
          name: 'Fancy Flower shape mirror 1395',
          category: 'artistic',
          price: '₹180.00',
          image: mirrorsImage,
          description: 'Fancy flower shape mirror with 1395 design',
          features: ['Flower Shape', '1395 Design', 'Decorative'],
          rating: 4.4
        },
        {
          id: 99,
          name: 'Fancy Flower shape silver mirror (1438)',
          category: 'artistic',
          price: '₹126.00',
          image: mirrorsImage,
          description: 'Fancy flower shape silver mirror with 1438 design',
          features: ['Flower Shape', 'Silver Finish', '1438 Design'],
          rating: 4.5
        },
        {
          id: 100,
          name: 'Fancy flute & morpankh silver mirror V-1425',
          category: 'artistic',
          price: '₹357.00',
          image: mirrorsImage,
          description: 'Fancy flute and morpankh silver mirror with V-1425 design',
          features: ['Flute Design', 'Morpankh Design', 'Silver Finish'],
          rating: 4.6
        },
        {
          id: 101,
          name: 'Fancy Ganesha shape mirror G-1161',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy Ganesha shape mirror with G-1161 design',
          features: ['Ganesha Shape', 'G-1161 Design', 'Religious'],
          rating: 4.7
        },
        {
          id: 102,
          name: 'Fancy Ganesha shape mirror G-1206',
          category: 'artistic',
          price: '₹150.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy Ganesha shape mirror with G-1206 design',
          features: ['Ganesha Shape', 'G-1206 Design', 'Religious'],
          rating: 4.7
        },
        {
          id: 103,
          name: 'Fancy lion shape silver mirror S-111',
          category: 'artistic',
          price: '₹150.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy lion shape silver mirror with S-111 design',
          features: ['Lion Shape', 'Silver Finish', 'S-111 Design'],
          rating: 4.5
        },
        {
          id: 104,
          name: 'Fancy Lotus Panel shape mirror For Event & Home Decor (1332) (Only Mirror)',
          category: 'artistic',
          price: '₹4,194.00',
          originalPrice: '₹4,999.00',
          image: mirrorsImage,
          description: 'Fancy lotus panel shape mirror perfect for events and home decoration',
          features: ['Lotus Panel', 'Event Decor', 'Home Decor'],
          rating: 4.8
        },
        {
          id: 105,
          name: 'Fancy lotus shape silver mirror K-109',
          category: 'artistic',
          price: '₹88.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with K-109 design',
          features: ['Lotus Shape', 'Silver Finish', 'K-109 Design'],
          rating: 4.4
        },
        {
          id: 106,
          name: 'Fancy Lotus shape silver mirror (1287 - KM)',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹299.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with 1287-KM design',
          features: ['Lotus Shape', 'Silver Finish', '1287-KM Design'],
          rating: 4.5
        },
        {
          id: 107,
          name: 'Fancy Lotus shape silver mirror (1368 - KV)',
          category: 'artistic',
          price: '₹207.00',
          originalPrice: '₹249.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with 1368-KV design',
          features: ['Lotus Shape', 'Silver Finish', '1368-KV Design'],
          rating: 4.5
        },
        {
          id: 108,
          name: 'Fancy Lotus shape silver mirror (1377 - KN)',
          category: 'artistic',
          price: '₹153.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with 1377-KN design',
          features: ['Lotus Shape', 'Silver Finish', '1377-KN Design'],
          rating: 4.4
        },
        {
          id: 109,
          name: 'Fancy Lotus shape silver mirror K-1136',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with K-1136 design',
          features: ['Lotus Shape', 'Silver Finish', 'K-1136 Design'],
          rating: 4.3
        },
        {
          id: 110,
          name: 'Fancy Lotus shape silver mirror K-1143',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy lotus shape silver mirror with K-1143 design',
          features: ['Lotus Shape', 'Silver Finish', 'K-1143 Design'],
          rating: 4.3
        },
        {
          id: 111,
          name: 'Fancy Mirror Lace (L-1415)',
          category: 'artistic',
          price: '₹350.00',
          image: mirrorsImage,
          description: 'Fancy mirror lace with L-1415 design',
          features: ['Lace Design', 'L-1415 Design', 'Decorative'],
          rating: 4.4
        },
        {
          id: 112,
          name: 'Fancy Mirror Lace (L-1422)',
          category: 'artistic',
          price: '₹450.00',
          image: mirrorsImage,
          description: 'Fancy mirror lace with L-1422 design',
          features: ['Lace Design', 'L-1422 Design', 'Decorative'],
          rating: 4.5
        },
        {
          id: 113,
          name: 'Fancy OM shape silver mirror O-1269',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy OM shape silver mirror with O-1269 design',
          features: ['OM Shape', 'Silver Finish', 'Religious'],
          rating: 4.6
        },
        {
          id: 114,
          name: 'Fancy shape silver mirror-(G-1420)',
          category: 'artistic',
          price: '₹126.00',
          image: mirrorsImage,
          description: 'Fancy shape silver mirror with G-1420 design',
          features: ['Fancy Shape', 'Silver Finish', 'G-1420 Design'],
          rating: 4.3
        },
        {
          id: 115,
          name: 'Fancy silver Butterfly shape mirror P-1314',
          category: 'artistic',
          price: '₹1,323.00',
          originalPrice: '₹1,890.00',
          image: mirrorsImage,
          description: 'Fancy silver butterfly shape mirror with P-1314 design',
          features: ['Butterfly Shape', 'Silver Finish', 'P-1314 Design'],
          rating: 4.7
        },
        {
          id: 116,
          name: 'Fancy silver Flower Panel shape mirror For Event-1242 (only Mirror)',
          category: 'artistic',
          price: '₹6,480.00',
          image: mirrorsImage,
          description: 'Fancy silver flower panel shape mirror for events with 1242 design',
          features: ['Flower Panel', 'Event Decor', '1242 Design'],
          rating: 4.8
        },
        {
          id: 117,
          name: 'Fancy silver Flower shape Panel mirror For Event-1296 (Only Mirror)',
          category: 'artistic',
          price: '₹6,480.00',
          image: mirrorsImage,
          description: 'Fancy silver flower shape panel mirror for events with 1296 design',
          features: ['Flower Panel', 'Event Decor', '1296 Design'],
          rating: 4.8
        },
        {
          id: 118,
          name: 'Fancy silver Flower shape Panel mirror For Event-1350 (Only Mirror)',
          category: 'artistic',
          price: '₹6,480.00',
          image: mirrorsImage,
          description: 'Fancy silver flower shape panel mirror for events with 1350 design',
          features: ['Flower Panel', 'Event Decor', '1350 Design'],
          rating: 4.8
        },
        {
          id: 119,
          name: 'Fancy silver flute v-1423',
          category: 'artistic',
          price: '₹150.00',
          image: mirrorsImage,
          description: 'Fancy silver flute mirror with v-1423 design',
          features: ['Flute Design', 'Silver Finish', 'v-1423 Design'],
          rating: 4.4
        },
        {
          id: 120,
          name: 'Fancy silver morpankh shape mirror P-1305',
          category: 'artistic',
          price: '₹207.00',
          image: mirrorsImage,
          description: 'Fancy silver morpankh shape mirror with P-1305 design',
          features: ['Morpankh Shape', 'Silver Finish', 'P-1305 Design'],
          rating: 4.5
        },
        {
          id: 121,
          name: 'Fancy silver parrot shape mirror ( Left & Right) P-1404',
          category: 'artistic',
          price: '₹207.00',
          image: mirrorsImage,
          description: 'Fancy silver parrot shape mirror left and right with P-1404 design',
          features: ['Parrot Shape', 'Left & Right', 'P-1404 Design'],
          rating: 4.5
        },
        {
          id: 122,
          name: 'Fancy silver peacock shape mirror (Left & Right) P-1416',
          category: 'artistic',
          price: '₹207.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror left and right with P-1416 design',
          features: ['Peacock Shape', 'Left & Right', 'P-1416 Design'],
          rating: 4.6
        },
        {
          id: 123,
          name: 'Fancy silver peacock shape mirror (Left & Right) P-1427',
          category: 'artistic',
          price: '₹207.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror left and right with P-1427 design',
          features: ['Peacock Shape', 'Left & Right', 'P-1427 Design'],
          rating: 4.6
        },
        {
          id: 124,
          name: 'Fancy silver peacock shape mirror M-1170-R',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror M-1170-R design',
          features: ['Peacock Shape', 'Silver Finish', 'M-1170-R Design'],
          rating: 4.5
        },
        {
          id: 125,
          name: 'Fancy silver peacock shape mirror M-1179-L',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror M-1179-L design',
          features: ['Peacock Shape', 'Silver Finish', 'M-1179-L Design'],
          rating: 4.5
        },
        {
          id: 126,
          name: 'Fancy silver peacock shape mirror M-1215 (only mirror)',
          category: 'artistic',
          price: '₹2,449.30',
          originalPrice: '₹3,499.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror M-1215 only mirror',
          features: ['Peacock Shape', 'Silver Finish', 'M-1215 Design'],
          rating: 4.7
        },
        {
          id: 127,
          name: 'Fancy silver peacock shape mirror mor-110',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror mor-110 design',
          features: ['Peacock Shape', 'Silver Finish', 'mor-110 Design'],
          rating: 4.5
        },
        {
          id: 128,
          name: 'Fancy silver peacock shape mirror mor-1419',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror mor-1419 design',
          features: ['Peacock Shape', 'Silver Finish', 'mor-1419 Design'],
          rating: 4.5
        },
        {
          id: 129,
          name: 'Fancy silver peacock shape mirror-1424',
          category: 'artistic',
          price: '₹207.00',
          image: mirrorsImage,
          description: 'Fancy silver peacock shape mirror with 1424 design',
          features: ['Peacock Shape', 'Silver Finish', '1424 Design'],
          rating: 4.4
        },
        {
          id: 130,
          name: 'Fancy Silver Sun shape mirror S-112',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy silver sun shape mirror with S-112 design',
          features: ['Sun Shape', 'Silver Finish', 'S-112 Design'],
          rating: 4.4
        },
        {
          id: 131,
          name: 'Fancy silver Tree shape mirror K-1134',
          category: 'artistic',
          price: '₹252.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Fancy silver tree shape mirror with K-1134 design',
          features: ['Tree Shape', 'Silver Finish', 'K-1134 Design'],
          rating: 4.5
        },
        {
          id: 132,
          name: 'Fancy Star shape silver mirror 1224',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy star shape silver mirror with 1224 design',
          features: ['Star Shape', 'Silver Finish', '1224 Design'],
          rating: 4.3
        },
        {
          id: 133,
          name: 'Fancy Swastik shape silver mirror S-1251',
          category: 'artistic',
          price: '₹126.00',
          originalPrice: '₹149.00',
          image: mirrorsImage,
          description: 'Fancy swastik shape silver mirror with S-1251 design',
          features: ['Swastik Shape', 'Silver Finish', 'Religious'],
          rating: 4.6
        },
        {
          id: 134,
          name: 'Fancy Turtle shape mirror K-1135',
          category: 'artistic',
          price: '₹150.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Fancy turtle shape mirror with K-1135 design',
          features: ['Turtle Shape', 'K-1135 Design', 'Decorative'],
          rating: 4.4
        },
        {
          id: 135,
          name: 'Fancy Water Lilly shape mirror W-1152',
          category: 'artistic',
          price: '₹144.00',
          originalPrice: '₹250.00',
          image: mirrorsImage,
          description: 'Fancy water lilly shape mirror with W-1152 design',
          features: ['Water Lilly Shape', 'W-1152 Design', 'Decorative'],
          rating: 4.4
        },
        {
          id: 136,
          name: 'Wall Decore Panel-1432 (Mirror & stencile)',
          category: 'artistic',
          price: '₹3,969.00',
          image: mirrorsImage,
          description: 'Wall decor panel with mirror and stencil design 1432',
          features: ['Wall Decor', 'Mirror & Stencil', '1432 Design'],
          rating: 4.6
        }
      ]
    },
    'acrylic': {
      title: 'Acrylic Mirrors',
      description: 'High-quality acrylic mirrors with various shapes and designs, available in gold and silver finishes.',
      products: [
        {
          id: 137,
          name: 'Acrylic shape A-196',
          category: 'acrylic',
          price: '₹603.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-196 available in gold and silver',
          features: ['Acrylic Material', 'A-196 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 138,
          name: 'Acrylic shape A-197',
          category: 'acrylic',
          price: '₹712.20',
          originalPrice: '₹792.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-197 available in gold and silver',
          features: ['Acrylic Material', 'A-197 Design', 'Gold & Silver'],
          rating: 4.6
        },
        {
          id: 139,
          name: 'Acrylic Eagle shape A-185',
          category: 'acrylic',
          price: '₹1,440.00',
          originalPrice: '₹1,600.00',
          image: mirrorsImage,
          description: 'Acrylic eagle shape mirror A-185 available in gold and silver',
          features: ['Eagle Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.7
        },
        {
          id: 140,
          name: 'Acrylic Sparrow shape A-192',
          category: 'acrylic',
          price: '₹1,215.00',
          originalPrice: '₹1,350.00',
          image: mirrorsImage,
          description: 'Acrylic sparrow shape mirror A-192 available in gold and silver',
          features: ['Sparrow Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.6
        },
        {
          id: 141,
          name: 'Acrylic shape A-138',
          category: 'acrylic',
          price: '₹607.50',
          originalPrice: '₹675.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-138 available in gold and silver',
          features: ['Acrylic Material', 'A-138 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 142,
          name: 'Acrylic shape A-186',
          category: 'acrylic',
          price: '₹702.00',
          originalPrice: '₹850.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-186 available in gold and silver',
          features: ['Acrylic Material', 'A-186 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 143,
          name: 'Acrylic Flamingo shape A-189',
          category: 'acrylic',
          price: '₹713.70',
          originalPrice: '₹1,170.00',
          image: mirrorsImage,
          description: 'Acrylic flamingo shape mirror A-189 available in gold and silver',
          features: ['Flamingo Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.6
        },
        {
          id: 144,
          name: 'Acrylic shape A-162',
          category: 'acrylic',
          price: '₹666.00',
          originalPrice: '₹1,100.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-162 available in gold and silver',
          features: ['Acrylic Material', 'A-162 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 145,
          name: 'Acrylic shape A-176',
          category: 'acrylic',
          price: '₹675.00',
          originalPrice: '₹1,100.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-176 available in gold and silver',
          features: ['Acrylic Material', 'A-176 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 146,
          name: 'Acrylic shape A-178',
          category: 'acrylic',
          price: '₹909.00',
          originalPrice: '₹1,100.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-178 available in gold and silver',
          features: ['Acrylic Material', 'A-178 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 147,
          name: 'Acrylic shape A-179',
          category: 'acrylic',
          price: '₹607.50',
          originalPrice: '₹675.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-179 available in gold and silver',
          features: ['Acrylic Material', 'A-179 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 148,
          name: 'Acrylic shape A-172',
          category: 'acrylic',
          price: '₹580.50',
          originalPrice: '₹675.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-172 available in gold and silver',
          features: ['Acrylic Material', 'A-172 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 149,
          name: 'Acrylic shape A-177',
          category: 'acrylic',
          price: '₹557.28',
          originalPrice: '₹648.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-177 available in gold and silver',
          features: ['Acrylic Material', 'A-177 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 150,
          name: 'Acrylic shape A-183',
          category: 'acrylic',
          price: '₹744.48',
          originalPrice: '₹792.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-183 available in gold and silver',
          features: ['Acrylic Material', 'A-183 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 151,
          name: 'Acrylic shape A-180',
          category: 'acrylic',
          price: '₹554.58',
          originalPrice: '₹702.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-180 available in gold and silver',
          features: ['Acrylic Material', 'A-180 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 152,
          name: 'Acrylic shape A-174',
          category: 'acrylic',
          price: '₹427.68',
          originalPrice: '₹594.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-174 available in gold and silver',
          features: ['Acrylic Material', 'A-174 Design', 'Gold & Silver'],
          rating: 4.3
        },
        {
          id: 153,
          name: 'Acrylic shape A-182',
          category: 'acrylic',
          price: '₹502.20',
          originalPrice: '₹540.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-182 available in gold and silver',
          features: ['Acrylic Material', 'A-182 Design', 'Gold & Silver'],
          rating: 4.3
        },
        {
          id: 154,
          name: 'Acrylic shape A-181',
          category: 'acrylic',
          price: '₹792.00',
          originalPrice: '₹850.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-181 available in gold and silver',
          features: ['Acrylic Material', 'A-181 Design', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 155,
          name: 'Acrylic fancy shape mirror A-171',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-171 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 156,
          name: 'Acrylic Happy Diwali shape A-170',
          category: 'acrylic',
          price: '₹864.00',
          originalPrice: '₹899.00',
          image: mirrorsImage,
          description: 'Acrylic Happy Diwali shape mirror A-170 available in gold',
          features: ['Happy Diwali', 'Acrylic Material', 'Gold Finish'],
          rating: 4.6
        },
        {
          id: 157,
          name: 'Acrylic Happy Diwali shape A-169',
          category: 'acrylic',
          price: '₹576.00',
          originalPrice: '₹599.00',
          image: mirrorsImage,
          description: 'Acrylic Happy Diwali shape mirror A-169 available in gold',
          features: ['Happy Diwali', 'Acrylic Material', 'Gold Finish'],
          rating: 4.5
        },
        {
          id: 158,
          name: 'Acrylic Happy Bhai Dooj shape A-168',
          category: 'acrylic',
          price: '₹504.00',
          originalPrice: '₹599.00',
          image: mirrorsImage,
          description: 'Acrylic Happy Bhai Dooj shape mirror A-168 available in gold',
          features: ['Happy Bhai Dooj', 'Acrylic Material', 'Gold Finish'],
          rating: 4.5
        },
        {
          id: 159,
          name: 'Acrylic fancy shape Lion A-164',
          category: 'acrylic',
          price: '₹306.00',
          originalPrice: '₹450.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape lion mirror A-164 available in silver and golden',
          features: ['Lion Shape', 'Acrylic Material', 'Silver & Golden'],
          rating: 4.4
        },
        {
          id: 160,
          name: 'Acrylic fancy shape Lion A-165',
          category: 'acrylic',
          price: '₹351.00',
          originalPrice: '₹550.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape lion mirror A-165 available in silver and golden',
          features: ['Lion Shape', 'Acrylic Material', 'Silver & Golden'],
          rating: 4.4
        },
        {
          id: 161,
          name: 'Acrylic shape A-166',
          category: 'acrylic',
          price: '₹468.00',
          originalPrice: '₹550.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-166 available in gold and silver',
          features: ['Acrylic Material', 'A-166 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 162,
          name: 'Acrylic deer shape A-163',
          category: 'acrylic',
          price: '₹1,080.00',
          originalPrice: '₹1,500.00',
          image: mirrorsImage,
          description: 'Acrylic deer shape mirror A-163 available in gold and silver',
          features: ['Deer Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.6
        },
        {
          id: 163,
          name: 'Acrylic fancy shape A-158',
          category: 'acrylic',
          price: '₹540.00',
          originalPrice: '₹799.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-158 available in silver and golden',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Golden'],
          rating: 4.4
        },
        {
          id: 164,
          name: 'Acrylic fancy shape A-157',
          category: 'acrylic',
          price: '₹675.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-157 available in silver and golden',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Golden'],
          rating: 4.5
        },
        {
          id: 165,
          name: 'Acrylic shape A-155',
          category: 'acrylic',
          price: '₹360.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-155 available in gold',
          features: ['Acrylic Material', 'A-155 Design', 'Gold Finish'],
          rating: 4.3
        },
        {
          id: 166,
          name: 'Acrylic fancy shape A-154',
          category: 'acrylic',
          price: '₹400.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-154 available in gold and silver',
          features: ['Fancy Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 167,
          name: 'Acrylic fancy shape A-153',
          category: 'acrylic',
          price: '₹270.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-153 available in gold and silver',
          features: ['Fancy Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.3
        },
        {
          id: 168,
          name: 'Acrylic elephant shape A-152',
          category: 'acrylic',
          price: '₹360.00',
          originalPrice: '₹399.00',
          image: mirrorsImage,
          description: 'Acrylic elephant shape mirror A-152 available in gold and silver',
          features: ['Elephant Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 169,
          name: 'Acrylic shape A-148',
          category: 'acrylic',
          price: '₹1,200.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-148 available in gold and silver',
          features: ['Acrylic Material', 'A-148 Design', 'Gold & Silver'],
          rating: 4.6
        },
        {
          id: 170,
          name: 'Acrylic shape A-147',
          category: 'acrylic',
          price: '₹432.00',
          originalPrice: '₹499.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-147 available in gold and silver',
          features: ['Acrylic Material', 'A-147 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 171,
          name: 'Acrylic shubh-vivah shape A-144',
          category: 'acrylic',
          price: '₹1,080.00',
          image: mirrorsImage,
          description: 'Acrylic shubh-vivah shape mirror A-144 available in gold',
          features: ['Shubh Vivah', 'Acrylic Material', 'Gold Finish'],
          rating: 4.6
        },
        {
          id: 172,
          name: 'Acrylic mehandi shape A-145',
          category: 'acrylic',
          price: '₹1,080.00',
          image: mirrorsImage,
          description: 'Acrylic mehandi shape mirror A-145 available in gold',
          features: ['Mehandi Shape', 'Acrylic Material', 'Gold Finish'],
          rating: 4.6
        },
        {
          id: 173,
          name: 'Acrylic mehandi shape A-141',
          category: 'acrylic',
          price: '₹918.00',
          image: mirrorsImage,
          description: 'Acrylic mehandi shape mirror A-141 available in gold',
          features: ['Mehandi Shape', 'Acrylic Material', 'Gold Finish'],
          rating: 4.5
        },
        {
          id: 174,
          name: 'Acrylic fancy butterfly shape mirror A-137',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy butterfly shape mirror A-137 available in silver and gold',
          features: ['Butterfly Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 175,
          name: 'Acrylic fancy shape mirror A-135',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-135 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 176,
          name: 'Acrylic fancy shape mirror A-136',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-136 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 177,
          name: 'Acrylic fancy shape mirror A-133',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-133 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 178,
          name: 'Acrylic fancy shape mirror A-134',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-134 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 179,
          name: 'Acrylic fancy shape mirror A-132',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-132 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 180,
          name: 'Acrylic fancy shape mirror A-131',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-131 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 181,
          name: 'Acrylic jay shree ram shape mirror A-139',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic jay shree ram shape mirror A-139 available in silver and gold',
          features: ['Jay Shree Ram', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 182,
          name: 'Acrylic shape A-142',
          category: 'acrylic',
          price: '₹495.00',
          image: mirrorsImage,
          description: 'Acrylic shape mirror A-142 available in gold and silver',
          features: ['Acrylic Material', 'A-142 Design', 'Gold & Silver'],
          rating: 4.4
        },
        {
          id: 183,
          name: 'Square shape acrylic mirror wall art A-151',
          category: 'acrylic',
          price: '₹612.00',
          originalPrice: '₹1,224.00',
          image: mirrorsImage,
          description: 'Square shape acrylic mirror wall art A-151',
          features: ['Square Shape', 'Wall Art', 'Acrylic Material'],
          rating: 4.5
        },
        {
          id: 184,
          name: 'Acrylic radhe shape A-140',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic radhe shape mirror A-140 available in gold and silver',
          features: ['Radhe Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.3
        },
        {
          id: 185,
          name: 'Acrylic mango mirror A-129',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mango mirror A-129 available in silver and gold',
          features: ['Mango Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 186,
          name: 'Acrylic leaf mirror A-128',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic leaf mirror A-128 available in silver and gold',
          features: ['Leaf Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 187,
          name: 'Acrylic camel shape A-146',
          category: 'acrylic',
          price: '₹734.40',
          originalPrice: '₹1,080.00',
          image: mirrorsImage,
          description: 'Acrylic camel shape mirror A-146 available in gold and silver',
          features: ['Camel Shape', 'Acrylic Material', 'Gold & Silver'],
          rating: 4.5
        },
        {
          id: 188,
          name: 'Acrylic mirror A-112',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mirror A-112 available in silver and gold',
          features: ['Acrylic Material', 'A-112 Design', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 189,
          name: 'Acrylic mirror A-111',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mirror A-111 available in silver and gold',
          features: ['Acrylic Material', 'A-111 Design', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 190,
          name: 'Acrylic mirror A-110',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mirror A-110 available in silver and gold',
          features: ['Acrylic Material', 'A-110 Design', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 191,
          name: 'Acrylic mirror A-114',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mirror A-114 available in silver and gold',
          features: ['Acrylic Material', 'A-114 Design', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 192,
          name: 'Acrylic fancy shape mirror A-127',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-127 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 193,
          name: 'Acrylic fancy shape mirror A-123',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-123 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 194,
          name: 'Acrylic fancy shape mirror A-113',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-113 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 195,
          name: 'Acrylic fancy shape mirror A-108',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-108 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 196,
          name: 'Acrylic fancy shape mirror A-107',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-107 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 197,
          name: 'Acrylic fancy shape mirror A-115',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-115 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 198,
          name: 'Acrylic fancy shape mirror A-101',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-101 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 199,
          name: 'Acrylic normal shape mirror A-100',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-100 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 200,
          name: 'Acrylic normal shape mirror A-104',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-104 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 201,
          name: 'Acrylic normal shape mirror A-99',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-99 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 202,
          name: 'Acrylic normal shape mirror A-106',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-106 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 203,
          name: 'Acrylic normal shape mirror A-103',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-103 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 204,
          name: 'Acrylic fancy shape mirror A-122',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-122 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 205,
          name: 'Acrylic big fancy flower mirror A-72',
          category: 'acrylic',
          price: '₹150.00',
          originalPrice: '₹300.00',
          image: mirrorsImage,
          description: 'Acrylic big fancy flower mirror A-72',
          features: ['Big Flower', 'Fancy Design', 'Acrylic Material'],
          rating: 4.4
        },
        {
          id: 206,
          name: 'Acrylic ganesha shape mirror-13',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic ganesha shape mirror-13 available in silver and gold',
          features: ['Ganesha Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 207,
          name: 'Acrylic ganesha shape mirror-12',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic ganesha shape mirror-12 available in silver and gold',
          features: ['Ganesha Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 208,
          name: 'Acrylic ganesha shape mirror-11',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic ganesha shape mirror-11 available in silver and gold',
          features: ['Ganesha Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 209,
          name: 'Acrylic big fancy lotus shape mirror-70',
          category: 'acrylic',
          price: '₹125.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic big fancy lotus shape mirror-70',
          features: ['Big Lotus', 'Fancy Design', 'Acrylic Material'],
          rating: 4.4
        },
        {
          id: 210,
          name: 'Acrylic happy diwali shape mirror -9',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic happy diwali shape mirror -9 available in silver and gold',
          features: ['Happy Diwali', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 211,
          name: 'Acrylic shubh-labh shape mirror -8',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic shubh-labh shape mirror -8 available in silver and gold',
          features: ['Shubh Labh', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 212,
          name: 'Acrylic ganesha shape mirror-10',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic ganesha shape mirror-10 available in silver and gold',
          features: ['Ganesha Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.3
        },
        {
          id: 213,
          name: 'Acrylic big round shape silver mirror 10,12,14 inch',
          category: 'acrylic',
          price: '₹300.00',
          image: mirrorsImage,
          description: 'Acrylic big round shape silver mirror available in 10, 12, 14 inch sizes',
          features: ['Round Shape', '10-14 inch', 'Silver Finish'],
          rating: 4.5
        },
        {
          id: 214,
          name: 'Acrylic golden big square shape mirror- 10 inch',
          category: 'acrylic',
          price: '₹340.00',
          originalPrice: '₹680.00',
          image: mirrorsImage,
          description: 'Acrylic golden big square shape mirror- 10 inch',
          features: ['Square Shape', '10 inch', 'Golden Finish'],
          rating: 4.4
        },
        {
          id: 215,
          name: 'Acrylic mirror A-109',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic mirror A-109 available in silver and gold',
          features: ['Acrylic Material', 'A-109 Design', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 216,
          name: 'Acrylic normal shape mirror A-102',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic normal shape mirror A-102 available in silver and gold',
          features: ['Normal Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        },
        {
          id: 217,
          name: 'Acrylic fancy shape mirror A-105',
          category: 'acrylic',
          price: '₹100.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Acrylic fancy shape mirror A-105 available in silver and gold',
          features: ['Fancy Shape', 'Acrylic Material', 'Silver & Gold'],
          rating: 4.2
        }
      ]
    },
    'catalogues': {
      title: 'Catalogues',
      description: 'Comprehensive product catalogues showcasing our complete range of mirrors and decorative items.',
      products: [
        {
          id: 218,
          name: 'Regular Mirror Catalogue',
          category: 'catalogues',
          price: '₹150.00',
          originalPrice: '₹200.00',
          image: mirrorsImage,
          description: 'Regular mirror catalogue featuring our complete range of standard mirrors',
          features: ['Complete Range', 'Regular Mirrors', 'Product Catalogue'],
          rating: 4.5
        },
        {
          id: 219,
          name: 'Fancy Mirror Catalogue',
          category: 'catalogues',
          price: '₹150.00',
          originalPrice: '₹200.00',
          image: mirrorsImage,
          description: 'Fancy mirror catalogue showcasing our decorative and artistic mirror collection',
          features: ['Fancy Mirrors', 'Decorative Collection', 'Product Catalogue'],
          rating: 4.6
        },
        {
          id: 220,
          name: 'Fancy Mirror Catalogue-ABCD',
          category: 'catalogues',
          price: '₹150.00',
          originalPrice: '₹200.00',
          image: mirrorsImage,
          description: 'Fancy mirror catalogue ABCD featuring specialized decorative mirror designs',
          features: ['ABCD Series', 'Fancy Mirrors', 'Specialized Designs'],
          rating: 4.5
        },
        {
          id: 221,
          name: 'Pack of 5 Fancy mirrors catalogs',
          category: 'catalogues',
          price: '₹1,499.25',
          originalPrice: '₹1,999.00',
          image: mirrorsImage,
          description: 'Pack of 5 fancy mirror catalogues - perfect for bulk orders and distribution',
          features: ['Pack of 5', 'Bulk Order', 'Fancy Mirrors'],
          rating: 4.7
        },
        {
          id: 222,
          name: 'Mirrors for Event decoration Catalogue',
          category: 'catalogues',
          price: '₹150.00',
          originalPrice: '₹200.00',
          image: mirrorsImage,
          description: 'Specialized catalogue for event decoration mirrors and decorative items',
          features: ['Event Decoration', 'Specialized Mirrors', 'Event Planning'],
          rating: 4.6
        }
      ]
    },
    'mirror-sheet': {
      title: 'Mirrors Sheet',
      description: 'High-quality plastic mirror sheets in various shapes and colors, perfect for decorative and craft applications.',
      products: [
        {
          id: 223,
          name: 'Plastic mirror sheet diamond shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in diamond shape available in multiple colors',
          features: ['Diamond Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        },
        {
          id: 224,
          name: 'Plastic mirror sheet triangle shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in triangle shape available in multiple colors',
          features: ['Triangle Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        },
        {
          id: 225,
          name: 'Plastic mirror sheet round shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in round shape available in multiple colors',
          features: ['Round Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.5
        },
        {
          id: 226,
          name: 'Plastic mirror sheet oval shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in oval shape available in multiple colors',
          features: ['Oval Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        },
        {
          id: 227,
          name: 'Plastic mirror sheet square shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in square shape available in multiple colors',
          features: ['Square Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        },
        {
          id: 228,
          name: 'Plastic mirror sheet flower shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in flower shape available in multiple colors',
          features: ['Flower Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.5
        },
        {
          id: 229,
          name: 'Plastic mirror sheet mango shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in mango shape available in multiple colors',
          features: ['Mango Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        },
        {
          id: 230,
          name: 'Plastic mirror sheet heart shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in heart shape available in multiple colors',
          features: ['Heart Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.5
        },
        {
          id: 231,
          name: 'Plastic mirror sheet star shape',
          category: 'mirror-sheet',
          price: '₹99.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Plastic mirror sheet in star shape available in multiple colors',
          features: ['Star Shape', 'Plastic Material', 'Multiple Colors'],
          rating: 4.4
        }
      ]
    },
    'bandhani': {
      title: 'Bandhani Scarf',
      description: 'Beautiful hand-printed cotton bandhani scarves in various colors, perfect for traditional and contemporary fashion.',
      products: [
        {
          id: 232,
          name: 'BLACK BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/BLACK BANDHANI SCARF/1.jpg',
          description: 'Black bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.6
        },
        {
          id: 233,
          name: 'BLUE BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/BLUE BANDHANI SCARF/1.jpg',
          description: 'Blue bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.6
        },
        {
          id: 234,
          name: 'CHIKOO BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/CHIKOO BANDHANI SCARF/1.jpg',
          description: 'Chikoo color bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.5
        },
        {
          id: 235,
          name: 'GREY BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/GREY BANDHANI SCARF/1.jpeg',
          description: 'Grey bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.5
        },
        {
          id: 236,
          name: 'MAROON BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/MAROON BANDHANI SCARF/1.jpg',
          description: 'Maroon bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.6
        },
        {
          id: 237,
          name: 'PEACH BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/PEACH BANDHANI SCARF/1.jpeg',
          description: 'Peach bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.5
        },
        {
          id: 238,
          name: 'PINK BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/PINK BANDHANI SCARF/1.jpeg',
          description: 'Pink bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.6
        },
        {
          id: 239,
          name: 'RED BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/RED BANDHANI SCARF/1.jpeg',
          description: 'Red bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.6
        },
        {
          id: 240,
          name: 'TEAL BANDHANI SCARF',
          category: 'bandhani',
          price: '₹160.00/piece',
          image: '/BANDHANI SCARF/TEAL BANDHANI SCARF/1.jpg',
          description: 'Teal bandhani scarf made from cotton hand print material with traditional printed pattern. Minimum Order Quantity: 50 Piece',
          features: ['Cotton Hand Print', 'Printed Pattern', 'Made in India', 'Min Order: 50 Piece'],
          rating: 4.5
        }
      ]
    },
    'white-scarf': {
      title: 'White Scarf',
      description: 'Beautiful white scarves with various patterns and designs, perfect for traditional and contemporary fashion.',
      products: [
        {
          id: 241,
          name: '2 BOX SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/2 BOX SCARF/1.jpeg',
          description: 'White scarf with 2 box pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', '2 Box Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 242,
          name: '2 STAR SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/2 STAR SCARF/2.jpg',
          description: 'White scarf with 2 star pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', '2 Star Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 243,
          name: '3 DOT SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/3 DOT SCARF/3.jpeg',
          description: 'White scarf with 3 dot pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', '3 Dot Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 244,
          name: 'ANKH SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/ANKH SCARF/4.jpeg',
          description: 'White scarf with ankh symbol pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Ankh Symbol', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 245,
          name: 'APPLE SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/APPLE SCARF/5.jpeg',
          description: 'White scarf with apple pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Apple Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 246,
          name: 'BIG BOX SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BIG BOX SCARF/6.jpeg',
          description: 'White scarf with big box pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Big Box Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 247,
          name: 'BIG TRIANGLE SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BIG TRIANGLE SCARF/7.jpeg',
          description: 'White scarf with big triangle pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Big Triangle Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 248,
          name: 'BINDI SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BINDI SCARF/8.jpg',
          description: 'White scarf with bindi pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Bindi Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 249,
          name: 'BLACK DHINGLI SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BLACK DHINGLI SCARF/9.jpg',
          description: 'White scarf with black dhingli pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Black Dhingli Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 250,
          name: 'BLACK HEART SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BLACK HEART SCARF/10.jpeg',
          description: 'White scarf with black heart pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Black Heart Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 251,
          name: 'BLACK STAR SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BLACK STAR SCARF/11.jpg',
          description: 'White scarf with black star pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Black Star Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 252,
          name: 'BUTTERFLY SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/BUTTERFLY SCARF/12.jpg',
          description: 'White scarf with butterfly pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Butterfly Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 253,
          name: 'CHAKRI SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/CHAKRI SCARF/13.jpeg',
          description: 'White scarf with chakri pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Chakri Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 254,
          name: 'COLOR HEART SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/COLOR HEART SCARF/15.jpg',
          description: 'White scarf with color heart pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Color Heart Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 255,
          name: 'COLOR STAR SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/COLOR STAR SCARF/16.jpg',
          description: 'White scarf with color star pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Color Star Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 256,
          name: 'COLOR TRINGLE',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/COLOR TRINGLE/14.jpg',
          description: 'White scarf with color triangle pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Color Triangle Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 257,
          name: 'DOT & FLOWER SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/DOT & FLOWER SCARF/17.jpeg',
          description: 'White scarf with dot and flower pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Dot & Flower Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 258,
          name: 'DOT & ROUND SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/DOT & ROUND SCARF/18.jpeg',
          description: 'White scarf with dot and round pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Dot & Round Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 259,
          name: 'DOUBLE HEART SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/DOUBLE HEART SCARF/19.jpeg',
          description: 'White scarf with double heart pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Double Heart Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 260,
          name: 'FEATHER SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/FEATHER SCARF/20.jpeg',
          description: 'White scarf with feather pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Feather Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 261,
          name: 'FOOL PATI SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/FOOL PATI SCARF/21.jpeg',
          description: 'White scarf with fool pati pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Fool Pati Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 262,
          name: 'FULL CHOKADI PATTI SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/FULL CHOKADI PATTI SCARF/22.jpg',
          description: 'White scarf with full chokadi patti pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Full Chokadi Patti Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 263,
          name: 'GREEN FOOL SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/GREEN FOOL SCARF/23.jpeg',
          description: 'White scarf with green fool pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Green Fool Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 264,
          name: 'MATKA SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/MATKA SCARF/24.jpeg',
          description: 'White scarf with matka pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Matka Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 265,
          name: 'MUSIC SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/MUSIC SCARF/25.jpg',
          description: 'White scarf with music pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Music Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 266,
          name: 'ONE DOT COLOR SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/ONE DOT COLOR SCARF/32.jpg',
          description: 'White scarf with one dot color pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'One Dot Color Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 267,
          name: 'PAAN SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/PAAN SCARF/26.jpeg',
          description: 'White scarf with paan pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Paan Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 268,
          name: 'PEACOCK SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/PEACOCK SCARF/27.png',
          description: 'White scarf with peacock pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Peacock Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 269,
          name: 'RED & CHEKS SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/RED & CHEKS SCARF/28.jpeg',
          description: 'White scarf with red and checks pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Red & Checks Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.5
        },
        {
          id: 270,
          name: 'STRAWBERRY SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/STRAWBERRY SCARF/29.jpeg',
          description: 'White scarf with strawberry pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Strawberry Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        },
        {
          id: 271,
          name: 'TEDY BEAR SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/TEDY BEAR SCARF/30.jpg',
          description: 'White scarf with teddy bear pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Teddy Bear Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 272,
          name: 'VIRUS SCARF',
          category: 'white-scarf',
          price: '₹200.00/piece',
          image: '/WHITE SCARF/VIRUS SCARF/31.jpg',
          description: 'White scarf with virus pattern design. Minimum Order Quantity: 25 Piece',
          features: ['White Color', 'Virus Pattern', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.4
        }
      ]
    },
    'baby-scarf': {
      title: 'Baby Scarf',
      description: 'Soft and gentle baby scarves with cute patterns and designs, perfect for little ones.',
      products: [
        {
          id: 273,
          name: 'BLACK DHINGLI BABY SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/BLACK DHINGLI BABY SCARF/1.jpg',
          description: 'Soft baby scarf with black dhingli pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Black Dhingli Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 274,
          name: 'BLACK HEART HEART BABY SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/BLACK HEART HEART BABY SCARF/2D.jpg',
          description: 'Soft baby scarf with black heart pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Black Heart Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.7
        },
        {
          id: 275,
          name: 'BLACK STAR BABY SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/BLACK STAR BABY SCARF/3.jpg',
          description: 'Soft baby scarf with black star pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Black Star Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 276,
          name: 'COLOR HEART BABT SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/COLOR HEART BABT SCARF/4.jpg',
          description: 'Soft baby scarf with color heart pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Color Heart Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.7
        },
        {
          id: 277,
          name: 'MUSIC BABY SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/MUSIC BABY SCARF/5.jpg',
          description: 'Soft baby scarf with music pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Music Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.6
        },
        {
          id: 278,
          name: 'TEDY BEAR BABY SCARF',
          category: 'baby-scarf',
          price: '₹175.00/piece',
          image: '/BABY SCARF/TEDY BEAR BABY SCARF/6.jpg',
          description: 'Soft baby scarf with teddy bear pattern design. Minimum Order Quantity: 25 Piece',
          features: ['Soft Material', 'Teddy Bear Pattern', 'Baby Safe', 'Made in India', 'Min Order: 25 Piece'],
          rating: 4.8
        }
      ]
    },
    'digital': {
      title: 'Digital Print Fabric',
      description: 'High-quality digital printed fabrics in various materials and designs, perfect for apparel and clothing applications.',
      products: [
        {
          id: 279,
          name: 'Digital Printed Fabric',
          category: 'digital',
          price: '₹69.00/meter',
          image: '/Digital Print Fabric/Digital Printed Fabric.webp',
          description: 'High-quality digital printed fabric with customised design. Minimum Order Quantity: 100 Meter',
          features: ['Digital Prints', 'Customised Design', 'Cotton Material', 'Made in India', 'Min Order: 100 Meter'],
          rating: 4.6
        },
        {
          id: 280,
          name: 'Digital Printing Service',
          category: 'digital',
          price: '₹55.00/page',
          image: '/Digital Print Fabric/Digital Printing Service.webp',
          description: 'Professional digital printing service for customised designs. Minimum Order Quantity: 100 Page',
          features: ['Customised Design', 'Digital Printing', 'All Over World', 'Made in India', 'Min Order: 100 Page'],
          rating: 4.7
        },
        {
          id: 281,
          name: 'Cotton Shirting Fabric',
          category: 'digital',
          price: '₹69.00/meter',
          image: '/Digital Print Fabric/Cotton Shirting Fabric.webp',
          description: 'Premium cotton shirting fabric with digital print. Minimum Order Quantity: 50 Meter',
          features: ['Cotton Material', 'Digital Print', 'Abstract Pattern', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.5
        },
        {
          id: 282,
          name: 'Digital Printed Designer All Over Fabric',
          category: 'digital',
          price: '₹99.00/meter',
          image: '/Digital Print Fabric/ digital printed Designer All Over Fabric.webp',
          description: 'Designer all over digital printed fabric with customised design. Minimum Order Quantity: 50 Meter',
          features: ['Designer All Over', 'Customised Design', 'Cotton & Silk', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.8
        },
        {
          id: 283,
          name: 'Digital Fabric Printing',
          category: 'digital',
          price: '₹70.00/meter',
          image: '/Digital Print Fabric/Digital Fabric Printing.webp',
          description: 'Professional digital fabric printing service with floral patterns. Minimum Order Quantity: 50 Meter',
          features: ['Floral Pattern', 'Digital Printing', 'Polyester Material', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.6
        },
        {
          id: 284,
          name: 'Men Suiting Shirting Fabric',
          category: 'digital',
          price: '₹105.00/meter',
          image: '/Digital Print Fabric/Men Suiting Shirting Fabric.webp',
          description: 'Premium men suiting and shirting fabric with digital print. Minimum Order Quantity: 50 Meter',
          features: ['Men Suiting', 'Digital Print', 'Cotton Material', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.7
        },
        {
          id: 285,
          name: 'Floral Digital Printed Fabric',
          category: 'digital',
          price: '₹69.00/meter',
          image: '/Digital Print Fabric/Floral Digital Printed Fabric.webp',
          description: 'Beautiful floral digital printed fabric with customised design. Minimum Order Quantity: 50 Meter',
          features: ['Floral Pattern', 'Digital Print', 'Cotton & Silk', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.6
        },
        {
          id: 286,
          name: 'Printed Cotton Fabric',
          category: 'digital',
          price: '₹69.00/meter',
          image: '/Digital Print Fabric/Printed Cotton Fabric.webp',
          description: 'High-quality printed cotton fabric with geometric patterns. Minimum Order Quantity: 50 Meter',
          features: ['Cotton Material', 'Geometric Pattern', 'Digital Print', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.5
        },
        {
          id: 287,
          name: 'Floral Printed Rayon Fabric',
          category: 'digital',
          price: '₹79.00/meter',
          image: '/Digital Print Fabric/Floral Printed Rayon Fabric.webp',
          description: 'Elegant floral printed rayon fabric for daily wear garments. Minimum Order Quantity: 50 Meter',
          features: ['Rayon Material', 'Floral Print', 'Daily Wear', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.6
        },
        {
          id: 288,
          name: 'Digital Printed Reyon Fabric',
          category: 'digital',
          price: '₹69.00/meter',
          image: '/Digital Print Fabric/Digital Printed Reyon Fabric.webp',
          description: 'Digital printed rayon fabric for ladies garments and accessories. Minimum Order Quantity: 100 Meter',
          features: ['Rayon Material', 'Digital Print', 'Ladies Garments', 'Made in India', 'Min Order: 100 Meter'],
          rating: 4.5
        },
        {
          id: 289,
          name: 'Army Camouflage Fabric',
          category: 'digital',
          price: '₹160.00/meter',
          image: '/Digital Print Fabric/Army Camouflage Fabric.webp',
          description: 'Heavy-duty army camouflage fabric with digital print. Minimum Order Quantity: 25 Meter',
          features: ['Camouflage Print', 'Heavy Weight', 'Cotton Material', 'Made in India', 'Min Order: 25 Meter'],
          rating: 4.7
        },
        {
          id: 290,
          name: 'Floral Print Cotton Fabric',
          category: 'digital',
          price: '₹85.00/meter',
          image: '/Digital Print Fabric/Floral Print Cotton Fabric.webp',
          description: 'Beautiful floral print cotton fabric for garments and accessories. Minimum Order Quantity: 50 Meter',
          features: ['Cotton Material', 'Floral Print', 'Customised Design', 'Made in India', 'Min Order: 50 Meter'],
          rating: 4.6
        },
        {
          id: 291,
          name: 'Camouflage Print Fabric',
          category: 'digital',
          price: '₹149.00/meter',
          image: '/Digital Print Fabric/Camouflage Print Fabric.webp',
          description: 'Premium camouflage print fabric with customised design. Minimum Order Quantity: 25 Meter',
          features: ['Camouflage Print', 'Heavy Weight', 'Cotton & Polyester', 'Made in India', 'Min Order: 25 Meter'],
          rating: 4.8
        }
      ]
    }
    // Add more categories here
  };

  const currentCategory = productData[category as keyof typeof productData];

  // Subcategory mapping based on category
  const getSubCategories = (categoryKey: string) => {
    if (categoryKey === 'artistic') {
      return {
        'all': 'All Artistic Mirrors'
      };
    }
    
    if (categoryKey === 'acrylic') {
      return {
        'all': 'All Acrylic Mirrors'
      };
    }
    
    if (categoryKey === 'catalogues') {
      return {
        'all': 'All Catalogues'
      };
    }
    
    if (categoryKey === 'mirror-sheet') {
      return {
        'all': 'All Mirror Sheets'
      };
    }
    
    if (categoryKey === 'bandhani') {
      return {
        'all': 'All Bandhani Scarves'
      };
    }
    
    if (categoryKey === 'white-scarf') {
      return {
        'all': 'All White Scarves'
      };
    }
    
    if (categoryKey === 'baby-scarf') {
      return {
        'all': 'All Baby Scarves'
      };
    }
    
    if (categoryKey === 'digital') {
      return {
        'all': 'All Digital Print Fabrics'
      };
    }
    
    return {
      'all': 'All Products',
      'round-shape': 'Round shape mirrors for lippan art (1)',
      'almond-shape': 'Almond Shape mirror for lippan art (2,3)',
      'diamond-shape': 'Diamond shape mirrors for lippan art (4)',
      'eye-shape': 'Eye shape mirrors for lippan art (5)',
      'square-shape': 'Square shape mirrors for lippan art (6,7)',
      'rectangular-shape': 'Rectangular shape mirror for lippan art (8,9)',
      'triangle-shape': 'Triangle shape mirrors for lippan art (10,11)',
      'fancy-mirrors': 'Fancy mirrors for lippan art (12-70)',
      'lippan-kit': 'Lippan art mirror kit (71+)'
    };
  };

  const subCategories = getSubCategories(category as string);

  // Function to get subcategory for a product
  const getProductSubCategory = (productId: number) => {
    // Artistic mirrors have no subcategories - all fall under 'all'
    if (productId >= 92 && productId <= 136) return 'all';
    
    // Acrylic mirrors have no subcategories - all fall under 'all'
    if (productId >= 137 && productId <= 217) return 'all';
    
    // Catalogues have no subcategories - all fall under 'all'
    if (productId >= 218 && productId <= 222) return 'all';
    
    // Mirror sheets have no subcategories - all fall under 'all'
    if (productId >= 223 && productId <= 231) return 'all';
    
    // Bandhani scarves have no subcategories - all fall under 'all'
    if (productId >= 232 && productId <= 240) return 'all';
    
    // White scarves have no subcategories - all fall under 'all'
    if (productId >= 241 && productId <= 272) return 'all';
    
    // Baby scarves have no subcategories - all fall under 'all'
    if (productId >= 273 && productId <= 278) return 'all';
    
    // Digital print fabrics have no subcategories - all fall under 'all'
    if (productId >= 279 && productId <= 291) return 'all';
    
    if (productId === 1) return 'round-shape';
    if (productId >= 2 && productId <= 3) return 'almond-shape';
    if (productId === 4) return 'diamond-shape';
    if (productId === 5) return 'eye-shape';
    if (productId >= 6 && productId <= 7) return 'square-shape';
    if (productId >= 8 && productId <= 9) return 'rectangular-shape';
    if (productId >= 10 && productId <= 11) return 'triangle-shape';
    if (productId >= 12 && productId <= 70) return 'fancy-mirrors';
    if (productId >= 71) return 'lippan-kit'; // Kit Mirror-1001 (id: 71) onwards
    return 'all';
  };

  // Function to extract price from string
  const extractPrice = (priceStr: string) => {
    const match = priceStr.match(/₹([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (!currentCategory) {
      navigate('/');
    }
  }, [category, currentCategory, navigate]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  if (!currentCategory) {
    return null;
  }

  // Filter products based on search, price, and subcategory
  const filteredProducts = currentCategory.products.filter(product => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Price filter
    const productPrice = extractPrice(product.price);
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

    // Subcategory filter
    const productSubCategory = getProductSubCategory(product.id);
    const matchesSubCategory = selectedSubCategory === 'all' || productSubCategory === selectedSubCategory;

    return matchesSearch && matchesPrice && matchesSubCategory;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quote form handlers
  const handleGetQuote = (product: any) => {
    setSelectedProduct(product);
    setIsQuoteDialogOpen(true);
  };

  const handleQuoteFormChange = (field: string, value: string) => {
    setQuoteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    setIsSubmittingQuote(true);
    console.log('Submitting quote request for:', selectedProduct.name);
    console.log('Form data:', quoteForm);
    
    try {
      const requestData = {
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        company: quoteForm.company,
        productName: selectedProduct.name,
        productCode: selectedProduct.code || 'N/A',
        category: selectedProduct.category || 'Unknown',
        subcategory: selectedProduct.subcategory || '',
        quantity: parseInt(quoteForm.quantity) || 1,
        message: quoteForm.message
      };
      
      console.log('Request data:', requestData);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/product-inquiries/submit`;
      console.log('Making request to:', apiUrl);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

        if (result.success) {
          // Reset form and close dialog
          setQuoteForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            quantity: '',
            message: ''
          });
          setIsQuoteDialogOpen(false);
          setSelectedProduct(null);
          
          // Show success message
          toast({
            title: "Quote Request Submitted!",
            description: "Thank you for your inquiry. We will contact you soon.",
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to submit quote request. Please try again.",
            variant: "destructive",
          });
        }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to submit quote request. Please try again.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = `Failed to submit quote request: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div ref={headerRef} className={`text-center mb-12 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              <span className="text-black">{currentCategory.title.split(' ')[0]}</span>
              <span className="text-luxury"> {currentCategory.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each product is crafted with precision and attention to detail, ensuring perfect quality and lasting durability.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div ref={filtersRef} className={`mb-8 space-y-4 transition-all duration-1000 delay-300 ${
            filtersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-card border rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Subcategory Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subcategory</label>
                    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(subCategories).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Results Count */}
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredProducts.length} products
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 2000]);
                      setSelectedSubCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length === 0 
                  ? `No products found for "${searchQuery}"`
                  : `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} for "${searchQuery}"`
                }
              </p>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div ref={productsRef} className={`text-center py-16 transition-all duration-1000 ${
              productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No products match your search for "${searchQuery}". Try adjusting your search terms or filters.`
                    : "No products available in this category. Please try a different category or check back later."
                  }
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="mr-2"
                  >
                    Clear Search
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubCategory('all');
                    setPriceRange([0, 10000]);
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <div ref={productsRef} className={`${viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-4"
            } transition-all duration-1000 delay-500 ${
              productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {currentProducts.map((product, index) => (
              <Card key={product.id} className={`group bg-card hover:shadow-luxury transition-luxury overflow-hidden ${
                viewMode === 'list' ? 'flex flex-row' : ''
              } transition-all duration-700 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{
                transitionDelay: productsVisible ? `${index * 100}ms` : '0ms'
              }}>
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-64'
                }`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-primary text-primary-foreground">
                      {product.rating} ⭐
                    </Badge>
                  </div>
                </div>
                
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-playfair font-semibold group-hover:text-primary transition-luxury">
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-semibold">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Star className="h-3 w-3 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary-glow"
                      onClick={() => handleGetQuote(product)}
                    >
                      Get Quote
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div ref={paginationRef} className={`flex justify-center items-center mt-12 space-x-2 transition-all duration-1000 delay-700 ${
              paginationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          )}
        </div>
      </section>

      {/* Quote Form Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-auto my-4 sm:my-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-playfair font-bold text-center leading-tight">
              Get Quote for <span className="text-luxury">{selectedProduct?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
              {/* Product Info */}
              <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-lg mx-auto sm:mx-0"
                  />
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-semibold text-base sm:text-lg leading-tight">{selectedProduct.name}</h3>
                    <p className="text-primary font-bold text-lg sm:text-xl">{selectedProduct.price}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>

              {/* Quote Form */}
              <form onSubmit={handleQuoteSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium flex items-center">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Full Name *
                    </label>
                    <Input
                      value={quoteForm.name}
                      onChange={(e) => handleQuoteFormChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium flex items-center">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) => handleQuoteFormChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium flex items-center">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={quoteForm.phone}
                      onChange={(e) => handleQuoteFormChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Company Name</label>
                    <Input
                      value={quoteForm.company}
                      onChange={(e) => handleQuoteFormChange('company', e.target.value)}
                      placeholder="Enter your company name"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium">Quantity Required</label>
                    <Input
                      value={quoteForm.quantity}
                      onChange={(e) => handleQuoteFormChange('quantity', e.target.value)}
                      placeholder="e.g., 100 pieces, 50 units"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Additional Requirements
                  </label>
                  <Textarea
                    value={quoteForm.message}
                    onChange={(e) => handleQuoteFormChange('message', e.target.value)}
                    placeholder="Please specify any special requirements, delivery timeline, or other details..."
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsQuoteDialogOpen(false)}
                    className="flex-1 order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="flex-1 bg-primary hover:bg-primary-glow order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingQuote ? 'Sending...' : 'Send Quote Request'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
