import { useState, useCallback } from 'react';
import { getProducts, Product } from '@/services/products';

interface UseCategoryProductsReturn {
  categoryProducts: { [key: string]: Product[] };
  loading: boolean;
  fetchCategoryProducts: (categoryName: string, collectionName: string) => Promise<void>;
  getTop3Products: (href: string) => Array<{
    name: string;
    code: string;
    description: string;
    image: string;
  }>;
}

export const useCategoryProducts = (): UseCategoryProductsReturn => {
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(false);

  const fetchCategoryProducts = useCallback(async (categoryName: string, collectionName: string) => {
    // Create href key for consistency with Navigation component
    const categorySlug = getCategorySlug(categoryName);
    const href = `/products/${categorySlug}`;
    
    // Check if already cached
    if (categoryProducts[href]) {
      return;
    }

    try {
      setLoading(true);
      const response = await getProducts({
        category: categoryName,
        collection: collectionName,
        limit: 3,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setCategoryProducts(prev => ({
        ...prev,
        [href]: response.data.data
      }));
    } catch (error) {
      console.error(`Error fetching products for ${categoryName}:`, error);
      setCategoryProducts(prev => ({
        ...prev,
        [href]: []
      }));
    } finally {
      setLoading(false);
    }
  }, [categoryProducts]);

  const getTop3Products = useCallback((href: string) => {
    // Find products for the specific href/category
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
  }, [categoryProducts]);

  return {
    categoryProducts,
    loading,
    fetchCategoryProducts,
    getTop3Products
  };
};

// Helper function to convert category name to URL slug
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
