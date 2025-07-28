export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    icon: string;
    parentId?: string;
    level: number; // 0: ana kategori, 1: alt kategori, 2: sub-alt kategori
    productCount: number;
    isActive: boolean;
    sortOrder: number;
    seoTitle?: string;
    seoDescription?: string;
    children?: Category[];
    featuredProducts?: string[]; // Product ID'leri
}

export interface CategoryWithProducts extends Category {
    products: import('./product').Product[];
}

export interface CategoryTree {
    category: Category;
    subcategories: CategoryTree[];
}

export interface CategoryStats {
    totalCategories: number;
    totalProducts: number;
    popularCategories: Category[];
    featuredCategories: Category[];
} 