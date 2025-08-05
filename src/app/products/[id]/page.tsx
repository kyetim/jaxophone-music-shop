'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { ProductReviews } from '@/components/product/product-reviews';
import { ProductService } from '@/lib/firestore';
import { Product } from '@/interfaces/product';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cart-slice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favorites-slice';
import { useAppSelector } from '@/store/hooks';
import {
    Heart,
    ShoppingCart,
    Star,
    Shield,
    Truck,
    RotateCcw,
    ChevronLeft,
    Minus,
    Plus,
    X,
    ZoomIn
} from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isRelatedLoading, setIsRelatedLoading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const favorites = useAppSelector((state) => state.favorites.items);
    const isFavorite = product ? favorites.some(fav => fav.id === product.id) : false;

    // Component mount state
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Product ID'yi al
    const productId = params ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

    // Ürün detaylarını yükle
    useEffect(() => {
        const loadProduct = async () => {
            if (!productId) return;

            try {
                setIsLoading(true);
                const productData = await ProductService.getById(productId);
                setProduct(productData);
            } catch (error) {
                console.error('Error loading product:', error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    // Benzer ürünleri yükle
    useEffect(() => {
        const loadRelatedProducts = async () => {
            if (!product) return;

            try {
                setIsRelatedLoading(true);
                console.log('Loading related products for:', product.name);

                // Aynı kategori veya markadan ürünler getir
                const allProducts = await ProductService.getAll();
                console.log('All products loaded:', allProducts.length);

                const related = allProducts
                    .filter(p =>
                        p.id !== product.id && // Mevcut ürünü hariç tut
                        (p.category === product.category || p.brand === product.brand)
                    )
                    .slice(0, 4); // İlk 4 ürünü al

                console.log('Related products found:', related.length, related);
                setRelatedProducts(related);
            } catch (error) {
                console.error('Error loading related products:', error);
                setRelatedProducts([]);
            } finally {
                setIsRelatedLoading(false);
            }
        };

        loadRelatedProducts();
    }, [product]);

    // Sepete ekle
    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(product));
        }
    };

    // Favorilere ekle/çıkar
    const handleToggleFavorite = () => {
        if (!product) return;

        if (isFavorite) {
            dispatch(removeFromFavorites(product.id));
        } else {
            dispatch(addToFavorites(product));
        }
    };

    // Fotoğraf modal'ını aç/kapat
    const handleImageClick = () => {
        console.log('Image clicked, opening modal...');
        setShowImageModal(true);
    };

    const handleCloseModal = () => {
        console.log('Closing modal...');
        setShowImageModal(false);
    };

    // ESC tuşu ile modal'ı kapat
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowImageModal(false);
            }
        };

        if (showImageModal) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [showImageModal]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-96"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ürün Bulunamadı</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
                        <Button onClick={() => router.push('/products')} className="cursor-pointer">
                            Ürünlere Geri Dön
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />

                <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Geri
                        </Button>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="text-gray-600 dark:text-gray-400">Ürünler</span>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                        <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
                    </div>

                    {/* Product Detail */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                            {/* Product Images */}
                            <div className="space-y-4">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative group">
                                    <div
                                        className="w-full h-full cursor-pointer relative"
                                        onClick={handleImageClick}
                                    >
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            width={600}
                                            height={600}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-full p-2">
                                                    <ZoomIn className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Fotoğrafa tıklayarak büyütebilirsiniz</p>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Header */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                                            {product.brand}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
                                    </div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {product.name}
                                    </h1>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {product.rating} ({product.reviewCount} değerlendirme)
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {product.price.toLocaleString('tr-TR')}₺
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                                {product.originalPrice.toLocaleString('tr-TR')}₺
                                            </span>
                                        )}
                                    </div>
                                    {product.originalPrice && (
                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} indirim
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ürün Açıklaması</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`font-medium ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {product.inStock ? `Stokta (${product.stockQuantity} adet)` : 'Stokta Yok'}
                                    </span>
                                </div>

                                {/* Quantity & Add to Cart */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-gray-900 dark:text-white">Adet:</span>
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="px-4 py-2 font-medium text-gray-900 dark:text-white">{quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                                disabled={quantity >= product.stockQuantity}
                                                className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Sepete Ekle
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleToggleFavorite}
                                            className="cursor-pointer border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        Ücretsiz Kargo
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        30 Gün İade
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        2 Yıl Garanti
                                    </div>
                                </div>

                                {/* Tags */}
                                {product.tags.length > 0 && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Etiketler</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 lg:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Benzer Ürünler {relatedProducts.length > 0 && `(${relatedProducts.length})`}
                            </h2>

                            {isRelatedLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : relatedProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {relatedProducts.map((relatedProduct) => (
                                        <ProductCard
                                            key={relatedProduct.id}
                                            product={relatedProduct}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>Bu ürünle benzer ürün bulunamadı.</p>
                                    <p className="text-sm mt-2">Kategori: {product.category} | Marka: {product.brand}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Reviews */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-12">
                        <div className="p-6 lg:p-8">
                            <ProductReviews productId={product.id} productName={product.name} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Image Zoom Modal - Using Portal */}
            {isMounted && showImageModal && createPortal(
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={handleCloseModal}
                    style={{
                        zIndex: 99999,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={800}
                            height={800}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white cursor-pointer"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm opacity-80">{product.brand}</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
} 