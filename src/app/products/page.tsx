'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/search-input';
import { ProductCardSkeleton } from '@/components/ui/loading';
import { ProductService } from '@/lib/firestore';
import { Product } from '@/interfaces/product';
import {
    Search,
    Grid3X3,
    List
} from 'lucide-react';
import { useSearch } from '@/hooks/use-search';

export default function ProductsPage() {
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const searchParams = useSearchParams();
    const { searchResults, search, query, setQuery, isSearching } = useSearch();

    // URL'den arama parametresini al
    const urlSearchQuery = searchParams?.get('search');

    // Tüm ürünleri Firestore'dan yükle
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await ProductService.getAll();
                setAllProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    // URL'den arama parametresini al ve uygula
    useEffect(() => {
        if (urlSearchQuery && urlSearchQuery !== query) {
            setQuery(urlSearchQuery);
            search(urlSearchQuery);
        }
    }, [urlSearchQuery, query, search, setQuery]);

    // Gösterilecek ürünleri belirle (arama varsa search results, yoksa tüm ürünler)
    const isSearchActive = query && query.length >= 2;
    const displayProducts = isSearchActive ? searchResults.products : allProducts;

    // Ürünleri sırala
    const sortedProducts = [...displayProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    // Loading durumunu belirle
    const showLoading = isLoading || (isSearchActive && isSearching);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {isSearchActive ? `"${query}" için Sonuçlar` : 'Tüm Ürünler'}
                    </h1>

                    {/* Search and Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Input */}
                        <div className="w-full lg:w-96">
                            <SearchInput />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
                            >
                                <option value="newest">En Yeni</option>
                                <option value="price-asc">Fiyat (Düşük - Yüksek)</option>
                                <option value="price-desc">Fiyat (Yüksek - Düşük)</option>
                                <option value="rating">En Yüksek Puan</option>
                                <option value="name">A-Z</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="cursor-pointer"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="cursor-pointer"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    {!showLoading && (
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            {isSearchActive
                                ? `${sortedProducts.length} sonuç bulundu`
                                : `${sortedProducts.length} ürün gösteriliyor`
                            }
                        </p>
                    )}
                </div>

                {/* Products Grid/List */}
                {showLoading ? (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {[...Array(12)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : sortedProducts.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {isSearchActive ? 'Aradığınız ürün bulunamadı' : 'Henüz ürün bulunmuyor'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {isSearchActive
                                ? 'Farklı anahtar kelimeler deneyebilir veya filtreleri değiştirebilirsiniz.'
                                : 'Çok yakında yeni ürünler eklenecek!'
                            }
                        </p>
                        {isSearchActive && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setQuery('');
                                    search('');
                                }}
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Tüm Ürünleri Göster
                            </Button>
                        )}
                    </div>
                )}

                {/* Load More Button (if needed) */}
                {!showLoading && sortedProducts.length > 0 && sortedProducts.length % 12 === 0 && (
                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            className="cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={() => {
                                // Load more functionality burada implement edilecek
                                console.log('Load more products...');
                            }}
                        >
                            Daha Fazla Ürün Yükle
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
} 