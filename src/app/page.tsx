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

  // Slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Sayfa loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Daha kısa ve doğal

    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen">
      <Header />

      {/* Promotional Slider */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderData.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.backgroundImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.backgroundColor} opacity-80`}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                  <div className="max-w-3xl text-white">
                    {/* Badge */}
                    <Badge className="bg-white/20 backdrop-blur text-white border-white/30 mb-4 px-4 py-2">
                      {slide.badge}
                    </Badge>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h2>

                    {/* Subtitle */}
                    <h3 className="text-xl lg:text-2xl font-medium mb-4 text-white/90">
                      {slide.subtitle}
                    </h3>

                    {/* Description */}
                    <p className="text-lg lg:text-xl mb-8 text-white/80 max-w-2xl">
                      {slide.description}
                    </p>

                    {/* Button */}
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      asChild
                    >
                      <a href={slide.buttonLink}>
                        {slide.buttonText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-all duration-200 cursor-pointer"
          aria-label="Önceki slayt"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-all duration-200 cursor-pointer"
          aria-label="Sonraki slayt"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Slayt ${index + 1}'e git`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / sliderData.length) * 100}%`
            }}
          />
        </div>
      </section>

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzkyNDAwRCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-2">
                    🎵 Türkiye'nin En Büyük Müzik Mağazası
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 bg-clip-text text-transparent leading-tight">
                    Müziğin Kalbi Burada Atıyor
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    En kaliteli müzik aletleri, profesyonel ekipmanlar ve uzman danışmanlık hizmeti ile müzik yolculuğunuzda yanınızdayız.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Ürünleri Keşfet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-xl">
                    Mağazalarımız
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">5.0 (2,847 değerlendirme)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-bold text-amber-700">50,000+</span> Mutlu Müzisyen
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600"
                    alt="Müzik Aletleri"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Canlı Destek</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">24h</div>
                    <div className="text-sm text-muted-foreground">Hızlı Teslimat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-4">
                ⭐ Öne Çıkan Ürünler
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                En Çok Tercih Edilen Müzik Aletleri
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profesyonel müzisyenler ve başlangıç seviyesi için özenle seçilmiş kaliteli ürünler
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : (
                sampleProducts.map((product, index) => (
                  <div key={product.id} className="transform hover:-translate-y-2 transition-all duration-300">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold cursor-pointer">
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <CardSkeleton key={i} className="aspect-square" />
                ))
              ) : (
                [
                  { name: 'Gitarlar', icon: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=center', count: '250+', image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300' },
                  { name: 'Piyanolar', icon: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=80&h=80&fit=crop&crop=center', count: '180+', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300' },
                  { name: 'Davullar', icon: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=80&h=80&fit=crop&crop=center', count: '120+', image: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=300' },
                  { name: 'Keman', icon: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=80&h=80&fit=crop&crop=center', count: '95+', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=300' }
                ].map((category, index) => (
                  <div key={category.name} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="aspect-square relative">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                            <Image
                              src={category.icon}
                              alt={`${category.name} icon`}
                              width={32}
                              height={32}
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h3 className="font-bold text-lg">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.count} ürün</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Özel Fırsatları Kaçırma!
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Yeni ürünler, indirimler ve müzik etkinlikleri hakkında ilk sen haberdar ol
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <Button className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold cursor-pointer">
                  Abone Ol
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Jaxophone
              </div>
              <p className="text-gray-400">
                Müziğin tutkusunu yaşatan Türkiye&apos;nin en büyük enstrüman mağazası.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kategoriler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Gitarlar</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Davullar</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Piyanolar</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Üflemeli Çalgılar</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hizmetler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Müzik Dersleri</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Enstrüman Tamiri</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Rental</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Uzman Danışmanlık</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 0212 555 0123</li>
                <li>📧 info@jaxophone.com</li>
                <li>📍 İstanbul, Beyoğlu</li>
                <li>🕒 Pzt-Cmt 09:00-22:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jaxophone Music Shop. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
