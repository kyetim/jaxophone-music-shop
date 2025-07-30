'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [userName, setUserName] = useState('');

    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('📝 Login form submitted:', { email, hasPassword: !!password });

        setError(null);
        setSuccess(false);
        setIsLoading(true);

        try {
            console.log('🔄 signIn fonksiyonu çağrılıyor...');
            const user = await signIn(email, password);
            console.log('✅ signIn başarılı:', user);

            setUserName(user.displayName || user.email || 'Kullanıcı');
            setSuccess(true);

            // Success mesajını göster ve 2 saniye sonra yönlendir
            setTimeout(() => {
                router.push('/account');
            }, 2000);
        } catch (error: any) {
            console.error('❌ Login error:', error);
            setError(error.message || 'Giriş yapılırken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
                <Header />
                <main className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center">
                                <CheckCircle className="h-12 w-12 text-white mx-auto mb-3" />
                                <h1 className="text-2xl font-bold text-white mb-2">Giriş Başarılı!</h1>
                                <p className="text-green-100">Tekrar hoş geldiniz, {userName}!</p>
                            </div>

                            <div className="px-8 py-6 text-center">
                                <div className="mb-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Hesap sayfanıza yönlendiriliyorsunuz...</p>
                                </div>

                                <Button
                                    onClick={() => router.push('/account')}
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 cursor-pointer"
                                >
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Hesabıma Git
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
            <Header />

            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-center">
                            <h1 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h1>
                            <p className="text-amber-100">Hesabınıza giriş yapın</p>
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
                                            placeholder="ornek@email.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Şifre
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading || !email || !password}
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Giriş yapılıyor...
                                        </div>
                                    ) : (
                                        <>
                                            <ArrowRight className="h-4 w-4 mr-2" />
                                            Giriş Yap
                                        </>
                                    )}
                                </Button>

                                {/* Forgot Password Link */}
                                <div className="text-center">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-gray-600 hover:text-amber-600 transition-colors cursor-pointer"
                                    >
                                        Şifrenizi mi unuttunuz?
                                    </Link>
                                </div>
                            </form>

                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Hesabınız yok mu?{' '}
                                    <Link
                                        href="/register"
                                        className="text-amber-600 hover:text-amber-700 font-medium transition-colors cursor-pointer"
                                    >
                                        Hesap oluşturun
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 