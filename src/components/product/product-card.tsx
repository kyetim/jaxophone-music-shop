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
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl cursor-pointer">
            <CardContent className="p-0 relative">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
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
                                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
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

                {/* Product Info */}
                <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            {product.brand}
                        </span>
                        <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        </div>
                    </div>

                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-amber-600 transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">
                                    {product.price.toLocaleString('tr-TR')}₺
                                </span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {product.originalPrice.toLocaleString('tr-TR')}₺
                                    </span>
                                )}
                            </div>
                            {product.inStock && (
                                <p className="text-xs text-green-600 font-medium">
                                    ✓ {product.stockQuantity} adet stokta
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </Button>
            </CardFooter>
        </Card>
    );
} 