'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!email) {
            setError('E-posta adresi gereklidir.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Geçerli bir e-posta adresi girin.');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (error: any) {
            setError(error.message || 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Header />
                <main className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center">
                                <CheckCircle className="h-12 w-12 text-white mx-auto mb-3" />
                                <h1 className="text-2xl font-bold text-white mb-2">E-posta Gönderildi!</h1>
                                <p className="text-green-100">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</p>
                            </div>

                            <div className="px-8 py-6">
                                <div className="mb-6 text-center">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        <strong>{email}</strong> adresine gönderilen e-postadaki bağlantıya tıklayarak
                                        şifrenizi sıfırlayabilirsiniz.
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📧 E-postayı bulamıyor musunuz?</h3>
                                    <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                                        <li>• Spam/Önemsiz klasörünüzü kontrol edin</li>
                                        <li>• E-posta adresinizi doğru yazdığınızdan emin olun</li>
                                        <li>• Birkaç dakika bekleyip tekrar deneyin</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => {
                                            setSuccess(false);
                                            setEmail('');
                                        }}
                                        variant="outline"
                                        className="w-full border-gray-300 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer text-gray-700 dark:text-gray-300"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Başka E-posta ile Dene
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 cursor-pointer"
                                    >
                                        <Link href="/login">
                                            <ArrowRight className="h-4 w-4 mr-2" />
                                            Giriş Sayfasına Dön
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Forgot Password Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
                            <h1 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                            <p className="text-blue-100">E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim</p>
                        </div>

                        {/* Form */}
                        <div className="px-8 py-6">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        E-posta Adresi
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ornek@email.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Gönderiliyor...
                                        </div>
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Şifre Sıfırlama E-postası Gönder
                                        </>
                                    )}
                                </Button>

                                {/* Back to Login Link */}
                                <div className="text-center">
                                    <Link
                                        href="/login"
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center justify-center"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-1" />
                                        Giriş sayfasına dön
                                    </Link>
                                </div>
                            </form>

                            {/* Additional Help */}
                            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Yardıma mı ihtiyacınız var?</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    E-posta adresinizi hatırlamıyorsanız{' '}
                                    <Link
                                        href="/contact"
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                                    >
                                        müşteri hizmetlerimizle
                                    </Link>
                                    {' '}iletişime geçebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 