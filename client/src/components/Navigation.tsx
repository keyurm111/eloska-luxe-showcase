import { useState, useEffect } from 'react';
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
import { getOrganizedCategories, getCollections, getProducts, OrganizedCategories, Product } from '@/services/products';
// Logo from public folder
const eloskLogo = '/eloska logo.png';

// Default collections and categories for fallback
const DEFAULT_COLLECTIONS = ['Mirror Collection', 'Scarfs', 'Bag Fabric'];

const DEFAULT_CATEGORIES: OrganizedCategories = {
  'Mirror Collection': {
    categories: [
      {
        name: 'Regular Silver Mirrors',
        subcategories: ['Standard', 'Premium', 'Custom']
      },
      {
        name: 'Artistic Mirrors',
        subcategories: ['Decorative', 'Vintage', 'Modern']
      },
      {
        name: 'Acrylic Mirror',
        subcategories: ['Clear', 'Tinted', 'Safety']
      }
    ]
  },
  'Scarfs': {
    categories: [
      {
        name: 'Bandhani Scarf',
        subcategories: ['Cotton', 'Silk', 'Georgette']
      },
      {
        name: 'White Scarf',
        subcategories: ['Plain', 'Embroidered', 'Printed']
      },
      {
        name: 'Baby Scarf',
        subcategories: ['Soft Cotton', 'Organic', 'Hypoallergenic']
      }
    ]
  },
  'Bag Fabric': {
    categories: [
      {
        name: 'Digital Print Fabric',
        subcategories: ['Cotton', 'Polyester', 'Blend']
      },
      {
        name: 'Water Resistant Antifree Fabric',
        subcategories: ['PVC', 'PU', 'Coated']
      },
      {
        name: 'School Bag Fabric',
        subcategories: ['Canvas', 'Nylon', 'Leather']
      }
    ]
  }
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>('');
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<OrganizedCategories | null>(DEFAULT_CATEGORIES);
  const [collections, setCollections] = useState<string[]>(DEFAULT_COLLECTIONS);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Fetch products for a specific category
  const fetchCategoryProducts = async (categoryName: string, collectionName: string) => {
    try {
      const response = await getProducts({
        category: categoryName,
        collection: collectionName,
        limit: 3,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching products for ${categoryName}:`, error);
      return [];
    }
  };

  // Fetch categories and collections on component mount
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API, but use defaults if it fails
        let categoriesData = DEFAULT_CATEGORIES;
        let collectionsData = DEFAULT_COLLECTIONS;
        
        try {
          const [categoriesResponse, collectionsResponse] = await Promise.all([
            getOrganizedCategories(),
            getCollections()
          ]);
          
          // Only update if API returns valid data
          if (categoriesResponse.success && categoriesResponse.data) {
            categoriesData = categoriesResponse.data;
          }
          if (collectionsResponse.success && collectionsResponse.data && Array.isArray(collectionsResponse.data)) {
            collectionsData = collectionsResponse.data;
          }
        } catch (apiError) {
          console.warn('API fetch failed, using default data:', apiError);
        }
        
        setCategories(categoriesData);
        setCollections(collectionsData);

        // Fetch products for each category (with error handling)
        const productsMap: { [key: string]: Product[] } = {};
        for (const collectionName of collectionsData) {
          const collectionData = categoriesData[collectionName];
          if (collectionData) {
            const categories = collectionData.categories || [];
            for (const category of categories) {
              try {
                const categorySlug = getCategorySlug(category.name);
                const products = await fetchCategoryProducts(category.name, collectionName);
                productsMap[`/products/${categorySlug}`] = products;
              } catch (productError) {
                console.warn(`Failed to fetch products for ${category.name}:`, productError);
                // Set empty array as fallback
                const categorySlug = getCategorySlug(category.name);
                productsMap[`/products/${categorySlug}`] = [];
              }
            }
          }
        }
        setCategoryProducts(productsMap);
      } catch (error) {
        console.error('Error in navigation data setup:', error);
        // Ensure we still have default data even if everything fails
        setCategories(DEFAULT_CATEGORIES);
        setCollections(DEFAULT_COLLECTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  // Function to get top 3 products for each category with real data
  const getTop3Products = (href: string) => {
    const products = categoryProducts[href] || [];
    return products.slice(0, 3).map(product => ({
      name: product.name,
      code: product.productCode || product._id?.slice(-6) || 'N/A',
      description: product.description || 'Premium quality product',
      image: product.images && product.images.length > 0 
        ? (product.images[0].startsWith('http') 
            ? product.images[0] 
            : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004'}${product.images[0]}`)
        : '/placeholder.svg'
    }));
  };


  // Generate navigation items dynamically from categories
  const getNavigationItems = (collectionName: string) => {
    if (!categories || !categories[collectionName]) return [];
    
    return categories[collectionName].categories.map(category => ({
      title: category.name,
      href: `/products/${getCategorySlug(category.name)}`
    }));
  };

  // Convert category name to URL slug
  const getCategorySlug = (categoryName: string) => {
    const slugMap: { [key: string]: string } = {
      'Regular Silver Mirrors': 'regular-silver',
      'Artistic Mirrors': 'artistic',
      'Acrylic Mirror': 'acrylic',
      'Catalogues': 'catalogues',
      'Mirrors Sheet': 'mirror-sheet',
      'Bandhani Scarf': 'bandhani',
      'White Scarf': 'white-scarf',
      'Baby Scarf': 'baby-scarf',
      'Digital Print Fabric': 'digital',
      'Water Resistant Antifree Fabric': 'waterproof',
      'School Bag Fabric': 'school'
    };
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Get collection display name
  const getCollectionDisplayName = (collectionName: string) => {
    const displayNames: { [key: string]: string } = {
      'Mirror Collection': 'Mirror Collection',
      'Scarfs': 'Scarfs',
      'Bag Fabric': 'Bag Fabric'
    };
    return displayNames[collectionName] || collectionName;
  };



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
                {loading ? (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  collections.map((collection) => {
                    const collectionItems = getNavigationItems(collection);
                    if (collectionItems.length === 0) return null;
                    
                    return (
                      <NavigationMenuItem key={collection}>
                        <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary/90 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent transition-all duration-300 relative group data-[state=open]:text-primary focus:text-foreground active:text-foreground">
                          {getCollectionDisplayName(collection)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent 
                          className="bg-background border shadow-luxury"
                          onMouseEnter={() => setHoveredCategory(collectionItems[0]?.href || '')}
                          onMouseLeave={() => setHoveredCategory('')}
                        >
                          <div className="flex w-[800px] h-[450px]">
                            {/* Left Side - Categories */}
                            <div className="w-1/3 bg-secondary/20 p-6">
                              <h3 className="text-sm font-semibold text-primary mb-4">{getCollectionDisplayName(collection)}</h3>
                              <div className="space-y-0.5">
                                {collectionItems.map((item) => (
                                  <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`block px-3 py-2 text-sm rounded transition-all duration-200 ${
                                      hoveredCategory === item.href 
                                        ? 'text-primary bg-primary/10' 
                                        : 'text-foreground hover:text-primary hover:bg-primary/10'
                                    } focus:text-foreground active:text-foreground`}
                                    onMouseEnter={() => setHoveredCategory(item.href)}
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
                                {getTop3Products(hoveredCategory || collectionItems[0]?.href || '').map((product, index) => (
                                  <Link
                                    key={index}
                                    to={hoveredCategory || collectionItems[0]?.href || ''}
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
                                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                                          {product.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {product.code}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {product.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              <div className="mt-4 pt-3 border-t">
                                <Link 
                                  to={hoveredCategory || collectionItems[0]?.href || '#'} 
                                  className="text-xs text-primary hover:text-primary/80 transition-colors" 
                                  onClick={closeDropdown}
                                >
                                  {hoveredCategory ? 'VIEW ALL PRODUCTS IN THIS CATEGORY →' : 'VIEW ALL PRODUCTS →'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  })
                )}
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  collections.map((collection) => {
                    const collectionItems = getNavigationItems(collection);
                    if (collectionItems.length === 0) return null;
                    
                    const dropdownKey = collection.toLowerCase().replace(/\s+/g, '');
                    
                    return (
                      <div key={collection} className="space-y-1">
                        <button
                          onClick={() => toggleMobileDropdown(dropdownKey)}
                          className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <span>{getCollectionDisplayName(collection)}</span>
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openDropdowns[dropdownKey] ? 'rotate-90' : ''
                            }`} 
                          />
                        </button>
                        {openDropdowns[dropdownKey] && (
                          <div className="space-y-1 pl-4">
                            {collectionItems.map((item) => (
                              <MobileNavLink key={item.href} href={item.href}>
                                {item.title}
                              </MobileNavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

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