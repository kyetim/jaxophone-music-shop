import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    {/* 404 Graphics */}
                    <div className="mb-8">
                        <div className="text-9xl font-bold text-amber-600 dark:text-amber-400 mb-4">
                            404
                        </div>
                        <div className="text-6xl mb-4">🎵</div>
                    </div>

                    {/* Error Message */}
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Sayfa Bulunamadı
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        Belki de yeni bir melodi keşfetme zamanı gelmiştir!
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Ana Sayfaya Dön
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/products">
                                <Search className="mr-2 h-5 w-5" />
                                Ürünleri Keşfet
                            </Link>
                        </Button>
                    </div>

                    {/* Popular Links */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Popüler Sayfalar
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/products?category=Gitarlar" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Gitarlar
                            </Link>
                            <Link href="/products?category=Klavyeli Çalgılar" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Piyanolar
                            </Link>
                            <Link href="/products?category=Vurmalı Çalgılar" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Davullar
                            </Link>
                            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Hakkımızda
                            </Link>
                            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                İletişim
                            </Link>
                            <Link href="/brands" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Markalar
                            </Link>
                            <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Blog
                            </Link>
                            <Link href="/account" className="text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                Hesabım
                            </Link>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Button variant="ghost" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Geri Dön
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 