import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import images
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // All product data organized by category
  const productData = {
    'regular-silver': {
      title: 'Regular Silver Mirrors',
      description: 'High-quality regular silver mirrors with crystal clear reflection and premium finish.',
      products: [
        // Regular Silver Mirrors
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

        // Fancy Mirrors - General Fancy Shapes
        {
          id: 2,
          name: 'Fancy Butterfly Shape Silver Mirror 1421',
          category: 'fancy',
          price: '₹450/piece',
          image: mirrorsImage,
          description: 'Beautiful butterfly-shaped silver mirror perfect for decorative purposes',
          features: ['Unique butterfly shape', 'Premium silver finish', 'Wall mounting included'],
          rating: 4.9
        },
        {
          id: 3,
          name: 'Fancy Butterfly Shape Silver Mirror P-1137',
          category: 'fancy',
          price: '₹420/piece',
          image: mirrorsImage,
          description: 'Elegant butterfly design mirror with premium silver coating',
          features: ['Butterfly design', 'Silver coating', 'Decorative appeal'],
          rating: 4.7
        },
        {
          id: 4,
          name: 'Fancy Elephant Shape Mirror H-108',
          category: 'fancy',
          price: '₹380/piece',
          image: mirrorsImage,
          description: 'Charming elephant-shaped mirror for unique home décor',
          features: ['Elephant shape design', 'Durable construction', 'Easy to clean'],
          rating: 4.6
        },
        {
          id: 5,
          name: 'Fancy Lotus Shape Silver Mirror 1287 – KM',
          category: 'fancy',
          price: '₹520/piece',
          image: mirrorsImage,
          description: 'Sacred lotus-shaped mirror with intricate silver detailing',
          features: ['Lotus design', 'Intricate detailing', 'Spiritual significance'],
          rating: 4.8
        },
        {
          id: 6,
          name: 'Fancy Flute & Morpankh Silver Mirror V-1425',
          category: 'fancy',
          price: '₹480/piece',
          image: mirrorsImage,
          description: 'Musical instrument inspired mirror with peacock feather design',
          features: ['Flute & peacock design', 'Silver finish', 'Artistic appeal'],
          rating: 4.7
        },
        {
          id: 7,
          name: 'Fancy Ganesha Shape Mirror G-1161',
          category: 'fancy',
          price: '₹550/piece',
          image: mirrorsImage,
          description: 'Sacred Ganesha-shaped mirror for auspicious home décor',
          features: ['Ganesha design', 'Religious significance', 'Premium quality'],
          rating: 4.9
        },

        // Artistic Mirrors
        {
          id: 8,
          name: 'Artistic Decorative Mirror',
          category: 'artistic',
          price: '₹650/piece',
          image: mirrorsImage,
          description: 'Handcrafted artistic mirror perfect for luxury home décor',
          features: ['Handcrafted design', 'Premium frame', 'Unique artwork'],
          rating: 4.8
        },

        // Kit Mirrors for Art - Mirror Kits
        {
          id: 9,
          name: 'Acrylic Kit Mirror – Silver (Set of Multiple Mirror Shapes)',
          category: 'kit-art',
          price: '₹280/set',
          image: mirrorsImage,
          description: 'Complete mirror kit with various shapes for art projects',
          features: ['Multiple shapes', 'Silver finish', 'Complete kit'],
          rating: 4.6
        },

        // Acrylic Mirror - Acrylic Shapes
        {
          id: 10,
          name: 'Acrylic Fancy Shape Mirror A-107 (Silver)',
          category: 'acrylic',
          price: '₹320/piece',
          image: mirrorsImage,
          description: 'Shatterproof acrylic mirror in fancy shape with silver finish',
          features: ['Shatterproof', 'Fancy shape', 'Silver finish'],
          rating: 4.5
        },
        {
          id: 11,
          name: 'Acrylic Fancy Shape Mirror A-107 (Gold)',
          category: 'acrylic',
          price: '₹350/piece',
          image: mirrorsImage,
          description: 'Shatterproof acrylic mirror in fancy shape with gold finish',
          features: ['Shatterproof', 'Fancy shape', 'Gold finish'],
          rating: 4.5
        },
        {
          id: 12,
          name: 'Acrylic Normal Shape Mirror A-106 (Silver)',
          category: 'acrylic',
          price: '₹280/piece',
          image: mirrorsImage,
          description: 'Standard acrylic mirror with silver coating',
          features: ['Shatterproof', 'Normal shape', 'Silver coating'],
          rating: 4.4
        },
        {
          id: 13,
          name: 'Acrylic Normal Shape Mirror A-106 (Gold)',
          category: 'acrylic',
          price: '₹310/piece',
          image: mirrorsImage,
          description: 'Standard acrylic mirror with gold coating',
          features: ['Shatterproof', 'Normal shape', 'Gold coating'],
          rating: 4.4
        },
        {
          id: 14,
          name: 'Acrylic Shape A-182',
          category: 'acrylic',
          price: '₹290/piece',
          image: mirrorsImage,
          description: 'Unique acrylic mirror shape A-182 for special applications',
          features: ['Unique shape', 'Shatterproof', 'Versatile use'],
          rating: 4.3
        },
        {
          id: 15,
          name: 'Acrylic Shape A-174',
          category: 'acrylic',
          price: '₹270/piece',
          image: mirrorsImage,
          description: 'Special acrylic mirror shape A-174 for decorative purposes',
          features: ['Special shape', 'Shatterproof', 'Decorative'],
          rating: 4.3
        },

        // Catalogues - Fancy Mirror Catalogues
        {
          id: 16,
          name: 'Pack of 5 Fancy Mirrors Catalogs',
          category: 'catalogues',
          price: '₹150/pack',
          image: mirrorsImage,
          description: 'Complete catalog collection showcasing all fancy mirror designs',
          features: ['5 catalogs', 'Complete collection', 'Design reference'],
          rating: 4.7
        },

        // Mirror Sheet
        {
          id: 17,
          name: 'Mirror Sheet for Craft Work',
          category: 'mirror-sheet',
          price: '₹180/sq ft',
          image: mirrorsImage,
          description: 'Flexible mirror sheet perfect for craft and DIY projects',
          features: ['Flexible material', 'Easy to cut', 'Craft applications'],
          rating: 4.4
        },

      ]
    },
    scarfs: {
      title: 'Scarfs Collection',
      description: 'Explore our exquisite collection of scarfs - from traditional designs to modern fashion statements that add elegance to any outfit.',
      heroImage: scarfsImage,
      heroTitle: 'Luxury Scarfs',
      heroSubtitle: 'SCARFS COLLECTION',
      heroDescription: 'Explore our exquisite collection of scarfs - from traditional designs to modern fashion statements that add elegance to any outfit.',
      categories: [
        { id: 'bandhani', name: 'Bandhani Scarf' },
        { id: 'white', name: 'White Scarf' },
        { id: 'baby', name: 'Baby Scarf' },
      ],
      products: [
        {
          id: 1,
          name: 'Cotton Hand Printed Bandhani Scarf',
          category: 'bandhani',
          price: '₹450/piece',
          image: scarfsImage,
          description: 'Traditional hand-printed bandhani scarf with authentic tie-dye patterns',
          features: ['Hand Printed', 'Traditional Bandhani', 'Cotton Material'],
          rating: 4.8
        },
        {
          id: 2,
          name: 'Ladies Batik Printed Silk Scarf',
          category: 'bandhani',
          price: '₹650/piece',
          image: scarfsImage,
          description: 'Elegant silk scarf with beautiful batik printed designs',
          features: ['Silk Material', 'Batik Print', 'Ladies Design'],
          rating: 4.7
        },
        {
          id: 3,
          name: 'Striped Cotton Scarf',
          category: 'bandhani',
          price: '₹380/piece',
          image: scarfsImage,
          description: 'Classic striped cotton scarf perfect for everyday wear',
          features: ['Striped Design', 'Cotton Material', 'Versatile'],
          rating: 4.6
        },
        {
          id: 4,
          name: 'Pure White Scarf',
          category: 'white',
          price: '₹320/piece',
          image: scarfsImage,
          description: 'Crisp white cotton scarf for elegant and clean styling',
          features: ['Pure White', 'Cotton Material', 'Elegant Design'],
          rating: 4.5
        },
        {
          id: 5,
          name: 'White Cotton Scarf',
          category: 'white',
          price: '₹280/piece',
          image: scarfsImage,
          description: 'Soft white cotton scarf perfect for any occasion',
          features: ['White Color', 'Soft Cotton', 'Comfortable'],
          rating: 4.4
        },
        {
          id: 6,
          name: 'Baby Soft Scarf',
          category: 'baby',
          price: '₹180/piece',
          image: scarfsImage,
          description: 'Ultra-soft baby scarf made with gentle materials for delicate skin',
          features: ['Baby Safe', 'Ultra Soft', 'Gentle Material'],
          rating: 4.9
        },
        {
          id: 7,
          name: 'Gentle Baby Cotton Scarf',
          category: 'baby',
          price: '₹150/piece',
          image: scarfsImage,
          description: 'Gentle cotton scarf specially designed for babies',
          features: ['Baby Friendly', 'Cotton Material', 'Gentle Touch'],
          rating: 4.8
        },
        {
          id: 8,
          name: 'Tender Baby Scarf',
          category: 'baby',
          price: '₹160/piece',
          image: scarfsImage,
          description: 'Tender and comfortable scarf perfect for little ones',
          features: ['Tender Material', 'Comfortable', 'Baby Size'],
          rating: 4.7
        },
      ]
    },
    'bag-fabric': {
      title: 'Bag Fabric Collection',
      description: 'Discover our premium bag fabrics - durable, stylish materials perfect for creating beautiful and functional bags.',
      heroImage: bagFabricImage,
      heroTitle: 'Bag Fabrics',
      heroSubtitle: 'BAG FABRIC COLLECTION',
      heroDescription: 'Discover our premium bag fabrics - durable, stylish materials perfect for creating beautiful and functional bags.',
      categories: [
        { id: 'digital', name: 'Digital Print Fabric' },
        { id: 'waterproof', name: 'Water Resistant Antifree Fabric' },
        { id: 'school', name: 'School Bag Fabric' },
      ],
      products: [
        {
          id: 1,
          name: 'Digital Print Fabric',
          category: 'digital',
          price: '₹320/meter',
          image: bagFabricImage,
          description: 'High-resolution digital printed fabric with vibrant colors and sharp details',
          features: ['Digital Print', 'High Resolution', 'Vibrant Colors'],
          rating: 4.7
        },
        {
          id: 2,
          name: 'Custom Digital Print Fabric',
          category: 'digital',
          price: '₹350/meter',
          image: bagFabricImage,
          description: 'Custom digital print fabric with personalized designs and patterns',
          features: ['Custom Design', 'Digital Print', 'Personalized'],
          rating: 4.8
        },
        {
          id: 3,
          name: 'High-Res Digital Design Fabric',
          category: 'digital',
          price: '₹380/meter',
          image: bagFabricImage,
          description: 'Premium digital print fabric with crystal clear designs',
          features: ['High Resolution', 'Crystal Clear', 'Premium Quality'],
          rating: 4.6
        },
        {
          id: 4,
          name: 'Water Resistant Antifree Fabric',
          category: 'waterproof',
          price: '₹450/meter',
          image: bagFabricImage,
          description: 'Water-resistant fabric with antifree properties for all weather conditions',
          features: ['Water Resistant', 'Antifree', 'All Weather'],
          rating: 4.9
        },
        {
          id: 5,
          name: 'PU Coated Antifree Fabric',
          category: 'waterproof',
          price: '₹420/meter',
          image: bagFabricImage,
          description: 'PU coated fabric with excellent water resistance and antifree properties',
          features: ['PU Coated', 'Water Resistant', 'Antifree'],
          rating: 4.8
        },
        {
          id: 6,
          name: 'Weather Resistant Antifree Material',
          category: 'waterproof',
          price: '₹400/meter',
          image: bagFabricImage,
          description: 'Durable weather-resistant fabric perfect for outdoor bag applications',
          features: ['Weather Resistant', 'Durable', 'Outdoor Use'],
          rating: 4.7
        },
        {
          id: 7,
          name: 'Durable School Bag Fabric',
          category: 'school',
          price: '₹280/meter',
          image: bagFabricImage,
          description: 'Heavy-duty fabric specifically designed for school bag construction',
          features: ['Heavy Duty', 'School Grade', 'Durable'],
          rating: 4.6
        },
        {
          id: 8,
          name: 'Student Backpack Material',
          category: 'school',
          price: '₹320/meter',
          image: bagFabricImage,
          description: 'Reinforced fabric perfect for student backpacks and school bags',
          features: ['Reinforced', 'Student Grade', 'Backpack Material'],
          rating: 4.7
        },
        {
          id: 9,
          name: 'School Grade Fabric',
          category: 'school',
          price: '₹300/meter',
          image: bagFabricImage,
          description: 'Educational institution approved fabric for school bag manufacturing',
          features: ['School Approved', 'Institution Grade', 'Quality Assured'],
          rating: 4.8
        },
      ]
    }
  };

  const currentCategory = productData[category as keyof typeof productData];

  useEffect(() => {
    if (!currentCategory) {
      navigate('/');
    }
  }, [category, currentCategory, navigate]);

  if (!currentCategory) {
    return null;
  }

  const filteredProducts = currentCategory.products;
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                <span className="text-luxury">{currentCategory.title}</span>
              </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each product is crafted with precision and attention to detail, ensuring perfect quality and lasting durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <Card key={product.id} className="group bg-card hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-luxury" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white">
                      ★ {product.rating}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-luxury">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-white text-primary hover:bg-white/90">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
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
                    <Button className="flex-1 bg-primary hover:bg-primary-glow">
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
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
                  // Show first page, last page, current page, and pages around current page
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

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Need Custom <span className="text-luxury">{currentCategory.title.split(' ')[0]}?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We specialize in custom solutions. Whether you need specific sizes, shapes, or finishes, 
              our team can create the perfect product for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow">
                <a href="/contact">Request Custom Quote</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/about">Learn About Our Process</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
