'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Heart, ShoppingCart, Plus } from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cart-slice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favorites-slice';
import Image from 'next/image';

interface SearchInputProps {
    placeholder?: string;
    className?: string;
    showDropdown?: boolean;
    onResultClick?: () => void;
}

export function SearchInput({
    placeholder = "Ürün, marka ara...",
    className = "",
    showDropdown = true,
    onResultClick
}: SearchInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { search, searchResults, isSearching, clearSearch } = useSearch();
    const favorites = useAppSelector((state) => state.favorites.items);

    // Dışarı tıklama ile dropdown'u kapat
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        search(value);

        if (value.length >= 2 && showDropdown) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setInputValue('');
        clearSearch();
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        search(suggestion);
        setIsOpen(false);
    };

    const handleProductClick = (productId: string) => {
        setIsOpen(false);
        onResultClick?.();
        router.push(`/products/${productId}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setIsOpen(false);
            onResultClick?.();
            // Arama sonuçları sayfasına git
            router.push(`/products?search=${encodeURIComponent(inputValue.trim())}`);
        }
    };

    const handleViewAllResults = () => {
        setIsOpen(false);
        onResultClick?.();
        router.push(`/products?search=${encodeURIComponent(inputValue.trim())}`);
    };

    // Sepete ekle fonksiyonu
    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation(); // Product click event'ini engelle

        if (!product.inStock) return;

        // Product objesini tam interface'e uygun hale getir
        const fullProduct = {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            originalPrice: product.originalPrice,
            imageUrl: product.imageUrl,
            imageWebp: product.imageWebp,
            category: product.category,
            brand: product.brand,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity || 1,
            rating: product.rating,
            reviewCount: product.reviewCount || 0,
            tags: product.tags || []
        };

        dispatch(addToCart(fullProduct));
    };

    // Favorilere ekle/çıkar fonksiyonu
    const handleToggleFavorite = (e: React.MouseEvent, product: any) => {
        e.stopPropagation(); // Product click event'ini engelle

        const isFavorite = favorites.some(fav => fav.id === product.id);

        if (isFavorite) {
            dispatch(removeFromFavorites(product.id));
        } else {
            // Product objesini tam interface'e uygun hale getir
            const fullProduct = {
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price,
                originalPrice: product.originalPrice,
                imageUrl: product.imageUrl,
                imageWebp: product.imageWebp,
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                stockQuantity: product.stockQuantity || 1,
                rating: product.rating,
                reviewCount: product.reviewCount || 0,
                tags: product.tags || []
            };

            dispatch(addToFavorites(fullProduct));
        }
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                        if (inputValue.length >= 2 && showDropdown) {
                            setIsOpen(true);
                        }
                    }}
                    className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />

                {/* Clear Button */}
                {inputValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 cursor-pointer"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </Button>
                )}

                {/* Loading Indicator */}
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                    </div>
                )}
            </form>

            {/* Search Dropdown */}
            {isOpen && showDropdown && inputValue.length >= 2 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[32rem] overflow-hidden"
                >
                    {isSearching ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 text-amber-500 animate-spin mr-2" />
                            <span className="text-gray-600">Aranıyor...</span>
                        </div>
                    ) : (
                        <>
                            {/* Suggestions */}
                            {searchResults.suggestions.length > 0 && (
                                <div className="border-b border-gray-100 p-3">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Öneriler
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {searchResults.suggestions.map((suggestion, index) => (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="text-xs h-6 px-2 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 cursor-pointer"
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            {searchResults.products.length > 0 ? (
                                <div className="p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Ürünler ({searchResults.total})
                                        </div>
                                        {searchResults.total > 8 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleViewAllResults}
                                                className="text-xs text-amber-600 hover:text-amber-700 cursor-pointer"
                                            >
                                                Tümünü Gör
                                            </Button>
                                        )}
                                    </div>

                                    {/* Scrollable Products List */}
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {searchResults.products.slice(0, 8).map((product) => {
                                            const isFavorite = favorites.some(fav => fav.id === product.id);

                                            return (
                                                <div
                                                    key={product.id}
                                                    className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative"
                                                    onClick={() => handleProductClick(product.id)}
                                                >
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm text-gray-900 truncate">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {product.brand} • {product.category}
                                                        </div>
                                                        <div className="text-sm font-semibold text-amber-600">
                                                            {product.price.toLocaleString('tr-TR')}₺
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        {/* Favorite Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => handleToggleFavorite(e, product)}
                                                            className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${isFavorite
                                                                    ? 'text-red-500 hover:text-red-600'
                                                                    : 'text-gray-400 hover:text-red-500'
                                                                }`}
                                                            title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                                                        >
                                                            <Heart
                                                                className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-current scale-110' : 'hover:scale-110'
                                                                    }`}
                                                            />
                                                        </Button>

                                                        {/* Add to Cart Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => handleAddToCart(e, product)}
                                                            disabled={!product.inStock}
                                                            className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${product.inStock
                                                                    ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                                    : 'text-gray-300 cursor-not-allowed'
                                                                }`}
                                                            title={product.inStock ? 'Sepete ekle' : 'Stokta yok'}
                                                        >
                                                            <ShoppingCart className="h-4 w-4 transition-all duration-200" />
                                                        </Button>
                                                    </div>

                                                    {/* Stock Status */}
                                                    {!product.inStock && (
                                                        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded ml-2">
                                                            Stokta Yok
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {searchResults.total > 8 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <Button
                                                onClick={handleViewAllResults}
                                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm cursor-pointer"
                                            >
                                                {searchResults.total - 8} ürün daha görüntüle
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <div className="text-sm font-medium text-gray-900 mb-1">
                                        Sonuç bulunamadı
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        &ldquo;{inputValue}&rdquo; için ürün bulunamadı
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
} 