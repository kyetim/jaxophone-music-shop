'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Truck,
    Package,
    Clock,
    MapPin,
    CreditCard,
    Shield,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Kargo Bilgileri
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Siparişleriniz güvenli ve hızlı bir şekilde kapınıza kadar teslim edilir.
                        Kargo süreleri ve ücretleri hakkında detaylı bilgi alabilirsiniz.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Options */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Truck className="h-5 w-5 text-amber-600" />
                                    Kargo Seçenekleri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Free Shipping */}
                                <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Ücretsiz Kargo</h3>
                                        </div>
                                        <Badge className="bg-green-600 text-white">Önerilen</Badge>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Minimum Tutar:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">150₺ ve üzeri</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Teslimat Süresi:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">1-3 iş günü</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Express Shipping */}
                                <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-amber-600" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Hızlı Kargo</h3>
                                        </div>
                                        <Badge className="bg-amber-600 text-white">+15₺</Badge>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Minimum Tutar:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">50₺ ve üzeri</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Teslimat Süresi:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">Aynı gün / Ertesi gün</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Standard Shipping */}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Truck className="h-5 w-5 text-gray-600" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Standart Kargo</h3>
                                        </div>
                                        <Badge className="bg-gray-600 text-white">+25₺</Badge>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Minimum Tutar:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">Yok</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Teslimat Süresi:</p>
                                            <p className="font-medium text-gray-900 dark:text-white">2-5 iş günü</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Areas */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <MapPin className="h-5 w-5 text-amber-600" />
                                    Teslimat Bölgeleri
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Teslimat Yapılan Bölgeler
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <li>• Tüm Türkiye geneli</li>
                                            <li>• İstanbul (Aynı gün teslimat)</li>
                                            <li>• Ankara, İzmir (Ertesi gün teslimat)</li>
                                            <li>• Diğer şehirler (1-3 iş günü)</li>
                                            <li>• Adalar ve uzak bölgeler (3-5 iş günü)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            Teslimat Yapılmayan Bölgeler
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <li>• KKTC (Kıbrıs)</li>
                                            <li>• Yurtdışı adresler</li>
                                            <li>• PTT kutusu adresleri</li>
                                            <li>• Genel merkez adresleri</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tracking */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Package className="h-5 w-5 text-amber-600" />
                                    Kargo Takibi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Siparişiniz kargoya verildikten sonra size SMS ve e-posta ile kargo takip numarası gönderilir.
                                    </p>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kargo Takip Yöntemleri:</h4>
                                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <li>• SMS ile gelen link üzerinden</li>
                                            <li>• E-posta ile gelen takip numarası ile</li>
                                            <li>• Hesabım sayfasından sipariş takibi</li>
                                            <li>• Kargo firmasının web sitesinden</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Important Notes */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Info className="h-5 w-5 text-amber-600" />
                                    Önemli Notlar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Teslimat Saatleri</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Pazartesi - Cumartesi: 09:00 - 18:00
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Güvenli Teslimat</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Tüm kargolar sigortalı olarak gönderilir
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CreditCard className="h-4 w-4 text-purple-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">Ödeme</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Kapıda ödeme seçeneği mevcuttur
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-white">Kargo Desteği</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">0850 955 77 77</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Kargo ile ilgili sorularınız için müşteri hizmetlerimizi arayabilirsiniz.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-white">Sık Sorulan Sorular</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                        Kargo ücreti ne kadar?
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        150₺ ve üzeri alışverişlerde ücretsiz, altında 25₺
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                        Ne kadar sürede gelir?
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Şehir merkezlerinde 1-3 gün, uzak bölgelerde 3-5 gün
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                        Kapıda ödeme var mı?
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Evet, kapıda ödeme seçeneği mevcuttur
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 