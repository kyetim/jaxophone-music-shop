'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Package,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    Truck,
    FileText,
    Mail,
    Phone
} from 'lucide-react';

export default function ReturnsPage() {
    const [formData, setFormData] = useState({
        orderNumber: '',
        customerName: '',
        email: '',
        phone: '',
        productName: '',
        reason: '',
        description: '',
        returnType: 'return' // 'return' or 'exchange'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.customerName,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `${formData.returnType === 'return' ? 'İade' : 'Değişim'} Talebi - Sipariş #${formData.orderNumber}`,
                    message: `
İADE/DEĞİŞİM TALEBİ

Sipariş Numarası: ${formData.orderNumber}
Müşteri Adı: ${formData.customerName}
E-posta: ${formData.email}
Telefon: ${formData.phone}

Ürün Adı: ${formData.productName}
Talep Türü: ${formData.returnType === 'return' ? 'İade' : 'Değişim'}
Sebep: ${formData.reason}

Açıklama:
${formData.description}

Bu talep Jaxophone web sitesi üzerinden gönderilmiştir.
                    `.trim()
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({
                    orderNumber: '',
                    customerName: '',
                    email: '',
                    phone: '',
                    productName: '',
                    reason: '',
                    description: '',
                    returnType: 'return'
                });
            } else {
                throw new Error('Form gönderilemedi');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Talebiniz Alındı!
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            İade/değişim talebiniz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="h-5 w-5 text-amber-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    E-posta ile bilgilendirme alacaksınız
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    24 saat içinde yanıt verilecek
                                </span>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                        >
                            Yeni Talep Oluştur
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        İade & Değişim
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Memnun kalmadığınız ürünler için iade veya değişim talebinde bulunabilirsiniz.
                        Talebiniz 24 saat içinde değerlendirilecektir.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Package className="h-5 w-5 text-amber-600" />
                                    İade/Değişim Talebi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Return Type Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-gray-700 dark:text-gray-300">Talep Türü</Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="returnType"
                                                    value="return"
                                                    checked={formData.returnType === 'return'}
                                                    onChange={(e) => handleInputChange('returnType', e.target.value)}
                                                    className="text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="text-gray-700 dark:text-gray-300">İade</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="returnType"
                                                    value="exchange"
                                                    checked={formData.returnType === 'exchange'}
                                                    onChange={(e) => handleInputChange('returnType', e.target.value)}
                                                    className="text-amber-600 focus:ring-amber-500"
                                                />
                                                <span className="text-gray-700 dark:text-gray-300">Değişim</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Order Information */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="orderNumber" className="text-gray-700 dark:text-gray-300">
                                                Sipariş Numarası *
                                            </Label>
                                            <Input
                                                id="orderNumber"
                                                value={formData.orderNumber}
                                                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                                                placeholder="Örn: JAX-2024-001"
                                                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="productName" className="text-gray-700 dark:text-gray-300">
                                                Ürün Adı *
                                            </Label>
                                            <Input
                                                id="productName"
                                                value={formData.productName}
                                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                                placeholder="Ürün adını girin"
                                                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="customerName" className="text-gray-700 dark:text-gray-300">
                                                Ad Soyad *
                                            </Label>
                                            <Input
                                                id="customerName"
                                                value={formData.customerName}
                                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                                placeholder="Adınız ve soyadınız"
                                                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                                E-posta *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="ornek@email.com"
                                                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                                            Telefon *
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="0555 123 45 67"
                                            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <Label htmlFor="reason" className="text-gray-700 dark:text-gray-300">
                                            İade/Değişim Sebebi *
                                        </Label>
                                        <select
                                            id="reason"
                                            value={formData.reason}
                                            onChange={(e) => handleInputChange('reason', e.target.value)}
                                            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="">Sebep seçin</option>
                                            <option value="Ürün hasarlı geldi">Ürün hasarlı geldi</option>
                                            <option value="Yanlış ürün gönderildi">Yanlış ürün gönderildi</option>
                                            <option value="Ürün beklentileri karşılamıyor">Ürün beklentileri karşılamıyor</option>
                                            <option value="Boyut/renk uyumsuzluğu">Boyut/renk uyumsuzluğu</option>
                                            <option value="Teknik sorun">Teknik sorun</option>
                                            <option value="Diğer">Diğer</option>
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                            Detaylı Açıklama *
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Sorunu detaylı bir şekilde açıklayın..."
                                            rows={4}
                                            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Gönderiliyor...
                                            </div>
                                        ) : (
                                            <>
                                                <Package className="h-4 w-4 mr-2" />
                                                Talep Gönder
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Return Policy */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                    İade Koşulları
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">14 Gün İçinde</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Ürün tesliminden itibaren 14 gün içinde iade talebinde bulunabilirsiniz
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Orijinal Paket</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Ürün orijinal paketinde ve kullanılmamış olmalıdır
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Ücretsiz Kargo</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            İade kargo ücreti firmamız tarafından karşılanır
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Phone className="h-5 w-5 text-amber-600" />
                                    İletişim
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">0850 955 77 77</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">info@jaxophone.com</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Pazartesi - Cumartesi: 09:00 - 18:00
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Process Steps */}
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-gray-900 dark:text-white">Süreç</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Talep gönderin</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">24 saat içinde yanıt</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Kargo etiketi</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">İade/değişim tamamlanır</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 