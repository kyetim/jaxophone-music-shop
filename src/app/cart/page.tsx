'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateQuantity, removeFromCart, clearCart } from '@/store/slices/cart-slice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart,
    Plus,
    Minus,
    X,
    Truck,
    Shield,
    CreditCard,
    ArrowLeft,
    Gift,
    Percent
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { items, total, itemCount } = useAppSelector((state) => state.cart);
    const router = useRouter();

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const shipping = total > 500 ? 0 : 29.99;
    const tax = total * 0.18; // KDV %18
    const finalTotal = total + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Henüz sepetinize ürün eklemediniz. En kaliteli müzik aletlerini keşfetmek için alışverişe başlayın!
                            </p>
                            <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-5 w-5" />
                                    Alışverişe Başla
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sepetim</h1>
                            <p className="text-gray-600">{itemCount} ürün sepetinizde</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleClearCart}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            Sepeti Temizle
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.product.id} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.imageWebp || item.product.imageUrl}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover cursor-pointer"
                                                sizes="96px"
                                                onClick={() => router.push(`/products/${item.product.id}`)}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{item.product.brand}</p>
                                                    {item.product.originalPrice && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="destructive" className="text-xs">
                                                                %{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)} İndirim
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(item.product.id)}
                                                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-gray-900">
                                                        {(item.product.price * item.quantity).toLocaleString('tr-TR')}₺
                                                    </div>
                                                    {item.product.originalPrice && (
                                                        <div className="text-sm text-gray-500 line-through">
                                                            {(item.product.originalPrice * item.quantity).toLocaleString('tr-TR')}₺
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Promo Code */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Percent className="h-5 w-5 text-amber-600" />
                                    İndirim Kodu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="İndirim kodunuz"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <Button variant="outline" className="cursor-pointer">Uygula</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ShoppingCart className="h-5 w-5 text-amber-600" />
                                    Sipariş Özeti
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ara Toplam</span>
                                        <span className="font-medium">{total.toLocaleString('tr-TR')}₺</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kargo</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? (
                                                <span className="text-green-600">Ücretsiz</span>
                                            ) : (
                                                `${shipping.toLocaleString('tr-TR')}₺`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">KDV (%18)</span>
                                        <span className="font-medium">{tax.toLocaleString('tr-TR')}₺</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Toplam</span>
                                            <span className="text-amber-600">{finalTotal.toLocaleString('tr-TR')}₺</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <p className="text-sm text-amber-800">
                                            <Gift className="inline h-4 w-4 mr-1" />
                                            {(500 - total).toLocaleString('tr-TR')}₺ daha alışveriş yapın, kargo ücretsiz olsun!
                                        </p>
                                    </div>
                                )}

                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-lg cursor-pointer"
                                    size="lg"
                                >
                                    <Link href="/checkout">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Siparişi Tamamla
                                    </Link>
                                </Button>

                                {/* Trust Badges */}
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <span>256-bit SSL ile güvenli ödeme</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                        <span>24 saat içinde kargoya teslim</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Gift className="h-4 w-4 text-purple-600" />
                                        <span>14 gün koşulsuz iade hakkı</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Button
                            variant="outline"
                            asChild
                            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 cursor-pointer"
                        >
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Alışverişe Devam Et
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 