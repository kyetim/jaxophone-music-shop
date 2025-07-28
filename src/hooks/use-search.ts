import { useState, useMemo } from 'react';
import { Product } from '@/interfaces/product';

// Tüm ürünler için sample data - gerçek uygulamada API'den gelecek
const allProducts: Product[] = [
    {
        id: '1',
        name: 'Fender Player Stratocaster',
        description: 'Modern özelliklerle yeniden tasarlanmış klasik Stratocaster. Alder gövde, Maple sap.',
        price: 8500,
        originalPrice: 9500,
        imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400',
        category: 'Elektro Gitar',
        brand: 'Fender',
        inStock: true,
        stockQuantity: 15,
        rating: 4.8,
        reviewCount: 127,
        tags: ['elektro-gitar', 'fender', 'stratocaster']
    },
    {
        id: '2',
        name: 'Gibson Les Paul Standard',
        description: 'Klasik Les Paul tonu ve oynanabilirliği. Mahogany gövde, Maple cap.',
        price: 15500,
        imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400',
        category: 'Elektro Gitar',
        brand: 'Gibson',
        inStock: true,
        stockQuantity: 8,
        rating: 4.9,
        reviewCount: 89,
        tags: ['elektro-gitar', 'gibson', 'les-paul']
    },
    {
        id: '3',
        name: 'Yamaha C40 Klasik Gitar',
        description: 'Başlangıç seviyesi için mükemmel klasik gitar. Spruce üst kapak, Meranti yan ve arka.',
        price: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
        category: 'Klasik Gitar',
        brand: 'Yamaha',
        inStock: true,
        stockQuantity: 25,
        rating: 4.5,
        reviewCount: 203,
        tags: ['klasik-gitar', 'yamaha', 'baslangic']
    },
    {
        id: '4',
        name: 'Roland FP-30X Dijital Piyano',
        description: 'Süpersen modeling ile akustik piyano hissi. 88 tuş, dahili hoparlör.',
        price: 12000,
        originalPrice: 13500,
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
        category: 'Dijital Piyano',
        brand: 'Roland',
        inStock: true,
        stockQuantity: 12,
        rating: 4.7,
        reviewCount: 156,
        tags: ['piyano', 'roland', 'dijital']
    },
    {
        id: '5',
        name: 'Pearl Export Series Davul Seti',
        description: 'Poplar kabuğu ile güçlü ses. 5 parça set, Sabian SBR platens dahil.',
        price: 8900,
        imageUrl: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=400',
        category: 'Akustik Davul',
        brand: 'Pearl',
        inStock: true,
        stockQuantity: 6,
        rating: 4.6,
        reviewCount: 94,
        tags: ['davul', 'pearl', 'akustik']
    },
    {
        id: '6',
        name: 'Yamaha YAS-280 Alto Saksafon',
        description: 'Öğrenci ve ara seviye için ideal. Güvenilir intonasyon ve kolay çalma.',
        price: 18500,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        category: 'Saksafon',
        brand: 'Yamaha',
        inStock: false,
        stockQuantity: 0,
        rating: 4.4,
        reviewCount: 67,
        tags: ['saksafon', 'yamaha', 'alto']
    },
    {
        id: '7',
        name: 'Martin D-28 Akustik Gitar',
        description: 'Klasik dreadnought ses karakteri. Sitka Spruce üst, East Indian Rosewood yan ve arka.',
        price: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
        category: 'Akustik Gitar',
        brand: 'Martin',
        inStock: true,
        stockQuantity: 3,
        rating: 4.9,
        reviewCount: 45,
        tags: ['akustik-gitar', 'martin', 'dreadnought']
    },
    {
        id: '8',
        name: 'Kawai MP11SE Stage Piano',
        description: 'Gerçek ahşap tuşlu profesyonel stage piano. Grand Feel III klavye hissi.',
        price: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
        category: 'Stage Piano',
        brand: 'Kawai',
        inStock: true,
        stockQuantity: 2,
        rating: 4.8,
        reviewCount: 23,
        tags: ['stage-piano', 'kawai', 'profesyonel']
    },
    {
        id: '9',
        name: 'DW Performance Series Davul Seti',
        description: 'Profesyonel kalite maple shell davul seti. 5 parça, hardware dahil.',
        price: 25000,
        originalPrice: 28000,
        imageUrl: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=400',
        category: 'Akustik Davul',
        brand: 'DW',
        inStock: true,
        stockQuantity: 1,
        rating: 4.9,
        reviewCount: 34,
        tags: ['davul', 'dw', 'profesyonel', 'maple']
    },
    {
        id: '10',
        name: 'Bach Stradivarius 37 Trompet',
        description: 'Profesyonel trompet. Yellow brass bell, Monel valves.',
        price: 22000,
        imageUrl: 'https://images.unsplash.com/photo-1574890820845-64d35901b6b7?w=400',
        category: 'Trompet',
        brand: 'Bach',
        inStock: true,
        stockQuantity: 4,
        rating: 4.7,
        reviewCount: 18,
        tags: ['trompet', 'bach', 'brass', 'profesyonel']
    }
];

export interface SearchResult {
    products: Product[];
    total: number;
    query: string;
    suggestions: string[];
}

export function useSearch() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Arama algoritması
    const searchResults = useMemo((): SearchResult => {
        if (!query || query.length < 2) {
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
    }, [query]);

    const search = (newQuery: string) => {
        setIsSearching(true);
        setQuery(newQuery);
        // Simüle edilen API gecikme
        setTimeout(() => setIsSearching(false), 300);
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
        isSearching,
        setQuery
    };
} 