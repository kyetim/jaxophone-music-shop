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
    const GOOGLE_MAPS_API_KEY = 'AIzaSyA0xOAw5mV9_Z10jpZjmj6mWQEo-GZrH5I'; // Buraya gerçek API key'inizi ekleyin

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

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                alert(`Hata: ${result.error || 'Mesaj gönderilirken bir hata oluştu.'}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google Maps initialization
    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) {
                console.log('Map ref not found');
                return;
            }

            console.log('Initializing Google Maps...');
            console.log('API Key:', GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');

            try {
                const loader = new Loader({
                    apiKey: GOOGLE_MAPS_API_KEY,
                    version: 'weekly',
                    libraries: ['places']
                });

                console.log('Loading Google Maps API...');
                const google = await loader.load();
                console.log('Google Maps API loaded successfully');

                // Jaxophone mağazasının koordinatları (Mersin, Yenişehir)
                const jaxophoneLocation = { lat: 36.8121, lng: 34.6415 };
                console.log('Creating map with location:', jaxophoneLocation);

                const map = new google.maps.Map(mapRef.current, {
                    center: jaxophoneLocation,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
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

                console.log('Map created successfully');

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

                console.log('Marker added successfully');

                // Info window ekle
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; max-width: 200px;">
                            <h3 style="margin: 0 0 5px 0; color: #F59E0B; font-weight: bold;">Jaxophone</h3>
                            <p style="margin: 0; font-size: 14px;">Müzik Mağazası</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                                Mersin/Yenişehir Mahallesi, Yenişehir Caddesi<br>
                                No: 456, Mersin/Türkiye
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
                console.log('Map initialization completed successfully');

            } catch (error) {
                console.error('Google Maps yüklenirken hata:', error);
                setMapError(`Harita yüklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
            }
        };

        // API key varsa map'i yükle
        if (GOOGLE_MAPS_API_KEY) {
            console.log('Starting map initialization...');
            initMap();
        } else {
            console.log('API key missing or invalid');
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

    return (
        <>
            <Header />
            <div className="min-h-screen bg-black dark:bg-black">
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
                            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
                                <h2 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Adres</h3>
                                            <p className="text-gray-300 mt-1">
                                                Mersin/Yenişehir Mahallesi, Yenişehir Caddesi<br />
                                                No: 456, Mersin/Türkiye
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Telefon</h3>
                                            <p className="text-gray-300 mt-1">
                                                <a href="tel:08509557777" className="hover:text-amber-400 transition-colors">
                                                    0 850 955 77 77
                                                </a>
                                            </p>
                                            <p className="text-gray-300">
                                                <a href="tel:+902123456789" className="hover:text-amber-400 transition-colors">
                                                    +90 212 345 67 89
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">E-posta</h3>
                                            <p className="text-gray-300 mt-1">
                                                <a href="mailto:info@jaxophone.com" className="hover:text-amber-400 transition-colors">
                                                    info@jaxophone.com
                                                </a>
                                            </p>
                                            <p className="text-gray-300">
                                                <a href="mailto:destek@jaxophone.com" className="hover:text-amber-400 transition-colors">
                                                    destek@jaxophone.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-6 w-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Çalışma Saatleri</h3>
                                            <div className="text-gray-300 mt-1 space-y-1">
                                                <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                                                <p>Cumartesi: 10:00 - 17:00</p>
                                                <p>Pazar: 12:00 - 17:00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="mt-8 pt-8 border-t border-gray-700">
                                    <h3 className="font-semibold text-white mb-4">Sosyal Medya</h3>
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
                            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
                                <div className="flex items-center space-x-3 mb-6">
                                    <MessageSquare className="h-8 w-8 text-amber-400" />
                                    <h2 className="text-2xl font-bold text-white">Bize Yazın</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
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
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                                    placeholder="Adınız ve soyadınız"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                                    placeholder="ornek@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
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
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                                    placeholder="0555 123 45 67"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                                Konu *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white"
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
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                            Mesajınız *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400 resize-none"
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
                        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Konumumuz</h2>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    Haritayı Yenile
                                </button>
                            </div>

                            {mapError ? (
                                <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                                    <div className="text-center">
                                        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-300 mb-2 font-medium">Harita Yüklenemedi</p>
                                        <p className="text-sm text-gray-400 mb-4">{mapError}</p>
                                        <div className="space-y-2 text-xs text-gray-400">
                                            <p>• Google Maps API anahtarınızın doğru olduğundan emin olun</p>
                                            <p>• Google Cloud Console'da Maps JavaScript API'nin etkin olduğunu kontrol edin</p>
                                            <p>• Billing hesabınızın etkin olduğunu kontrol edin</p>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-4">
                                            Mersin/Yenişehir Mahallesi, Yenişehir Caddesi No: 456, Mersin/Türkiye
                                        </p>

                                        {/* OpenStreetMap Fallback */}
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-400 mb-2">Alternatif harita:</p>
                                            <iframe
                                                src="https://www.openstreetmap.org/export/embed.html?bbox=34.6315,36.8021,34.6515,36.8221&layer=mapnik&marker=36.8121,34.6415"
                                                width="100%"
                                                height="300"
                                                frameBorder="0"
                                                scrolling="no"
                                                marginHeight={0}
                                                marginWidth={0}
                                                title="Jaxophone Konumu"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-96 rounded-lg border-2 border-gray-700"
                                        style={{ minHeight: '400px' }}
                                    />
                                    {!mapLoaded && (
                                        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
                                                <p className="text-gray-300">Harita yükleniyor...</p>
                                                <p className="text-xs text-gray-400 mt-1">Bu işlem birkaç saniye sürebilir</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 