import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRight,
    Star,
    Award,
    Users,
    Calendar,
    MapPin,
    ChevronRight,
    Globe,
    Heart
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
    id: string;
    name: string;
    slug: string;
    description: string;
    story: string;
    logo: string;
    coverImage: string;
    foundedYear: number;
    country: string;
    productCount: number;
    isPopular: boolean;
    specialty: string[];
    rating: number;
    websiteUrl?: string;
}

export default function BrandsPage() {
    // Featured brands data
    const featuredBrands: Brand[] = [
        {
            id: '1',
            name: 'Fender',
            slug: 'fender',
            description: 'Elektro gitar dünyasının öncüsü. 1946\'dan beri müzik tarihini şekillendiriyor.',
            story: 'Leo Fender tarafından kurulan Fender, Stratocaster ve Telecaster modelleriyle rock müziğin sesini belirledi.',
            logo: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=120&h=120&fit=crop&crop=center',
            coverImage: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&h=400&fit=crop',
            foundedYear: 1946,
            country: 'ABD',
            productCount: 450,
            isPopular: true,
            specialty: ['Elektro Gitar', 'Bass', 'Amplifikatör'],
            rating: 4.9,
            websiteUrl: 'https://fender.com'
        },
        {
            id: '2',
            name: 'Gibson',
            slug: 'gibson',
            description: 'Efsanevi Les Paul ve SG gitarlarının yaratıcısı. Premium kalite ve zanaat.',
            story: 'Orville Gibson\'ın 1902\'de kurduğu marka, rock ve blues efsanelerinin tercihi oldu.',
            logo: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=120&h=120&fit=crop&crop=center',
            coverImage: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&h=400&fit=crop',
            foundedYear: 1902,
            country: 'ABD',
            productCount: 320,
            isPopular: true,
            specialty: ['Elektro Gitar', 'Akustik Gitar'],
            rating: 4.8,
            websiteUrl: 'https://gibson.com'
        },
        {
            id: '3',
            name: 'Yamaha',
            slug: 'yamaha',
            description: 'Güvenilir kalite ve inovasyon. Piyanolardan gitarlara kadar geniş ürün yelpazesi.',
            story: 'Torakusu Yamaha\'nın 1887\'de kurduğu şirket, müzik enstrümanlarında dünya lideri.',
            logo: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=120&h=120&fit=crop&crop=center',
            coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop',
            foundedYear: 1887,
            country: 'Japonya',
            productCount: 680,
            isPopular: true,
            specialty: ['Piyano', 'Gitarlar', 'Nefesli Çalgılar'],
            rating: 4.7,
            websiteUrl: 'https://yamaha.com'
        }
    ];

    const allBrands: Brand[] = [
        ...featuredBrands,
        {
            id: '4',
            name: 'Roland',
            slug: 'roland',
            description: 'Elektronik müzik dünyasının öncüsü. Synthesizer ve dijital piyano uzmanı.',
            story: 'Ikutaro Kakehashi\'nin vizyonu ile kurulan Roland, elektronik müziğin gelişiminde kritik rol oynadı.',
            logo: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=120&h=120&fit=crop&crop=center',
            coverImage: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=600&h=400&fit=crop',
            foundedYear: 1972,
            country: 'Japonya',
            productCount: 280,
            isPopular: false,
            specialty: ['Synthesizer', 'Dijital Piyano', 'Davul Makinesi'],
            rating: 4.6
        },
        {
            id: '5',
            name: 'Pearl',
            slug: 'pearl',
            description: 'Davul dünyasının prestijli markası. Profesyonel davulcuların tercihi.',
            story: 'Katsumi Yanagisawa tarafından 1946\'da kurulan Pearl, davul teknolojisinde devrim yarattı.',
            logo: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=120&h=120&fit=crop&crop=center',
            coverImage: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=600&h=400&fit=crop',
            foundedYear: 1946,
            country: 'Japonya',
            productCount: 195,
            isPopular: false,
            specialty: ['Akustik Davul', 'Elektronik Davul', 'Perküsyon'],
            rating: 4.5
        },
        {
            id: '6',
            name: 'Ibanez',
            slug: 'ibanez',
            description: 'Modern rock ve metal müziğin vazgeçilmezi. İnovatif tasarımlar.',
            story: 'Hoshino Gakki tarafından geliştirilen Ibanez, rock ve metal gitaristlerinin gözdesi.',
            logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop&crop=top',
            coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&crop=top',
            foundedYear: 1957,
            country: 'Japonya',
            productCount: 240,
            isPopular: false,
            specialty: ['Elektro Gitar', 'Bass', 'Akustik Gitar'],
            rating: 4.4
        },
        {
            id: '7',
            name: 'Steinway & Sons',
            slug: 'steinway',
            description: 'Lüks piyano dünyasının zirvesi. 160 yıllık zanaat geleneği.',
            story: 'Heinrich Engelhard Steinweg\'in kurduğu marka, dünya\'nın en prestijli piyanolarını üretiyor.',
            logo: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=120&h=120&fit=crop&crop=bottom',
            coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop&crop=bottom',
            foundedYear: 1853,
            country: 'ABD',
            productCount: 45,
            isPopular: false,
            specialty: ['Grand Piano', 'Upright Piano'],
            rating: 5.0
        },
        {
            id: '8',
            name: 'Korg',
            slug: 'korg',
            description: 'Synthesizer teknolojisinin öncüsü. Yaratıcı müzisyenlerin tercihi.',
            story: 'Tsutomu Katoh ve Tadashi Osanai tarafından kurulan Korg, elektronik müzikte devrim yarattı.',
            logo: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=120&h=120&fit=crop&crop=bottom',
            coverImage: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=600&h=400&fit=crop&crop=bottom',
            foundedYear: 1963,
            country: 'Japonya',
            productCount: 160,
            isPopular: false,
            specialty: ['Synthesizer', 'Workstation', 'Dijital Piyano'],
            rating: 4.3
        }
    ];

    const brandCountries = [...new Set(allBrands.map(brand => brand.country))];
    const totalProducts = allBrands.reduce((sum, brand) => sum + brand.productCount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <main className="overflow-hidden">
                {/* Hero Section */}
                <section className="relative py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center space-y-6">
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 text-sm px-4 py-2">
                                    Prestijli Markalar
                                </Badge>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Dünya
                                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent block">
                                        Markalarını Keşfet
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Müzik tarihini şekillendiren efsanevi markalar ve onların benzersiz hikayelerini keşfedin.
                                    Kalite, inovasyon ve gelenekle buluşun.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">{allBrands.length}</div>
                                    <div className="text-sm text-gray-600">Premium Marka</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">{totalProducts.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Toplam Ürün</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">{brandCountries.length}</div>
                                    <div className="text-sm text-gray-600">Farklı Ülke</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">4.7</div>
                                    <div className="text-sm text-gray-600">Ortalama Puan</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Brands */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Öne Çıkan Markalar
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Müzik dünyasının en prestijli ve sevilen markalarını keşfedin.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 mb-12">
                            {featuredBrands.map((brand) => (
                                <Card key={brand.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                    <Link href={`/brands/${brand.slug}`} className="cursor-pointer">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={brand.coverImage}
                                                    alt={brand.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                                {/* Brand Logo */}
                                                <div className="absolute top-4 left-4">
                                                    <div className="w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                        <Image
                                                            src={brand.logo}
                                                            alt={`${brand.name} logo`}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Popular Badge */}
                                                {brand.isPopular && (
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
                                                            <Heart className="h-3 w-3 mr-1" />
                                                            Popüler
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Brand Info */}
                                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                                    <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                                                    <p className="text-sm opacity-90 mb-3 line-clamp-2">{brand.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="text-xs font-medium">{brand.country}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">
                                                                {brand.productCount} ürün
                                                            </span>
                                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold cursor-pointer"
                                asChild
                            >
                                <a href="#all-brands">
                                    Tüm Markaları Gör
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Brand Stories */}
                <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Marka Hikayeleri
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Her markanın arkasında yıllarca süren tutku, inovasyon ve müziğe olan sevgi var.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                            <div className="space-y-6">
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    1946 - Kuruluş
                                </Badge>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    Fender'ın Devrimci Yolculuğu
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Leo Fender'ın garajında başlayan hikaye, müzik dünyasını sonsuza dek değiştirdi.
                                    Telecaster ve Stratocaster ile rock'n'roll'ün sesini yaratan Fender,
                                    günümüzde hala yenilikçi yaklaşımını sürdürüyor.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">4.9/5</span>
                                    </div>
                                    <span className="text-sm text-gray-600">450+ ürün</span>
                                </div>
                                <Button
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer"
                                    asChild
                                >
                                    <a href="/brands/fender">
                                        Fender Ürünlerini Keşfet
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src={featuredBrands[0].coverImage}
                                        alt="Fender brand story"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                {/* Floating achievement cards */}
                                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-amber-600">75+</div>
                                        <div className="text-sm text-gray-600">Yıllık Deneyim</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* All Brands */}
                <section id="all-brands" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Tüm Markalarımız
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Geniş marka portföyümüzden size en uygun olanı bulun.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allBrands.map((brand) => (
                                <Card key={brand.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                                    <Link href={`/brands/${brand.slug}`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={brand.logo}
                                                        alt={`${brand.name} logo`}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-gray-900 truncate">{brand.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{brand.country}</span>
                                                        <span>•</span>
                                                        <span>{brand.foundedYear}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                                {brand.description}
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {brand.specialty.slice(0, 2).map((spec) => (
                                                        <Badge key={spec} variant="secondary" className="text-xs">
                                                            {spec}
                                                        </Badge>
                                                    ))}
                                                    {brand.specialty.length > 2 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{brand.specialty.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-sm font-medium">{brand.rating}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {brand.productCount} ürün
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t">
                                                    <span className="text-sm font-medium text-amber-600">
                                                        Ürünleri Gör
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Favori Markanızı Bulamadınız mı?
                            </h2>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Aradığınız marka veya ürün için bizimle iletişime geçin.
                                Geniş tedarikçi ağımız sayesinde istediğiniz markaları sizin için bulabiliriz.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                    asChild
                                >
                                    <a href="/contact">
                                        Marka Talebi
                                    </a>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                                    asChild
                                >
                                    <a href="/catalog">
                                        Katalog İndir
                                    </a>
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

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Popüler Markalar</h4>
                            <div className="space-y-2">
                                {featuredBrands.map((brand) => (
                                    <a
                                        key={brand.id}
                                        href={`/brands/${brand.slug}`}
                                        className="block text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {brand.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Hızlı Linkler</h4>
                            <div className="space-y-2">
                                <a href="/products" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Tüm Ürünler
                                </a>
                                <a href="/categories" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Kategoriler
                                </a>
                                <a href="/about" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Hakkımızda
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">İletişim</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📞 0212 555 0123</p>
                                <p>✉️ info@jaxophone.com</p>
                                <p>📍 Müzik Sokak No:1 Beyoğlu/İstanbul</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Jaxophone Music Shop. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 