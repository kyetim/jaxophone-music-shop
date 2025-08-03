'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, Eye, Search, ArrowRight, Music, Heart, MessageCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'Tümü', count: 12 },
        { id: 'guitar', name: 'Gitar', count: 4 },
        { id: 'piano', name: 'Piyano', count: 3 },
        { id: 'tips', name: 'İpuçları', count: 3 },
        { id: 'news', name: 'Haberler', count: 2 }
    ];

    const blogPosts = [
        {
            id: 1,
            title: 'Elektro Gitar Almadan Önce Bilmeniz Gerekenler',
            excerpt: 'İlk elektro gitarınızı alırken dikkat etmeniz gereken önemli noktalar ve öneriler.',
            content: 'Elektro gitar almaya karar verdiniz ancak nereden başlayacağınızı bilmiyor musunuz? Bu rehberde sizin için en doğru elektro gitarı seçmenize yardımcı olacak önemli bilgileri derledik...',
            author: 'Mehmet Kaya',
            date: '15 Ocak 2024',
            category: 'guitar',
            tags: ['elektro gitar', 'satın alma', 'rehber'],
            image: '/api/placeholder/800/400',
            readTime: '5 dakika',
            views: 1250,
            likes: 89,
            comments: 23
        },
        {
            id: 2,
            title: 'Piyano Çalmaya Başlamak İçin 10 Altın Kural',
            excerpt: 'Piyano öğrenmeye başlayanlar için pratik ipuçları ve temel bilgiler.',
            content: 'Piyano öğrenmek istediğiniz ancak nereden başlayacağınızı bilmiyor musunuz? İşte başlangıç seviyesindeki piyanistler için vazgeçilmez 10 kural...',
            author: 'Ayşe Demir',
            date: '12 Ocak 2024',
            category: 'piano',
            tags: ['piyano', 'başlangıç', 'öğrenim'],
            image: '/api/placeholder/800/400',
            readTime: '7 dakika',
            views: 2100,
            likes: 156,
            comments: 34
        },
        {
            id: 3,
            title: '2024 Yılının En İyi Akustik Gitarları',
            excerpt: 'Bu yıl piyasaya çıkan en kaliteli akustik gitar modellerinin detaylı incelemesi.',
            content: '2024 yılında müzik dünyasında öne çıkan akustik gitar modelleri ve özellikleri hakkında detaylı bilgiler...',
            author: 'Can Özkan',
            date: '8 Ocak 2024',
            category: 'guitar',
            tags: ['akustik gitar', 'inceleme', '2024'],
            image: '/api/placeholder/800/400',
            readTime: '6 dakika',
            views: 850,
            likes: 67,
            comments: 18
        },
        {
            id: 4,
            title: 'Enstrüman Bakımı: Uzun Ömürlü Kullanım Rehberi',
            excerpt: 'Enstrümanlarınızın ömrünü uzatmak için yapmanız gereken bakım işlemleri.',
            content: 'Enstrümanlarınızın uzun yıllar boyunca size eşlik etmesi için düzenli bakım çok önemli. İşte detaylı bakım rehberi...',
            author: 'Fatma Arslan',
            date: '5 Ocak 2024',
            category: 'tips',
            tags: ['bakım', 'enstrüman', 'rehber'],
            image: '/api/placeholder/800/400',
            readTime: '4 dakika',
            views: 1800,
            likes: 134,
            comments: 45
        },
        {
            id: 5,
            title: 'Dijital Piyano vs Akustik Piyano: Hangisi Sizin İçin?',
            excerpt: 'Dijital ve akustik piyano arasındaki farklar ve hangi durumda hangisini tercih etmelisiniz.',
            content: 'Piyano alırken karşılaştığınız en büyük karar: Dijital mi akustik mi? Her iki seçeneğin artı ve eksilerini karşılaştırıyoruz...',
            author: 'Emre Yıldız',
            date: '2 Ocak 2024',
            category: 'piano',
            tags: ['dijital piyano', 'akustik piyano', 'karşılaştırma'],
            image: '/api/placeholder/800/400',
            readTime: '8 dakika',
            views: 1650,
            likes: 98,
            comments: 29
        },
        {
            id: 6,
            title: 'Müzik Dünyasından Haberler: Ocak 2024',
            excerpt: 'Müzik endüstrisinde bu ay yaşanan önemli gelişmeler ve yenilikler.',
            content: 'Ocak ayında müzik dünyasında yaşanan önemli gelişmeleri ve yeni çıkan albümleri sizler için derledik...',
            author: 'Serkan Taş',
            date: '1 Ocak 2024',
            category: 'news',
            tags: ['haberler', 'müzik endüstrisi', '2024'],
            image: '/api/placeholder/800/400',
            readTime: '3 dakika',
            views: 950,
            likes: 45,
            comments: 12
        }
    ];

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts[0];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-black dark:bg-black">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Jaxophone Blog</h1>
                            <p className="text-xl text-purple-100">
                                Müzik dünyasından haberler, ipuçları ve rehberler
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Featured Post */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Öne Çıkan Yazı</h2>
                        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <div className="h-64 md:h-full bg-gray-800 flex items-center justify-center">
                                        <Music className="h-16 w-16 text-gray-400" />
                                    </div>
                                </div>
                                <div className="md:w-1/2 p-8">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <span className="bg-amber-900 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                                            {categories.find(cat => cat.id === featuredPost.category)?.name}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {featuredPost.date}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        {featuredPost.title}
                                    </h3>

                                    <p className="text-gray-300 mb-6">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-1" />
                                                {featuredPost.author}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="h-4 w-4 mr-1" />
                                                {featuredPost.views}
                                            </div>
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-1" />
                                                {featuredPost.likes}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/blog/${featuredPost.id}`}
                                            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                                        >
                                            <span>Devamını Oku</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Search */}
                            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4">Arama</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Blog yazılarında ara..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4">Kategoriler</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                                ? 'bg-amber-900 text-amber-300'
                                                : 'hover:bg-gray-800 text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{category.name}</span>
                                                <span className="text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                                    {category.count}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                                <h3 className="text-lg font-bold text-white mb-4">Popüler Etiketler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['gitar', 'piyano', 'başlangıç', 'rehber', 'bakım', 'inceleme', 'ipuçları', 'haberler'].map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Blog Posts */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedCategory === 'all' ? 'Tüm Yazılar' : `${categories.find(cat => cat.id === selectedCategory)?.name} Yazıları`}
                                </h2>
                                <span className="text-gray-400">
                                    {filteredPosts.length} yazı bulundu
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPosts.slice(1).map(post => (
                                    <article key={post.id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-800">
                                        <div className="h-48 bg-gray-800 flex items-center justify-center">
                                            <Music className="h-12 w-12 text-gray-400" />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center space-x-4 mb-3">
                                                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                                                    {categories.find(cat => cat.id === post.category)?.name}
                                                </span>
                                                <span className="text-gray-400 text-sm">{post.readTime}</span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-300 mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-1" />
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {post.views}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        {post.comments}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {post.date}
                                                </div>

                                                <Link
                                                    href={`/blog/${post.id}`}
                                                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
                                                >
                                                    <span>Oku</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                                        Önceki
                                    </button>
                                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg">
                                        1
                                    </button>
                                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                                        2
                                    </button>
                                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                                        3
                                    </button>
                                    <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                                        Sonraki
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 