// product.ts

// Define a TypeScript interface for the product object
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  }
// Export function to get products from the dummyjson.com API
export async function searchProducts(searchTerm): Promise<Product[]> {
    try {
      const response = await fetch('https://dummyjson.com/products/search?q='+searchTerm);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const productsData: Product[] = await response.json();
      return productsData;
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Return an empty array if fetching fails
    }
  }