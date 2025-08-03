'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromFavorites, clearFavorites } from '@/store/slices/favorites-slice';
import { addToCart } from '@/store/slices/cart-slice';
import { Product } from '@/interfaces/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    X,
    ShoppingCart,
    Star,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FavoritesSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function FavoritesSidebar({ isOpen, onClose, onMouseEnter, onMouseLeave }: FavoritesSidebarProps) {
    const dispatch = useAppDispatch();
    const favoriteItems = useAppSelector((state) => state.favorites.items);

    const handleRemoveFromFavorites = (productId: string) => {
        dispatch(removeFromFavorites(productId));
    };

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    const handleClearFavorites = () => {
        dispatch(clearFavorites());
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                    onMouseEnter={onMouseLeave}
                />
            )}

            {/* Invisible hover extension area */}
            {isOpen && (
                <div
                    className="fixed top-0 right-80 w-20 h-full z-45"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Favorilerim ({favoriteItems.length})
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {favoriteItems.length > 0 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClearFavorites}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                                title="Tümünü Temizle"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {favoriteItems.length === 0 ? (
                    /* Empty Favorites */
                    <div className="flex flex-col items-center justify-center flex-1 p-6">
                        <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Favorileriniz Boş</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                            Henüz favori ürününüz yok. Beğendiğiniz ürünleri favorilere ekleyerek kolayca bulabilirsiniz!
                        </p>
                        <Button
                            asChild
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white cursor-pointer"
                            onClick={onClose}
                        >
                            <Link href="/">Ürünleri Keşfet</Link>
                        </Button>
                    </div>
                ) : (
                    /* Favorites Items Layout */
                    <>
                        {/* Scrollable Items List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 space-y-3">
                                {favoriteItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        {/* Product Image */}
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Link href={`/products/${item.id}`} onClick={onClose}>
                                                <Image
                                                    src={item.imageWebp || item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-200"
                                                    sizes="64px"
                                                />
                                            </Link>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="min-w-0 flex-1">
                                                    <Link href={`/products/${item.id}`} onClick={onClose}>
                                                        <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate leading-tight hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                                                            {item.name}
                                                        </h4>
                                                    </Link>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveFromFavorites(item.id)}
                                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 h-5 w-5 flex-shrink-0 ml-1 cursor-pointer"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs text-gray-600 dark:text-gray-300">{item.rating}</span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">({item.reviewCount})</span>
                                            </div>

                                            <div className="flex items-center justify-between mt-1">
                                                {/* Price */}
                                                <div className="text-left">
                                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                                                        {item.price.toLocaleString('tr-TR')}₺
                                                    </div>
                                                    {item.originalPrice && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                                            {item.originalPrice.toLocaleString('tr-TR')}₺
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add to Cart Button */}
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAddToCart(item)}
                                                    disabled={!item.inStock}
                                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs px-2 py-1 h-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                                    {item.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer - Fixed at Bottom */}
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                            <div className="p-4 space-y-3">
                                {/* Info */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <Heart className="inline h-4 w-4 mr-1 text-red-500" />
                                        {favoriteItems.length} ürün favorilerinizde
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg py-2 cursor-pointer"
                                        onClick={onClose}
                                    >
                                        <Link href="/favorites">
                                            Tüm Favorileri Görüntüle
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleClearFavorites}
                                        className="w-full border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 cursor-pointer"
                                    >
                                        Favorileri Temizle
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
} 