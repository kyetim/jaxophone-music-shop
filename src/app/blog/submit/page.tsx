'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Header } from '@/components/layout/header';
import { BlogService } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function BlogSubmitPage() {
    const router = useRouter();
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        tags: '',
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const categories = [
        'Gitar',
        'Piyano',
        'Davul',
        'İpuçları',
        'Haberler',
        'İnceleme',
        'Eğitim',
        'Teknoloji',
        'Diğer'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            alert('Blog göndermek için giriş yapmalısınız.');
            return;
        }

        setLoading(true);

        try {
            // Clean the form data
            const cleanFormData = {
                title: formData.title.trim(),
                excerpt: formData.excerpt.trim(),
                content: formData.content.trim(),
                author: formData.author.trim() || user.displayName || user.email?.split('@')[0] || 'Anonim',
                category: formData.category,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                imageUrl: formData.imageUrl.trim() || undefined, // Only send if not empty
                submittedBy: user.uid,
                userEmail: user.email || ''
            };

            await BlogService.submitForReview(cleanFormData);

            setSuccess(true);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                author: '',
                category: '',
                tags: '',
                imageUrl: ''
            });
        } catch (error) {
            console.error('Error submitting blog:', error);
            alert('Blog gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <AlertCircle className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Giriş Yapmanız Gerekiyor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Blog yazısı göndermek için hesabınıza giriş yapmalısınız.
                        </p>
                        <Link href="/login">
                            <Button className="bg-amber-600 hover:bg-amber-700">
                                Giriş Yap
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Blog Yazınız Gönderildi!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Blog yazınız inceleme sürecine alındı. Onaylandıktan sonra yayınlanacaktır.
                        </p>
                        <div className="space-x-4">
                            <Link href="/blog">
                                <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Blog'a Dön
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setSuccess(false)}
                                className="bg-amber-600 hover:bg-amber-700"
                            >
                                Yeni Blog Gönder
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Blog'a Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Blog Yazısı Gönder
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Blog yazınızı gönderin, inceleme sonrası yayınlanacaktır.
                    </p>
                </div>

                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <FileText className="h-5 w-5 text-amber-600" />
                            Blog Yazısı Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                    Başlık *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Blog yazınızın başlığı"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <Label htmlFor="excerpt" className="text-gray-700 dark:text-gray-300">
                                    Özet *
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                    placeholder="Blog yazınızın kısa özeti"
                                    rows={3}
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                                    İçerik *
                                </Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    placeholder="Blog yazınızın tam içeriği"
                                    rows={10}
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <Label htmlFor="author" className="text-gray-700 dark:text-gray-300">
                                    Yazar Adı
                                </Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) => handleInputChange('author', e.target.value)}
                                    placeholder={user?.displayName || user?.email?.split('@')[0] || 'Yazar adınız'}
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Boş bırakırsanız profil bilgileriniz kullanılacak
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                                    Kategori *
                                </Label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="">Kategori seçin</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300">
                                    Etiketler
                                </Label>
                                <Input
                                    id="tags"
                                    value={formData.tags}
                                    onChange={(e) => handleInputChange('tags', e.target.value)}
                                    placeholder="etiket1, etiket2, etiket3"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Etiketleri virgülle ayırarak yazın
                                </p>
                            </div>

                            {/* Image URL */}
                            <div>
                                <Label htmlFor="imageUrl" className="text-gray-700 dark:text-gray-300">
                                    Görsel URL (İsteğe Bağlı)
                                </Label>
                                <Input
                                    id="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Blog yazınız için görsel URL'i ekleyebilirsiniz
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <Link href="/blog">
                                    <Button variant="outline" type="button" className="border-gray-300 dark:border-gray-600">
                                        İptal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            <span>Gönderiliyor...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Send className="h-4 w-4 mr-2" />
                                            <span>Blog Gönder</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 