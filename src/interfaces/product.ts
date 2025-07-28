export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    imageWebp?: string;
    category: string;
    brand: string;
    inStock: boolean;
    stockQuantity: number;
    rating: number;
    reviewCount: number;
    tags: string[];
}

export interface CartItem {
    product: Product;
    quantity: number;
} 