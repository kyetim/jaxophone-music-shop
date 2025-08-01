'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Header } from '@/components/layout/header';

export default function InstallmentPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock tracking data
        if (orderNumber.includes('JX')) {
            setTrackingResult({
                orderNumber: orderNumber,
                status: 'shipped',
                customerName: 'Ahmet Yılmaz',
                orderDate: '15 Ocak 2024',
                estimatedDelivery: '18 Ocak 2024',
                trackingCode: 'JX123456789TR',
                currentLocation: 'İstanbul Dağıtım Merkezi',
                timeline: [
                    { status: 'ordered', date: '15 Ocak 2024, 14:30', description: 'Siparişiniz alındı', completed: true },
                    { status: 'confirmed', date: '15 Ocak 2024, 15:45', description: 'Sipariş onaylandı', completed: true },
                    { status: 'prepared', date: '16 Ocak 2024, 09:15', description: 'Sipariş hazırlandı', completed: true },
                    { status: 'shipped', date: '16 Ocak 2024, 18:20', description: 'Kargoya verildi', completed: true },
                    { status: 'in-transit', date: '17 Ocak 2024, 08:00', description: 'Yolda', completed: false },
                    { status: 'delivered', date: '', description: 'Teslim edildi', completed: false }
                ],
                items: [
                    { name: 'Yamaha F310 Akustik Gitar', quantity: 1, price: '2.850₺' },
                    { name: 'Gitar Kılıfı', quantity: 1, price: '150₺' }
                ]
            });
        } else {
            setTrackingResult(null);
            alert('Sipariş bulunamadı. Lütfen sipariş numaranızı ve e-posta adresinizi kontrol edin.');
        }

        setIsSearching(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ordered':
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'prepared':
            case 'shipped':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-transit':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ordered': return 'Sipariş Alındı';
            case 'confirmed': return 'Onaylandı';
            case 'prepared': return 'Hazırlandı';
            case 'shipped': return 'Kargoda';
            case 'in-transit': return 'Yolda';
            case 'delivered': return 'Teslim Edildi';
            default: return 'Bilinmiyor';
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Sipariş Takibi</h1>
                            <p className="text-xl text-blue-100">
                                Siparişinizin durumunu kolayca takip edin
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Search Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <Search className="h-8 w-8 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Sipariş Sorgula</h2>
                        </div>

                        <form onSubmit={handleTrackOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Sipariş Numarası *
                                    </label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="orderNumber"
                                            value={orderNumber}
                                            onChange={(e) => setOrderNumber(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Örn: JX123456789"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sipariş numaranızı e-posta onayınızda bulabilirsiniz
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        E-posta Adresi *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sipariş verirken kullandığınız e-posta adresi
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSearching}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                            >
                                {isSearching ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Aranıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        <span>Siparişi Sorgula</span>
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Sample Order Numbers */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Test için örnek sipariş numarası:</h3>
                            <p className="text-blue-700 text-sm">
                                <code className="bg-blue-100 px-2 py-1 rounded">JX123456789</code> -
                                E-posta: herhangi bir e-posta adresi
                            </p>
                        </div>
                    </div>

                    {/* Tracking Results */}
                    {trackingResult && (
                        <div className="space-y-8">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Sipariş Detayları</h3>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                                        {getStatusText(trackingResult.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Sipariş Bilgileri</h4>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="text-gray-600">Sipariş No:</span> {trackingResult.orderNumber}</p>
                                            <p><span className="text-gray-600">Sipariş Tarihi:</span> {trackingResult.orderDate}</p>
                                            <p><span className="text-gray-600">Müşteri:</span> {trackingResult.customerName}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Kargo Bilgileri</h4>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="text-gray-600">Takip Kodu:</span> {trackingResult.trackingCode}</p>
                                            <p><span className="text-gray-600">Mevcut Konum:</span> {trackingResult.currentLocation}</p>
                                            <p><span className="text-gray-600">Tahmini Teslimat:</span> {trackingResult.estimatedDelivery}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Sipariş Özeti</h4>
                                        <div className="space-y-1 text-sm">
                                            {trackingResult.items.map((item: any, index: number) => (
                                                <p key={index}>
                                                    <span className="text-gray-600">{item.quantity}x</span> {item.name} - {item.price}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Durumu</h3>

                                <div className="space-y-4">
                                    {trackingResult.timeline.map((step: any, index: number) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                                                }`}>
                                                {step.completed ? (
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-gray-600" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {step.description}
                                                    </h4>
                                                    {step.date && (
                                                        <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                                                            {step.date}
                                                        </span>
                                                    )}
                                                </div>

                                                {index < trackingResult.timeline.length - 1 && (
                                                    <div className={`w-0.5 h-8 ml-4 mt-2 ${step.completed ? 'bg-green-200' : 'bg-gray-200'
                                                        }`}></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Support Section */}
                            <div className="bg-amber-50 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Yardıma mı ihtiyacınız var?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Phone className="h-5 w-5 text-amber-600" />
                                            <span className="font-semibold">Müşteri Hizmetleri</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            0 850 955 77 77<br />
                                            Pazartesi - Cuma: 09:00 - 18:00
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Mail className="h-5 w-5 text-amber-600" />
                                            <span className="font-semibold">E-posta Desteği</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            destek@jaxophone.com<br />
                                            24 saat içinde yanıt
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 