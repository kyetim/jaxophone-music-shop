export interface ProductFilters {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    inStock?: boolean;
    onSale?: boolean;
    rating?: number;
    sortBy: SortOption;
    searchQuery?: string;
    page: number;
    limit: number;
}

export type SortOption =
    | 'newest'
    | 'oldest'
    | 'price-asc'
    | 'price-desc'
    | 'name-asc'
    | 'name-desc'
    | 'rating-desc'
    | 'popularity'
    | 'discount-desc';

export interface FilterOption {
    id: string;
    label: string;
    count: number;
    isSelected?: boolean;
}

export interface FilterGroup {
    id: string;
    label: string;
    type: FilterType;
    options: FilterOption[];
    isCollapsed?: boolean;
}

export type FilterType =
    | 'checkbox'
    | 'radio'
    | 'range'
    | 'toggle'
    | 'select';

export interface PriceRange {
    min: number;
    max: number;
    step: number;
}

export interface ProductSearchParams {
    q?: string;
    category?: string;
    brand?: string[];
    'price-min'?: number;
    'price-max'?: number;
    'in-stock'?: boolean;
    'on-sale'?: boolean;
    rating?: number;
    sort?: SortOption;
    page?: number;
    limit?: number;
    view?: 'grid' | 'list';
}

export interface FilterState {
    filters: ProductFilters;
    availableFilters: FilterGroup[];
    priceRange: PriceRange;
    totalProducts: number;
    currentPage: number;
    totalPages: number;
} 