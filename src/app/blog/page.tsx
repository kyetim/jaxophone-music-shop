'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, Eye, Search, ArrowRight, Music, Heart, MessageCircle, Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { BlogService } from '@/lib/firestore';
import { useAppSelector } from '@/store/hooks';

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

    const categories = [
        { id: 'all', name: 'Tümü', count: 0 },
        { id: 'Gitar', name: 'Gitar', count: 0 },
        { id: 'Piyano', name: 'Piyano', count: 0 },
        { id: 'İpuçları', name: 'İpuçları', count: 0 },
        { id: 'Haberler', name: 'Haberler', count: 0 }
    ];

    useEffect(() => {
        loadBlogPosts();
    }, []);

    const loadBlogPosts = async () => {
        try {
            setLoading(true);
            const posts = await BlogService.getPublished();
            setBlogPosts(posts);

            // Update category counts
            categories.forEach(cat => {
                if (cat.id === 'all') {
                    cat.count = posts.length;
                } else {
                    cat.count = posts.filter((post: any) => post.category === cat.id).length;
                }
            });
        } catch (error) {
            console.error('Error loading blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = filteredPosts[0];

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Jaxophone Blog</h1>
                        <p className="text-xl text-purple-100 mb-6">
                            Müzik dünyasından haberler, ipuçları ve rehberler
                        </p>
                        {isAuthenticated && (
                            <Link href="/blog/submit">
                                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center mx-auto">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Blog Yazısı Gönder
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured Post */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Öne Çıkan Yazı</h2>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                <div className="h-64 md:h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <Music className="h-16 w-16 text-gray-400" />
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8">
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                                        {featuredPost ? categories.find(cat => cat.id === featuredPost.category)?.name : 'Yok'}
                                    </span>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {featuredPost ? featuredPost.date : ''}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {featuredPost ? featuredPost.title : 'Henüz yazı yok'}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {featuredPost ? featuredPost.excerpt : 'Henüz yazı yok'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-1" />
                                            {featuredPost ? featuredPost.author : ''}
                                        </div>
                                        <div className="flex items-center">
                                            <Eye className="h-4 w-4 mr-1" />
                                            {featuredPost ? featuredPost.views : ''}
                                        </div>
                                        <div className="flex items-center">
                                            <Heart className="h-4 w-4 mr-1" />
                                            {featuredPost ? featuredPost.likes : ''}
                                        </div>
                                    </div>

                                    <Link
                                        href={featuredPost ? `/blog/${featuredPost.id}` : '#'}
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
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Arama</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Blog yazılarında ara..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kategoriler</h3>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                                            ? 'bg-amber-900 text-amber-300'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{category.name}</span>
                                            <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                {category.count}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popüler Etiketler</h3>
                            <div className="flex flex-wrap gap-2">
                                {['gitar', 'piyano', 'başlangıç', 'rehber', 'bakım', 'inceleme', 'ipuçları', 'haberler'].map(tag => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedCategory === 'all' ? 'Tüm Yazılar' : `${categories.find(cat => cat.id === selectedCategory)?.name} Yazıları`}
                            </h2>
                            <span className="text-gray-600 dark:text-gray-400">
                                {filteredPosts.length} yazı bulundu
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {loading ? (
                                // Loading state
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden animate-pulse">
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="p-6">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredPosts.slice(1).length > 0 ? (
                                filteredPosts.slice(1).map((post: any) => (
                                    <article key={post.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800">
                                        <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <Music className="h-12 w-12 text-gray-400" />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center space-x-4 mb-3">
                                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                                    {post.category}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {Math.ceil((post.content?.split(' ').length || 0) / 200)} dakika
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-1" />
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {post.views || 0}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                        {post.comments || 0}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {formatDate(post.publishedAt)}
                                                </div>

                                                <Link
                                                    href={`/blog/${post.id}`}
                                                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium flex items-center space-x-1"
                                                >
                                                    <span>Oku</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12">
                                    <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Bu kategoride henüz yazı yok
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Farklı bir kategori seçin veya ilk yazıyı gönderin.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Önceki
                                </button>
                                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg">
                                    1
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    2
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    3
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Sonraki
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 