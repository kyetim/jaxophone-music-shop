'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { BlogService } from '@/lib/firestore';
import { Calendar, User, Tag, Eye, Heart, MessageCircle, ArrowLeft, Share2, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBlog = async () => {
            if (!params?.id) return;

            try {
                setLoading(true);
                const blogData = await BlogService.getById(params.id as string);

                if (!blogData) {
                    setError('Blog yazısı bulunamadı');
                    return;
                }

                if ((blogData as any).status !== 'published') {
                    setError('Bu blog yazısı henüz yayınlanmamış');
                    return;
                }

                setBlog(blogData);

                // Increment view count
                await BlogService.incrementViews(params.id as string);
            } catch (err) {
                console.error('Error loading blog:', err);
                setError('Blog yazısı yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [params?.id]);

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} dakika`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {error || 'Blog yazısı bulunamadı'}
                        </h1>
                        <Link href="/blog">
                            <Button className="bg-amber-600 hover:bg-amber-700">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Blog'a Dön
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/blog" className="inline-flex items-center text-purple-100 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Blog'a Dön
                    </Link>

                    <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {blog.category}
                        </span>
                        <div className="flex items-center text-purple-100 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(blog.publishedAt)}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        {blog.title}
                    </h1>

                    <p className="text-xl text-purple-100 mb-6">
                        {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-purple-100">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {blog.author}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {getReadTime(blog.content)}
                            </div>
                            <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {blog.views || 0} görüntüleme
                            </div>
                        </div>

                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Share2 className="h-4 w-4 mr-2" />
                            Paylaş
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                    {/* Featured Image */}
                    {blog.imageUrl && (
                        <div className="h-64 md:h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="p-8">
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>

                        {/* Article Footer */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        {blog.author}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {formatDate(blog.publishedAt)}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                                        <Heart className="h-4 w-4 mr-2" />
                                        {blog.likes || 0}
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        {blog.comments || 0}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Benzer Yazılar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder for related posts */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Benzer blog yazıları burada görünecek
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Bu özellik yakında eklenecek...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 