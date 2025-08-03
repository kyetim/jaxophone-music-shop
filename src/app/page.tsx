'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/interfaces/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCardSkeleton, CardSkeleton } from '@/components/ui/loading';
import { ArrowRight, Star, Truck, Shield, Headphones, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Slider data
const sliderData = [
  {
    id: 1,
    type: 'campaign',
    title: 'Kış Festivali Başladı!',
    subtitle: 'Tüm Enstrümanlarda %40\'a Varan İndirim',
    description: 'Gitarlar, davullar, piyanolar ve daha fazlası. Stoklar tükenmeden kaçırma!',
    buttonText: 'Kampanyayı Gör',
    buttonLink: '/campaigns/winter-festival',
    backgroundImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    backgroundColor: 'from-red-600 to-pink-600',
    badge: '🔥 HOT DEAL'
  },
  {
    id: 2,
    type: 'product',
    title: 'Yeni Fender Player Serisi',
    subtitle: 'Efsanevi Tonlar, Modern Özellikler',
    description: 'Klasik Fender sesini modern teknoloji ile buluşturan Player serisini keşfet.',
    buttonText: 'İncele',
    buttonLink: '/products/fender-player-series',
    backgroundImage: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=1200&h=400&fit=crop',
    backgroundColor: 'from-amber-600 to-orange-600',
    badge: '✨ YENİ'
  },
  {
    id: 3,
    type: 'service',
    title: 'Uzaktan Müzik Dersleri',
    subtitle: 'Profesyonel Eğitmenlerle Online Eğitim',
    description: 'Evinden çıkmadan uzman eğitmenlerimizle birebir ders al. İlk ders ücretsiz!',
    buttonText: 'Kayıt Ol',
    buttonLink: '/lessons',
    backgroundImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&h=400&fit=crop',
    backgroundColor: 'from-blue-600 to-purple-600',
    badge: '🎓 EĞİTİM'
  },
  {
    id: 4,
    type: 'campaign',
    title: 'Öğrenci Kampanyası',
    subtitle: 'Öğrencilere Özel %25 İndirim',
    description: 'Öğrenci belgeni ibraz et, tüm enstrümanlarda indirim kazan!',
    buttonText: 'Detaylar',
    buttonLink: '/student-discount',
    backgroundImage: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=1200&h=400&fit=crop',
    backgroundColor: 'from-green-600 to-emerald-600',
    badge: '🎒 ÖĞRENCİ'
  }
];

// Örnek ürünler - Unsplash görsellerle
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Yamaha YAS-280 Alto Saksafon',
    description: 'Başlangıç seviyesi için ideal alto saksafon',
    price: 15999,
    originalPrice: 17999,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    category: 'Üflemeli Çalgılar',
    brand: 'Yamaha',
    inStock: true,
    stockQuantity: 5,
    rating: 4.8,
    reviewCount: 124,
    tags: ['saksafon', 'alto', 'başlangıç']
  },
  {
    id: '2',
    name: 'Fender Player Stratocaster',
    description: 'Klasik elektro gitar sesi',
    price: 23999,
    imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400',
    category: 'Gitarlar',
    brand: 'Fender',
    inStock: true,
    stockQuantity: 3,
    rating: 4.9,
    reviewCount: 89,
    tags: ['elektro gitar', 'stratocaster']
  },
  {
    id: '3',
    name: 'Pearl Export Davul Seti',
    description: 'Profesyonel davul seti',
    price: 12999,
    originalPrice: 14999,
    imageUrl: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=400',
    category: 'Vurmalı Çalgılar',
    brand: 'Pearl',
    inStock: false,
    stockQuantity: 0,
    rating: 4.7,
    reviewCount: 56,
    tags: ['davul', 'set', 'akustik']
  },
  {
    id: '4',
    name: 'Korg B2 Dijital Piyano',
    description: '88 tuşlu ağırlıklı klavye',
    price: 8999,
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
    category: 'Klavyeli Çalgılar',
    brand: 'Korg',
    inStock: true,
    stockQuantity: 8,
    rating: 4.6,
    reviewCount: 203,
    tags: ['piyano', 'dijital', 'klavye']
  }
];

const features = [
  {
    icon: Truck,
    title: 'Ücretsiz Kargo',
    description: '500₺ üzeri alışverişlerde ücretsiz kargo'
  },
  {
    icon: Shield,
    title: 'Güvenli Alışveriş',
    description: '256-bit SSL şifreleme ile güvenli ödeme'
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda'
  },
  {
    icon: Award,
    title: 'Kalite Garantisi',
    description: 'Tüm ürünlerde 2 yıl garanti'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Slider */}
      <section className="relative overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="relative h-full">
                <Image
                  src={slide.backgroundImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-2xl">
                      <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        {slide.badge}
                      </Badge>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-xl md:text-2xl font-semibold text-amber-300 mb-4">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {slide.buttonText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {sliderData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Neden Jaxophone?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Türkiye'nin en büyük müzik enstrümanı mağazası olarak size en iyi hizmeti sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ücretsiz Kargo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                500 TL üzeri alışverişlerde ücretsiz kargo
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Güvenli Alışveriş
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                256-bit SSL sertifikası ile güvenli ödeme
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Uzman Desteği
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Müzik uzmanlarımızdan ücretsiz danışmanlık
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Kalite Garantisi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tüm ürünlerimiz orijinal ve garantili
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                En popüler ve çok satan ürünlerimizi keşfedin
              </p>
            </div>
            <Button
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:border-amber-400 dark:text-amber-400"
            >
              Tümünü Gör
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kategoriler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              İhtiyacınız olan enstrümanı bulun
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Gitarlar', icon: '🎸', color: 'from-red-500 to-pink-500' },
              { name: 'Piyanolar', icon: '🎹', color: 'from-blue-500 to-purple-500' },
              { name: 'Davullar', icon: '🥁', color: 'from-amber-500 to-orange-500' },
              { name: 'Üflemeli', icon: '🎷', color: 'from-green-500 to-emerald-500' },
              { name: 'Yaylılar', icon: '🎻', color: 'from-purple-500 to-pink-500' },
              { name: 'Aksesuarlar', icon: '🎧', color: 'from-gray-500 to-gray-600' },
            ].map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${category.color} p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-white font-semibold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Kampanyalardan Haberdar Olun
          </h2>
          <p className="text-amber-100 mb-8 text-lg">
            E-posta listemize katılın ve özel indirimlerden ilk siz haberdar olun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
            />
            <Button className="bg-white text-amber-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg">
              Abone Ol
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
