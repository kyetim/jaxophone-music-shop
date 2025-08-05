'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, MapPin, Globe } from 'lucide-react';
import { useState } from 'react';

// Mock brands data
const brands = [
    {
        id: 1,
        name: 'Yamaha',
        category: 'Piyano & Klavye',
        country: 'Japonya',
        founded: 1887,
        rating: 4.8,
        description: 'Dünya çapında tanınan enstrüman üreticisi',
        logo: '🎹',
        featured: true
    },
    {
        id: 2,
        name: 'Fender',
        category: 'Gitar',
        country: 'ABD',
        founded: 1946,
        rating: 4.9,
        description: 'Elektro gitar dünyasının efsane markası',
        logo: '🎸',
        featured: true
    },
    {
        id: 3,
        name: 'Gibson',
        category: 'Gitar',
        country: 'ABD',
        founded: 1902,
        rating: 4.7,
        description: 'Klasik ve elektro gitar üretiminde lider',
        logo: '🎸',
        featured: true
    },
    {
        id: 4,
        name: 'Roland',
        category: 'Elektronik',
        country: 'Japonya',
        founded: 1972,
        rating: 4.6,
        description: 'Dijital piyano ve synthesizer uzmanı',
        logo: '🎹',
        featured: false
    },
    {
        id: 5,
        name: 'Kawai',
        category: 'Piyano',
        country: 'Japonya',
        founded: 1927,
        rating: 4.8,
        description: 'Akustik ve dijital piyano üretiminde uzman',
        logo: '🎹',
        featured: false
    },
    {
        id: 6,
        name: 'Ibanez',
        category: 'Gitar',
        country: 'Japonya',
        founded: 1908,
        rating: 4.5,
        description: 'Modern gitar tasarımlarıyla öne çıkan marka',
        logo: '🎸',
        featured: false
    },
    {
        id: 7,
        name: 'Pearl',
        category: 'Davul',
        country: 'Japonya',
        founded: 1952,
        rating: 4.4,
        description: 'Profesyonel davul setleri üreticisi',
        logo: '🥁',
        featured: false
    },
    {
        id: 8,
        name: 'Shure',
        category: 'Ses Ekipmanları',
        country: 'ABD',
        founded: 1925,
        rating: 4.7,
        description: 'Mikrofon ve ses ekipmanları uzmanı',
        logo: '🎤',
        featured: false
    },
    {
        id: 9,
        name: 'Boss',
        category: 'Efekt Pedalları',
        country: 'Japonya',
        founded: 1973,
        rating: 4.6,
        description: 'Gitar efekt pedalları ve ekipmanları',
        logo: '🎛️',
        featured: false
    },
    {
        id: 10,
        name: 'Marshall',
        category: 'Amplifikatör',
        country: 'İngiltere',
        founded: 1962,
        rating: 4.8,
        description: 'Rock müziğin efsane amplifikatör markası',
        logo: '🔊',
        featured: true
    },
    {
        id: 11,
        name: 'Korg',
        category: 'Elektronik',
        country: 'Japonya',
        founded: 1962,
        rating: 4.5,
        description: 'Synthesizer ve dijital enstrüman üreticisi',
        logo: '🎹',
        featured: false
    },
    {
        id: 12,
        name: 'Gretsch',
        category: 'Gitar',
        country: 'ABD',
        founded: 1883,
        rating: 4.7,
        description: 'Klasik ve country gitar üretiminde uzman',
        logo: '🎸',
        featured: false
    }
];

const categories = ['Tümü', 'Gitar', 'Piyano', 'Davul', 'Elektronik', 'Ses Ekipmanları', 'Amplifikatör', 'Efekt Pedalları'];

export default function BrandsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    const filteredBrands = brands.filter(brand => {
        const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tümü' || brand.category.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Markalar
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Dünya çapında tanınan en iyi müzik enstrümanı markaları
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Marka ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Brands */}
                {selectedCategory === 'Tümü' && searchQuery === '' && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Öne Çıkan Markalar
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brands.filter(brand => brand.featured).map((brand) => (
                                <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-4xl">{brand.logo}</div>
                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                                                Öne Çıkan
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {brand.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {brand.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <MapPin className="h-4 w-4" />
                                                <span>{brand.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Globe className="h-4 w-4" />
                                                <span>Kuruluş: {brand.founded}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="text-gray-700 dark:text-gray-300">{brand.rating}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Brands */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {searchQuery || selectedCategory !== 'Tümü' ? 'Arama Sonuçları' : 'Tüm Markalar'}
                    </h2>

                    {filteredBrands.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Marka bulunamadı
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Arama kriterlerinizi değiştirerek tekrar deneyin.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBrands.map((brand) => (
                                <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-3xl">{brand.logo}</div>
                                            {brand.featured && (
                                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                                                    Öne Çıkan
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {brand.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                            {brand.description}
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <MapPin className="h-3 w-3" />
                                                <span>{brand.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <Globe className="h-3 w-3" />
                                                <span>{brand.founded}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                <span className="text-gray-700 dark:text-gray-300">{brand.rating}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 