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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <Header />
                <main className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center">
                                <CheckCircle className="h-12 w-12 text-white mx-auto mb-3" />
                                <h1 className="text-2xl font-bold text-white mb-2">E-posta Gönderildi!</h1>
                                <p className="text-green-100">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</p>
                            </div>

                            <div className="px-8 py-6">
                                <div className="mb-6 text-center">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        <strong>{email}</strong> adresine gönderilen e-postadaki bağlantıya tıklayarak
                                        şifrenizi sıfırlayabilirsiniz.
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-2">📧 E-postayı bulamıyor musunuz?</h3>
                                    <ul className="text-blue-700 text-sm space-y-1">
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
                                        className="w-full border-gray-300 hover:border-amber-300 hover:bg-amber-50 cursor-pointer"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Header />

            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Back to Login */}
                    <div className="mb-6">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Giriş sayfasına dön
                        </Link>
                    </div>

                    {/* Reset Password Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
                            <Mail className="h-12 w-12 text-white mx-auto mb-3" />
                            <h1 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                            <p className="text-blue-100">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim</p>
                        </div>

                        {/* Form */}
                        <div className="px-8 py-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        E-posta Adresi
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Kayıtlı e-posta adresinizi girin"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Bu e-posta adresine şifre sıfırlama bağlantısı gönderilecektir.
                                    </p>
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
                            </form>

                            {/* Help Text */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Hesabınız yok mu?{' '}
                                    <Link
                                        href="/register"
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                                    >
                                        Hesap oluşturun
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-amber-600 mt-0.5">🔒</div>
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-1">Güvenlik Notı</h3>
                                <p className="text-amber-700 text-sm">
                                    Şifre sıfırlama bağlantısı sadece 1 saat geçerlidir ve yalnızca bir kez kullanılabilir.
                                    E-postayı aldıktan sonra mümkün olan en kısa sürede şifrenizi sıfırlayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 