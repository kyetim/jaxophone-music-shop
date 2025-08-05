'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cart-slice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favorites-slice';
import { Product } from '@/interfaces/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductCardListProps {
    product: Product;
}

export function ProductCardList({ product }: ProductCardListProps) {
    const dispatch = useAppDispatch();
    const favoriteItems = useAppSelector((state) => state.favorites.items);
    const isFavorited = favoriteItems.some((item) => item.id === product.id);

    function handleAddToCart() {
        dispatch(addToCart(product));
    }

    function handleToggleFavorite() {
        if (isFavorited) {
            dispatch(removeFromFavorites(product.id));
        } else {
            dispatch(addToFavorites(product));
        }
    }

    return (
        <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 rounded-xl cursor-pointer">
            <CardContent className="p-6">
                <div className="flex gap-6">
                    {/* Product Image - Smaller for list view */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Link href={`/products/${product.id}`} className="cursor-pointer">
                            <Image
                                src={product.imageWebp || product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="128px"
                            />
                        </Link>

                        {/* Favorite Button */}
                        <button
                            onClick={handleToggleFavorite}
                            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer ${isFavorited
                                ? 'bg-red-500 text-white shadow-lg scale-110'
                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>

                        {/* Discount Badge */}
                        {product.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-semibold text-xs shadow-lg">
                                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                            </Badge>
                        )}

                        {/* Stock Status */}
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="destructive" className="text-white font-semibold text-xs">
                                    Stokta Yok
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                                        {product.brand}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{product.rating}</span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">({product.reviewCount})</span>
                                    </div>
                                </div>

                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 mb-2">
                                        {product.name}
                                    </h3>
                                </Link>

                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                                    {product.description}
                                </p>

                                {/* Features */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Truck className="h-3 w-3 text-green-600" />
                                        <span>Ücretsiz Kargo</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <RotateCcw className="h-3 w-3 text-blue-600" />
                                        <span>30 Gün İade</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3 text-purple-600" />
                                        <span>2 Yıl Garanti</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex flex-col items-end gap-3 ml-4">
                                <div className="text-right">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            {product.price.toLocaleString('tr-TR')} ₺
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                {product.originalPrice.toLocaleString('tr-TR')} ₺
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.inStock
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                            }`}>
                                            {product.inStock ? 'Stokta' : 'Stokta Yok'}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    size="sm"
                                    className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Sepete Ekle
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 