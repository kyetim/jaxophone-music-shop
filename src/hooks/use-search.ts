import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/interfaces/product';
import { ProductService } from '@/lib/firestore';

export interface SearchResult {
    products: Product[];
    total: number;
    query: string;
    suggestions: string[];
}

export function useSearch() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Tüm ürünleri Firestore'dan yükle (component mount'ta)
    useEffect(() => {
        let isMounted = true;

        const loadAllProducts = async () => {
            try {
                const products = await ProductService.getAll();
                if (isMounted) {
                    setAllProducts(products);
                }
            } catch (error) {
                console.error('Error loading products for search:', error);
                // Fallback: empty array
                if (isMounted) {
                    setAllProducts([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadAllProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Arama algoritması
    const searchResults = useMemo((): SearchResult => {
        if (!query || query.length < 2 || isLoading) {
            return {
                products: [],
                total: 0,
                query: '',
                suggestions: []
            };
        }

        const searchTerm = query.toLowerCase().trim();
        const filteredProducts = allProducts.filter(product => {
            // İsim, marka, kategori, açıklama ve tag'lerde ara
            const searchFields = [
                product.name.toLowerCase(),
                product.brand.toLowerCase(),
                product.category.toLowerCase(),
                product.description.toLowerCase(),
                ...product.tags.map(tag => tag.toLowerCase())
            ];

            return searchFields.some(field => field.includes(searchTerm));
        });

        // Öneri kelimeleri oluştur
        const suggestions = Array.from(
            new Set([
                ...allProducts.map(p => p.brand),
                ...allProducts.map(p => p.category),
                ...allProducts.flatMap(p => p.tags)
            ])
        )
            .filter(suggestion =>
                suggestion.toLowerCase().includes(searchTerm) &&
                suggestion.toLowerCase() !== searchTerm
            )
            .slice(0, 5);

        return {
            products: filteredProducts,
            total: filteredProducts.length,
            query: searchTerm,
            suggestions
        };
    }, [query, allProducts, isLoading]);

    const search = (newQuery: string) => {
        setIsSearching(true);
        setQuery(newQuery);
        // Simüle edilen arama gecikme
        setTimeout(() => setIsSearching(false), 200);
    };

    const clearSearch = () => {
        setQuery('');
        setIsSearching(false);
    };

    return {
        query,
        search,
        clearSearch,
        searchResults,
        isSearching: isSearching || isLoading,
        setQuery,
        allProducts,
        isLoading
    };
} 