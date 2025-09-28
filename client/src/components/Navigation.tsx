import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// Logo from public folder
const eloskLogo = '/eloska logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>('');
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  // Function to get top 3 products for each category with detailed info
  const getTop3Products = (category: string, href: string) => {
    const productMap: { [key: string]: { [key: string]: any[] } } = {
      'mirrors': {
        '/products/regular-silver': [
          { name: 'Fancy Butterfly shape silver mirror 1421', code: 'M001', description: 'ONLY MIRROR - Premium silver finish with butterfly design', image: '/eloska images/9.png' },
          { name: 'Premium Silver Mirror 12x12', code: 'M002', description: 'High-quality reflective finish with elegant silver frame', image: '/eloska images/10.png' },
          { name: 'Luxury Silver Frame Mirror', code: 'M003', description: 'Ornate silver frame with intricate detailing', image: '/eloska images/11.png' }
        ],
        '/products/artistic': [
          { name: 'Hand-painted Artistic Mirror', code: 'A001', description: 'Custom hand-painted mirror with artistic flair', image: '/eloska images/12.png' },
          { name: 'Abstract Design Mirror', code: 'A002', description: 'Modern abstract pattern mirror design', image: '/eloska images/13.png' },
          { name: 'Custom Art Mirror', code: 'A003', description: 'Bespoke artistic mirror tailored to your vision', image: '/eloska images/14.png' }
        ],
        '/products/acrylic': [
          { name: 'Lightweight Acrylic Mirror', code: 'AC001', description: 'Shatterproof acrylic mirror for safety', image: '/eloska images/15.png' },
          { name: 'Shatterproof Acrylic', code: 'AC002', description: 'Durable acrylic mirror resistant to breakage', image: '/eloska images/16.png' },
          { name: 'Modern Acrylic Design', code: 'AC003', description: 'Contemporary acrylic mirror with sleek finish', image: '/eloska images/17.png' }
        ],
        '/products/catalogues': [
          { name: 'Premium Mirror Catalog', code: 'C001', description: 'Comprehensive catalog of all mirror products', image: '/eloska images/9.png' },
          { name: 'Design Collection Book', code: 'C002', description: 'Exclusive design collection showcase', image: '/eloska images/10.png' },
          { name: 'Product Showcase', code: 'C003', description: 'Detailed product showcase and specifications', image: '/eloska images/11.png' }
        ],
        '/products/mirror-sheet': [
          { name: 'Mirror Sheet 4x8', code: 'S001', description: 'Large format mirror sheet for custom applications', image: '/eloska images/12.png' },
          { name: 'Custom Cut Sheets', code: 'S002', description: 'Precision-cut mirror sheets to your specifications', image: '/eloska images/13.png' },
          { name: 'Bulk Mirror Sheets', code: 'S003', description: 'Wholesale mirror sheets for large projects', image: '/eloska images/14.png' }
        ]
      },
      'scarfs': {
        '/products/bandhani': [
          { name: 'BLACK BANDHANI SCARF', code: 'B001', description: 'Traditional black bandhani scarf - ₹160.00/piece', image: '/BANDHANI SCARF/BLACK BANDHANI SCARF/1.jpg' },
          { name: 'BLUE BANDHANI SCARF', code: 'B002', description: 'Vibrant blue bandhani pattern - ₹160.00/piece', image: '/BANDHANI SCARF/BLUE BANDHANI SCARF/1.jpg' },
          { name: 'CHIKOO BANDHANI SCARF', code: 'B003', description: 'Elegant chikoo color bandhani - ₹160.00/piece', image: '/BANDHANI SCARF/CHIKOO BANDHANI SCARF/1.jpg' }
        ],
        '/products/white-scarf': [
          { name: '2 BOX SCARF', code: 'W001', description: 'Classic white scarf with box pattern - ₹200.00/piece', image: '/WHITE SCARF/2 BOX SCARF/1.jpeg' },
          { name: '2 STAR SCARF', code: 'W002', description: 'Beautiful white scarf with star design - ₹200.00/piece', image: '/WHITE SCARF/2 STAR SCARF/2.jpg' },
          { name: '3 DOT SCARF', code: 'W003', description: 'Elegant white scarf with dot pattern - ₹200.00/piece', image: '/WHITE SCARF/3 DOT SCARF/3.jpeg' }
        ],
        '/products/baby-scarf': [
          { name: 'BLACK DHINGLI BABY SCARF', code: 'BB001', description: 'Soft baby scarf with dhingli pattern - ₹175.00/piece', image: '/BABY SCARF/BLACK DHINGLI BABY SCARF/1.jpg' },
          { name: 'BLACK HEART BABY SCARF', code: 'BB002', description: 'Cute baby scarf with heart design - ₹175.00/piece', image: '/BABY SCARF/BLACK HEART HEART BABY SCARF/2D.jpg' },
          { name: 'TEDY BEAR BABY SCARF', code: 'BB003', description: 'Adorable teddy bear baby scarf - ₹175.00/piece', image: '/BABY SCARF/TEDY BEAR BABY SCARF/6.jpg' }
        ]
      },
      'bag-fabric': {
        '/products/digital': [
          { name: 'Digital Printed Fabric', code: 'D001', description: 'High-quality digital printed fabric - ₹69.00/meter', image: '/Digital Print Fabric/Digital Printed Fabric.webp' },
          { name: 'Digital Printing Service', code: 'D002', description: 'Professional digital printing service - ₹55.00/page', image: '/Digital Print Fabric/Digital Printing Service.webp' },
          { name: 'Cotton Shirting Fabric', code: 'D003', description: 'Premium cotton shirting fabric - ₹69.00/meter', image: '/Digital Print Fabric/Cotton Shirting Fabric.webp' }
        ],
        '/products/school': [
          { name: 'Floral Digital Printed Fabric', code: 'S001', description: 'Beautiful floral digital printed fabric - ₹69.00/meter', image: '/Digital Print Fabric/Floral Digital Printed Fabric.webp' },
          { name: 'Printed Cotton Fabric', code: 'S002', description: 'High-quality printed cotton fabric - ₹69.00/meter', image: '/Digital Print Fabric/Printed Cotton Fabric.webp' },
          { name: 'Men Suiting Shirting Fabric', code: 'S003', description: 'Premium men suiting fabric - ₹105.00/meter', image: '/Digital Print Fabric/Men Suiting Shirting Fabric.webp' }
        ],
        '/products/waterproof': [
          { name: 'Army Camouflage Fabric', code: 'W001', description: 'Heavy-duty army camouflage fabric - ₹160.00/meter', image: '/Digital Print Fabric/Army Camouflage Fabric.webp' },
          { name: 'Camouflage Print Fabric', code: 'W002', description: 'Premium camouflage print fabric - ₹149.00/meter', image: '/Digital Print Fabric/Camouflage Print Fabric.webp' },
          { name: 'Water Resistant Fabric', code: 'W003', description: 'Durable water-resistant fabric material', image: '/Digital Print Fabric/Digital Printed Fabric.webp' }
        ]
      }
    };

    // Get the first category products as default if no specific href is provided
    const defaultProducts = {
      'mirrors': productMap['mirrors']?.['/products/regular-silver'] || [],
      'scarfs': productMap['scarfs']?.['/products/bandhani'] || [],
      'bag-fabric': productMap['bag-fabric']?.['/products/digital'] || []
    };

    return productMap[category]?.[href] || defaultProducts[category] || [
      { name: 'Product 1', code: 'P001', description: 'Premium quality product' },
      { name: 'Product 2', code: 'P002', description: 'High-end product design' },
      { name: 'Product 3', code: 'P003', description: 'Luxury product collection' }
    ];
  };

  const mirrorItems = [
    { title: 'Regular Silver Mirrors', href: '/products/regular-silver' },
    { title: 'Artistic Mirrors', href: '/products/artistic' },
    { title: 'Acrylic Mirror', href: '/products/acrylic' },
    { title: 'Catalogues', href: '/products/catalogues' },
    { title: 'Mirrors Sheet', href: '/products/mirror-sheet' },
  ];

  const scarfItems = [
    { title: 'Bandhani Scarf', href: '/products/bandhani' },
    { title: 'White Scarf', href: '/products/white-scarf' },
    { title: 'Baby Scarf', href: '/products/baby-scarf' },
  ];

  const bagFabricItems = [
    { title: 'Digital Print Fabric', href: '/products/digital' },
    { title: 'Water Resistant Antifree Fabric', href: '/products/waterproof' },
    { title: 'School Bag Fabric', href: '/products/school' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Function to close dropdown when navigating
  const closeDropdown = () => {
    setHoveredCategory('');
  };

  const toggleMobileDropdown = (category: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className={`text-sm font-inter font-medium transition-all duration-300 relative group ${
        isActive(href) ? 'text-primary' : 'text-foreground hover:text-primary/90'
      } focus:text-foreground active:text-foreground`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className={`block px-6 py-3 text-sm font-medium transition-all duration-300 relative group ${
        isActive(href) ? 'text-primary bg-secondary/20' : 'text-foreground hover:text-primary/90 hover:bg-secondary/5'
      } focus:text-foreground active:text-foreground`}
      onClick={() => setIsOpen(false)}
    >
      {children}
      <span className="absolute left-0 top-0 w-0 h-full bg-primary/10 transition-all duration-300 group-hover:w-1" />
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center">
          {/* Logo - Left Corner */}
          <Link to="/" className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:brightness-110">
            <img src={eloskLogo} alt="Eloska World" className="h-24 w-auto" />
          </Link>

          {/* Desktop Navigation - Centered in remaining space */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary/90 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent transition-all duration-300 relative group data-[state=open]:text-primary focus:text-foreground active:text-foreground">
                    Mirror Collection
                  </NavigationMenuTrigger>
                  <NavigationMenuContent 
                    className="bg-background border shadow-luxury"
                    onMouseEnter={() => setHoveredCategory('/products/regular-silver')}
                  >
                    <div className="flex w-[800px] h-[450px]">
                      {/* Left Side - Categories */}
                      <div className="w-1/3 bg-secondary/20 p-6">
                        <h3 className="text-sm font-semibold text-primary mb-4">Mirror Collection</h3>
                        <div className="space-y-0.5">
                          {mirrorItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={`block px-3 py-2 text-sm rounded transition-all duration-200 ${
                                hoveredCategory === item.href 
                                  ? 'text-primary bg-primary/10' 
                                  : 'text-foreground hover:text-primary hover:bg-primary/10'
                              } focus:text-foreground active:text-foreground`}
                              onMouseEnter={() => setHoveredCategory(item.href)}
                              onMouseLeave={() => setHoveredCategory('')}
                              onClick={closeDropdown}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Side - Top Products */}
                      <div className="w-2/3 p-6 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-primary">Top Products</h3>
                          <p className="text-xs text-muted-foreground">
                            {hoveredCategory ? 'Most popular in this category' : 'Hover over a category to see products'}
                          </p>
                        </div>
                        <div className="space-y-3 flex-1">
                          {getTop3Products('mirrors', hoveredCategory || '/products/regular-silver').map((product, index) => (
                            <Link
                              key={index}
                              to={hoveredCategory || '/products/regular-silver'}
                              className="block p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
                              onClick={closeDropdown}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={product.image || '/placeholder.svg'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">{product.code}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                            <Link to="/mirrors" className="text-xs text-primary hover:text-primary/80 transition-colors" onClick={closeDropdown}>
                              VIEW ALL PRODUCTS →
                            </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary/90 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent transition-all duration-300 relative group data-[state=open]:text-primary focus:text-foreground active:text-foreground">
                    Scarfs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent 
                    className="bg-background border shadow-luxury"
                    onMouseEnter={() => setHoveredCategory('/products/bandhani')}
                  >
                    <div className="flex w-[800px] h-[450px]">
                      {/* Left Side - Categories */}
                      <div className="w-1/3 bg-secondary/20 p-6">
                        <h3 className="text-sm font-semibold text-primary mb-4">Scarfs Collection</h3>
                        <div className="space-y-0.5">
                          {scarfItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={`block px-3 py-2 text-sm rounded transition-all duration-200 ${
                                hoveredCategory === item.href 
                                  ? 'text-primary bg-primary/10' 
                                  : 'text-foreground hover:text-primary hover:bg-primary/10'
                              } focus:text-foreground active:text-foreground`}
                              onMouseEnter={() => setHoveredCategory(item.href)}
                              onMouseLeave={() => setHoveredCategory('')}
                              onClick={closeDropdown}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Side - Top Products */}
                      <div className="w-2/3 p-6 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-primary">Top Products</h3>
                          <p className="text-xs text-muted-foreground">
                            {hoveredCategory ? 'Most popular in this category' : 'Hover over a category to see products'}
                          </p>
                        </div>
                        <div className="space-y-3 flex-1">
                          {getTop3Products('scarfs', hoveredCategory || '/products/bandhani').map((product, index) => (
                            <Link
                              key={index}
                              to={hoveredCategory || '/products/bandhani'}
                              className="block p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
                              onClick={closeDropdown}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={product.image || '/placeholder.svg'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">{product.code}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                            <Link to="/scarfs" className="text-xs text-primary hover:text-primary/80 transition-colors" onClick={closeDropdown}>
                              VIEW ALL PRODUCTS →
                            </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary/90 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent transition-all duration-300 relative group data-[state=open]:text-primary focus:text-foreground active:text-foreground">
                    Bag Fabric
                  </NavigationMenuTrigger>
                  <NavigationMenuContent 
                    className="bg-background border shadow-luxury"
                    onMouseEnter={() => setHoveredCategory('/products/digital')}
                  >
                    <div className="flex w-[800px] h-[450px]">
                      {/* Left Side - Categories */}
                      <div className="w-1/3 bg-secondary/20 p-6">
                        <h3 className="text-sm font-semibold text-primary mb-4">Bag Fabric Collection</h3>
                        <div className="space-y-0.5">
                          {bagFabricItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={`block px-3 py-2 text-sm rounded transition-all duration-200 ${
                                hoveredCategory === item.href 
                                  ? 'text-primary bg-primary/10' 
                                  : 'text-foreground hover:text-primary hover:bg-primary/10'
                              } focus:text-foreground active:text-foreground`}
                              onMouseEnter={() => setHoveredCategory(item.href)}
                              onMouseLeave={() => setHoveredCategory('')}
                              onClick={closeDropdown}
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right Side - Top Products */}
                      <div className="w-2/3 p-6 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-primary">Top Products</h3>
                          <p className="text-xs text-muted-foreground">
                            {hoveredCategory ? 'Most popular in this category' : 'Hover over a category to see products'}
                          </p>
                        </div>
                        <div className="space-y-3 flex-1">
                          {getTop3Products('bag-fabric', hoveredCategory || '/products/digital').map((product, index) => (
                            <Link
                              key={index}
                              to={hoveredCategory || '/products/digital'}
                              className="block p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
                              onClick={closeDropdown}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={product.image || '/placeholder.svg'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">{product.code}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                            <Link to="/bag-fabric" className="text-xs text-primary hover:text-primary/80 transition-colors" onClick={closeDropdown}>
                              VIEW ALL PRODUCTS →
                            </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavLink href="/about">About Us</NavLink>
            <div className="w-4"></div>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Download Brochure Button - Desktop */}
          <div className="hidden lg:block">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-luxury"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/eloska-world.pdf';
                link.download = 'Eloska-World-Brochure.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Brochure
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden ml-auto">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-l">
              <div className="flex flex-col space-y-1 mt-8">
                {/* Mirror Collection Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMobileDropdown('mirrors')}
                    className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>Mirror Collection</span>
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdowns.mirrors ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  {openDropdowns.mirrors && (
                    <div className="space-y-1 pl-4">
                      {mirrorItems.map((item) => (
                        <MobileNavLink key={item.href} href={item.href}>
                          {item.title}
                        </MobileNavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scarfs Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMobileDropdown('scarfs')}
                    className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>Scarfs</span>
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdowns.scarfs ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  {openDropdowns.scarfs && (
                    <div className="space-y-1 pl-4">
                      {scarfItems.map((item) => (
                        <MobileNavLink key={item.href} href={item.href}>
                          {item.title}
                        </MobileNavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bag Fabric Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMobileDropdown('bagFabric')}
                    className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>Bag Fabric</span>
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdowns.bagFabric ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  {openDropdowns.bagFabric && (
                    <div className="space-y-1 pl-4">
                      {bagFabricItems.map((item) => (
                        <MobileNavLink key={item.href} href={item.href}>
                          {item.title}
                        </MobileNavLink>
                      ))}
                    </div>
                  )}
                </div>

                <MobileNavLink href="/about">About Us</MobileNavLink>
                <MobileNavLink href="/contact">Contact</MobileNavLink>
                
                {/* Download Brochure Button - Mobile */}
                <div className="px-6 py-3">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-luxury"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/eloska-world.pdf';
                      link.download = 'Eloska-World-Brochure.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Brochure
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;