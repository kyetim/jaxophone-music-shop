'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import {
    CreditCard,
    MapPin,
    User,
    Phone,
    Mail,
    Lock,
    CheckCircle,
    ArrowLeft,
    Truck,
    Gift
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, total, itemCount } = useAppSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [shippingMethod, setShippingMethod] = useState('standard');

    const shipping = total > 500 ? 0 : 29.99;
    const tax = total * 0.18;
    const finalTotal = total + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Checkout yapmak için önce sepetinize ürün eklemelisiniz.
                        </p>
                        <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                            <Link href="/">Alışverişe Başla</Link>
                        </Button>
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
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" asChild>
                            <Link href="/cart">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Sepete Dön
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600">Siparişinizi tamamlamak için bilgilerinizi doldurun</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-amber-600" />
                                    Teslimat Adresi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ad *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Adınız"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Soyad *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Soyadınız"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-posta *
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefon *
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="0555 123 45 67"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adres *
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Tam adresinizi yazın"
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İl *
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                                            <option>İstanbul</option>
                                            <option>Ankara</option>
                                            <option>İzmir</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İlçe *
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                                            <option>Beyoğlu</option>
                                            <option>Kadıköy</option>
                                            <option>Şişli</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Posta Kodu
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="34000"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-amber-600" />
                                    Teslimat Yöntemi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="standard"
                                        checked={shippingMethod === 'standard'}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                        className="text-amber-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">Standart Kargo</div>
                                        <div className="text-sm text-gray-600">3-5 iş günü</div>
                                    </div>
                                    <div className="font-medium">
                                        {shipping === 0 ? 'Ücretsiz' : `${shipping}₺`}
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="express"
                                        checked={shippingMethod === 'express'}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                        className="text-amber-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">Hızlı Kargo</div>
                                        <div className="text-sm text-gray-600">1-2 iş günü</div>
                                    </div>
                                    <div className="font-medium">49.99₺</div>
                                </label>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-amber-600" />
                                    Ödeme Yöntemi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="credit-card"
                                            checked={paymentMethod === 'credit-card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="text-amber-600"
                                        />
                                        <CreditCard className="h-5 w-5 text-gray-600" />
                                        <span className="font-medium">Kredi Kartı</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank-transfer"
                                            checked={paymentMethod === 'bank-transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="text-amber-600"
                                        />
                                        <Lock className="h-5 w-5 text-gray-600" />
                                        <span className="font-medium">Banka Havalesi</span>
                                    </label>
                                </div>

                                {paymentMethod === 'credit-card' && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kart Numarası *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder="1234 5678 9012 3456"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Son Kullanma *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Kart Üzerindeki İsim *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                placeholder="AD SOYAD"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sipariş Özeti</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.imageWebp || item.product.imageUrl}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                                            <p className="text-xs text-gray-600">{item.product.brand}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-600">Adet: {item.quantity}</span>
                                                <span className="font-medium text-sm">
                                                    {(item.product.price * item.quantity).toLocaleString('tr-TR')}₺
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Price Summary */}
                        <Card>
                            <CardContent className="space-y-3 pt-6">
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

                                <Button
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-lg mt-6"
                                    size="lg"
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Siparişi Onayla
                                </Button>

                                <div className="text-xs text-gray-500 text-center mt-4">
                                    Siparişi onaylayarak <Link href="#" className="text-amber-600 underline">Kullanım Şartları</Link> ve <Link href="#" className="text-amber-600 underline">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 