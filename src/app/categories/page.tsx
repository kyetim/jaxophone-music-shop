import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Music,
    ArrowRight,
    Grid,
    TrendingUp,
    Star,
    Package,
    ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/interfaces/category';

export default function CategoriesPage() {
    // Sample categories data
    const mainCategories: Category[] = [
        {
            id: '1',
            name: 'Gitarlar',
            slug: 'gitarlar',
            description: 'Elektro, akustik, bas ve klasik gitarlar. Başlangıçtan profesyonele kadar her seviye için.',
            image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 1250,
            isActive: true,
            sortOrder: 1,
            children: [
                { id: '1-1', name: 'Elektro Gitar', slug: 'elektro-gitar', description: '', image: '', icon: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=60&h=60&fit=crop', parentId: '1', level: 1, productCount: 450, isActive: true, sortOrder: 1 },
                { id: '1-2', name: 'Akustik Gitar', slug: 'akustik-gitar', description: '', image: '', icon: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=60&h=60&fit=crop', parentId: '1', level: 1, productCount: 380, isActive: true, sortOrder: 2 },
                { id: '1-3', name: 'Bas Gitar', slug: 'bas-gitar', description: '', image: '', icon: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=top', parentId: '1', level: 1, productCount: 220, isActive: true, sortOrder: 3 },
                { id: '1-4', name: 'Klasik Gitar', slug: 'klasik-gitar', description: '', image: '', icon: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=60&h=60&fit=crop', parentId: '1', level: 1, productCount: 200, isActive: true, sortOrder: 4 }
            ]
        },
        {
            id: '2',
            name: 'Klavyeler',
            slug: 'klavyeler',
            description: 'Piyano, elektronik organ, synthesizer ve MIDI klavyeler. Ev, stüdyo ve sahne kullanımı.',
            image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 890,
            isActive: true,
            sortOrder: 2,
            children: [
                { id: '2-1', name: 'Dijital Piyano', slug: 'dijital-piyano', description: '', image: '', icon: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=60&h=60&fit=crop', parentId: '2', level: 1, productCount: 320, isActive: true, sortOrder: 1 },
                { id: '2-2', name: 'Synthesizer', slug: 'synthesizer', description: '', image: '', icon: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=bottom', parentId: '2', level: 1, productCount: 280, isActive: true, sortOrder: 2 },
                { id: '2-3', name: 'MIDI Klavye', slug: 'midi-klavye', description: '', image: '', icon: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=60&h=60&fit=crop', parentId: '2', level: 1, productCount: 290, isActive: true, sortOrder: 3 }
            ]
        },
        {
            id: '3',
            name: 'Davullar',
            slug: 'davullar',
            description: 'Akustik davul setleri, elektronik davullar ve perküsyon enstrümanları.',
            image: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 675,
            isActive: true,
            sortOrder: 3,
            children: [
                { id: '3-1', name: 'Akustik Davul', slug: 'akustik-davul', description: '', image: '', icon: 'https://images.unsplash.com/photo-1571327073757-af4cf893f3e6?w=60&h=60&fit=crop', parentId: '3', level: 1, productCount: 280, isActive: true, sortOrder: 1 },
                { id: '3-2', name: 'Elektronik Davul', slug: 'elektronik-davul', description: '', image: '', icon: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop&crop=left', parentId: '3', level: 1, productCount: 195, isActive: true, sortOrder: 2 },
                { id: '3-3', name: 'Perküsyon', slug: 'perkusyon', description: '', image: '', icon: 'https://images.unsplash.com/photo-1601983073913-2e6c90ad75c8?w=60&h=60&fit=crop', parentId: '3', level: 1, productCount: 200, isActive: true, sortOrder: 3 }
            ]
        },
        {
            id: '4',
            name: 'Nefesli Enstrümanlar',
            slug: 'nefesli-enstrumanlar',
            description: 'Saksafon, trompet, flüt, klarnet ve diğer nefesli enstrümanlar.',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 420,
            isActive: true,
            sortOrder: 4,
            children: [
                { id: '4-1', name: 'Saksafon', slug: 'saksafon', description: '', image: '', icon: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=60&h=60&fit=crop', parentId: '4', level: 1, productCount: 125, isActive: true, sortOrder: 1 },
                { id: '4-2', name: 'Trompet', slug: 'trompet', description: '', image: '', icon: 'https://images.unsplash.com/photo-1574890820845-64d35901b6b7?w=60&h=60&fit=crop', parentId: '4', level: 1, productCount: 95, isActive: true, sortOrder: 2 },
                { id: '4-3', name: 'Flüt', slug: 'flut', description: '', image: '', icon: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=60&h=60&fit=crop', parentId: '4', level: 1, productCount: 80, isActive: true, sortOrder: 3 },
                { id: '4-4', name: 'Klarnet', slug: 'klarnet', description: '', image: '', icon: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=60&h=60&fit=crop', parentId: '4', level: 1, productCount: 120, isActive: true, sortOrder: 4 }
            ]
        },
        {
            id: '5',
            name: 'Yaylı Enstrümanlar',
            slug: 'yayli-enstrumanlar',
            description: 'Keman, viyola, çello ve kontrbas. Klasik müzikten moderne kadar.',
            image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 380,
            isActive: true,
            sortOrder: 5,
            children: [
                { id: '5-1', name: 'Keman', slug: 'keman', description: '', image: '', icon: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=60&h=60&fit=crop', parentId: '5', level: 1, productCount: 180, isActive: true, sortOrder: 1 },
                { id: '5-2', name: 'Viyola', slug: 'viyola', description: '', image: '', icon: 'https://images.unsplash.com/photo-1574535368522-0fba0cb32b45?w=60&h=60&fit=crop&crop=center', parentId: '5', level: 1, productCount: 85, isActive: true, sortOrder: 2 },
                { id: '5-3', name: 'Çello', slug: 'cello', description: '', image: '', icon: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=60&h=60&fit=crop', parentId: '5', level: 1, productCount: 75, isActive: true, sortOrder: 3 },
                { id: '5-4', name: 'Kontrbas', slug: 'kontrbas', description: '', image: '', icon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop', parentId: '5', level: 1, productCount: 40, isActive: true, sortOrder: 4 }
            ]
        },
        {
            id: '6',
            name: 'Ses Sistemleri',
            slug: 'ses-sistemleri',
            description: 'Amplifikatörler, hoparlörler, mikrofon ve ses kayıt ekipmanları.',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            icon: 'https://images.unsplash.com/photo-1574890820845-64d35901b6b7?w=80&h=80&fit=crop&crop=center',
            level: 0,
            productCount: 950,
            isActive: true,
            sortOrder: 6,
            children: [
                { id: '6-1', name: 'Amplifikatör', slug: 'amplifikator', description: '', image: '', icon: 'https://images.unsplash.com/photo-1574890820845-64d35901b6b7?w=60&h=60&fit=crop', parentId: '6', level: 1, productCount: 380, isActive: true, sortOrder: 1 },
                { id: '6-2', name: 'Mikrofon', slug: 'mikrofon', description: '', image: '', icon: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=60&h=60&fit=crop&crop=center', parentId: '6', level: 1, productCount: 290, isActive: true, sortOrder: 2 },
                { id: '6-3', name: 'Hoparlör', slug: 'hoparlorr', description: '', image: '', icon: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=60&h=60&fit=crop&crop=center', parentId: '6', level: 1, productCount: 280, isActive: true, sortOrder: 3 }
            ]
        }
    ];

    const popularCategories = mainCategories.slice(0, 3);
    const totalProducts = mainCategories.reduce((sum, cat) => sum + cat.productCount, 0);

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
                                    Tüm Kategoriler
                                </Badge>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Müzik
                                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent block">
                                        Kategorileri
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Aradığınız enstrümanı kolayca bulun. Başlangıçtan profesyonele kadar
                                    her seviye için düzenlenmiş kategorilerimizi keşfedin.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Grid className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">{mainCategories.length}</div>
                                    <div className="text-sm text-gray-600">Ana Kategori</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">{totalProducts.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Toplam Ürün</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">500+</div>
                                    <div className="text-sm text-gray-600">Yeni Ürün</div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="font-bold text-2xl text-gray-900">4.8</div>
                                    <div className="text-sm text-gray-600">Ortalama Puan</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Categories */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Popüler Kategoriler
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                En çok tercih edilen kategorielerden alışverişe başlayın.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {popularCategories.map((category) => (
                                <Card key={category.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
                                    <Link href={`/categories/${category.slug}`}>
                                        <CardContent className="p-0">
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                                {/* Category Icon */}
                                                <div className="absolute top-4 left-4">
                                                    <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                        <Image
                                                            src={category.icon}
                                                            alt={`${category.name} icon`}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Popular Badge */}
                                                <div className="absolute top-4 right-4">
                                                    <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
                                                        Popüler
                                                    </Badge>
                                                </div>

                                                {/* Category Info */}
                                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                                    <p className="text-sm opacity-90 mb-3 line-clamp-2">{category.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            {category.productCount.toLocaleString()} ürün
                                                        </span>
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
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
                                <Link href="#all-categories">
                                    Tüm Kategorileri Gör
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* All Categories */}
                <section id="all-categories" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Tüm Kategoriler
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Aradığınız enstrümanı bulun. Her kategori alt kategoriler ile detaylandırılmıştır.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {mainCategories.map((category) => (
                                <Card key={category.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="grid lg:grid-cols-3 gap-0">
                                            {/* Category Main Info */}
                                            <div className="lg:col-span-1 relative">
                                                <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden">
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>

                                                    <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                                                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                                                            <Image
                                                                src={category.icon}
                                                                alt={`${category.name} icon`}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover rounded-lg"
                                                            />
                                                        </div>
                                                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                                        <p className="text-sm opacity-90 mb-4 line-clamp-3">{category.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                                                {category.productCount.toLocaleString()} ürün
                                                            </span>
                                                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                                                {category.children?.length || 0} alt kategori
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subcategories */}
                                            <div className="lg:col-span-2 p-8">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {category.children?.map((subcategory) => (
                                                        <Link
                                                            key={subcategory.id}
                                                            href={`/categories/${subcategory.slug}`}
                                                            className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-amber-50 rounded-xl transition-all duration-300 cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-2xl">
                                                                    <Image
                                                                        src={subcategory.icon}
                                                                        alt={`${subcategory.name} icon`}
                                                                        width={32}
                                                                        height={32}
                                                                        className="object-cover rounded-lg"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                                                                        {subcategory.name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600">
                                                                        {subcategory.productCount.toLocaleString()} ürün
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-300" />
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-gray-200">
                                                    <Button
                                                        asChild
                                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl cursor-pointer"
                                                    >
                                                        <Link href={`/categories/${category.slug}`}>
                                                            {category.name} Kategorisini Keşfet
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
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
                                Aradığınızı Bulamadınız mı?
                            </h2>
                            <p className="text-xl text-white/90 max-w-3xl mx-auto">
                                Özel istekleriniz için bizimle iletişime geçin. Uzman ekibimiz size en uygun enstrümanı bulmanıza yardımcı olur.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                    asChild
                                >
                                    <Link href="/contact">
                                        İletişime Geçin
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                                    asChild
                                >
                                    <Link href="/products">
                                        Tüm Ürünleri Gör
                                    </Link>
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
                                🎷 Jaxophone
                            </div>
                            <p className="text-gray-400">
                                Müziğin tutkununu yaşatan Türkiye&apos;nin en büyük enstrüman mağazası.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Kategoriler</h4>
                            <div className="space-y-2">
                                {mainCategories.slice(0, 4).map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="block text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Hızlı Linkler</h4>
                            <div className="space-y-2">
                                <Link href="/products" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Tüm Ürünler
                                </Link>
                                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    Hakkımızda
                                </Link>
                                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    İletişim
                                </Link>
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