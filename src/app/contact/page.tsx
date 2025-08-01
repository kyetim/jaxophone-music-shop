'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Loader } from '@googlemaps/js-api-loader';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);

    // Google Maps API Key - Gerçek projede environment variable kullanın
    const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Buraya gerçek API key'inizi ekleyin

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setIsSubmitting(false);
    };

    // Google Maps initialization
    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) return;

            try {
                const loader = new Loader({
                    apiKey: GOOGLE_MAPS_API_KEY,
                    version: 'weekly',
                    libraries: ['places']
                });

                const google = await loader.load();

                // Jaxophone mağazasının koordinatları (İstanbul, Maslak)
                const jaxophoneLocation = { lat: 41.1124, lng: 29.0208 };

                const map = new google.maps.Map(mapRef.current, {
                    center: jaxophoneLocation,
                    zoom: 15,
                    styles: [
                        {
                            featureType: 'poi.business',
                            stylers: [{ visibility: 'off' }]
                        },
                        {
                            featureType: 'transit',
                            elementType: 'labels.icon',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                });

                // Mağaza marker'ı ekle
                const marker = new google.maps.Marker({
                    position: jaxophoneLocation,
                    map: map,
                    title: 'Jaxophone Müzik Mağazası',
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#F59E0B"/>
                                <path d="M20 8L24 16H16L20 8Z" fill="white"/>
                                <circle cx="20" cy="20" r="8" fill="white"/>
                                <circle cx="20" cy="20" r="4" fill="#F59E0B"/>
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(40, 40),
                        anchor: new google.maps.Point(20, 40)
                    }
                });

                // Info window ekle
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; max-width: 200px;">
                            <h3 style="margin: 0 0 5px 0; color: #F59E0B; font-weight: bold;">Jaxophone</h3>
                            <p style="margin: 0; font-size: 14px;">Müzik Mağazası</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                                Maslak Mahallesi, Büyükdere Caddesi<br>
                                No: 123, Sarıyer/İstanbul
                            </p>
                        </div>
                    `
                });

                // Marker'a tıklandığında info window'u göster
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                // Map instance'ını ref'e kaydet
                mapInstanceRef.current = map;
                setMapLoaded(true);

            } catch (error) {
                console.error('Google Maps yüklenirken hata:', error);
                setMapError('Harita yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
            }
        };

        // API key varsa map'i yükle
        if (GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
            initMap();
        } else {
            setMapError('Google Maps API anahtarı gerekli. Lütfen API anahtarınızı ekleyin.');
        }
    }, []);

    // API isteği örneği - Form gönderimi
    const submitFormWithAPI = async (formData: any) => {
        try {
            // API endpoint'i (örnek)
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('API isteği hatası:', error);
            throw error;
        }
    };

    // Weather API örneği - Hava durumu bilgisi
    const getWeatherInfo = async () => {
        try {
            // OpenWeatherMap API örneği (ücretsiz)
            const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Gerçek API key gerekli
            const city = 'Istanbul';

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
            );

            if (!response.ok) {
                throw new Error(`Weather API error! status: ${response.status}`);
            }

            const weatherData = await response.json();
            return weatherData;

        } catch (error) {
            console.error('Hava durumu API hatası:', error);
            return null;
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">İletişim</h1>
                            <p className="text-xl text-amber-100">
                                Size nasıl yardımcı olabiliriz? Bizimle iletişime geçin!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Adres</h3>
                                            <p className="text-gray-600 mt-1">
                                                Maslak Mahallesi, Büyükdere Caddesi<br />
                                                No: 123, Sarıyer/İstanbul
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Telefon</h3>
                                            <p className="text-gray-600 mt-1">
                                                <a href="tel:08509557777" className="hover:text-amber-600 transition-colors">
                                                    0 850 955 77 77
                                                </a>
                                            </p>
                                            <p className="text-gray-600">
                                                <a href="tel:+902123456789" className="hover:text-amber-600 transition-colors">
                                                    +90 212 345 67 89
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">E-posta</h3>
                                            <p className="text-gray-600 mt-1">
                                                <a href="mailto:info@jaxophone.com" className="hover:text-amber-600 transition-colors">
                                                    info@jaxophone.com
                                                </a>
                                            </p>
                                            <p className="text-gray-600">
                                                <a href="mailto:destek@jaxophone.com" className="hover:text-amber-600 transition-colors">
                                                    destek@jaxophone.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                                            <div className="text-gray-600 mt-1 space-y-1">
                                                <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                                                <p>Cumartesi: 10:00 - 17:00</p>
                                                <p>Pazar: 12:00 - 17:00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                                    <div className="flex space-x-4">
                                        <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                            <span className="text-sm font-bold">f</span>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                                            <span className="text-sm font-bold">t</span>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                                            <span className="text-sm font-bold">ig</span>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                            <span className="text-sm font-bold">yt</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <MessageSquare className="h-8 w-8 text-amber-600" />
                                    <h2 className="text-2xl font-bold text-gray-900">Bize Yazın</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ad Soyad *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    placeholder="Adınız ve soyadınız"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                E-posta *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    placeholder="ornek@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefon
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                    placeholder="0555 123 45 67"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Konu *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            >
                                                <option value="">Konu seçin</option>
                                                <option value="product-inquiry">Ürün Sorgusu</option>
                                                <option value="technical-support">Teknik Destek</option>
                                                <option value="order-status">Sipariş Durumu</option>
                                                <option value="return-exchange">İade & Değişim</option>
                                                <option value="partnership">İş Ortaklığı</option>
                                                <option value="other">Diğer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mesajınız *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                            placeholder="Mesajınızı buraya yazın..."
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Gönderiliyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                <span>Mesajı Gönder</span>
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="mt-12">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Konumumuz</h2>

                            {mapError ? (
                                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-2">{mapError}</p>
                                        <p className="text-sm text-gray-500">
                                            Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-96 rounded-lg"
                                        style={{ minHeight: '400px' }}
                                    />
                                    {!mapLoaded && (
                                        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                                                <p className="text-gray-600">Harita yükleniyor...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* API Kullanım Örnekleri */}
                            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">🔧 API Kullanım Örnekleri</h3>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-2">1. Form Gönderimi API'si:</h4>
                                        <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                                            {`// POST /api/contact
const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-2">2. Hava Durumu API'si:</h4>
                                        <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                                            {`// OpenWeatherMap API
const response = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=\${API_KEY}&units=metric&lang=tr\`
);`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-2">3. Google Maps API:</h4>
                                        <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
                                            {`// Google Maps JavaScript API
const loader = new Loader({
    apiKey: 'YOUR_API_KEY',
    version: 'weekly',
    libraries: ['places']
});`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 