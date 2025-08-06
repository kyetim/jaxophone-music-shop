'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cart-slice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favorites-slice';
import { Product } from '@/interfaces/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 rounded-2xl cursor-pointer">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <Link href={`/products/${product.id}`} className="cursor-pointer">
                    <Image
                        src={product.imageWebp || product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </Link>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer ${isFavorited
                        ? 'bg-red-500 text-white shadow-lg scale-110'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500'
                        }`}
                >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                {/* Discount Badge */}
                {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-semibold shadow-lg">
                        %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İNDİRİM
                    </Badge>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-white font-semibold">
                            Stokta Yok
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-6">
                {/* Product Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
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
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 line-clamp-2 mt-2">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
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
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 