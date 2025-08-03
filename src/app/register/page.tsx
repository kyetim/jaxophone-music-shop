'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { signUp } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        if (!formData.displayName.trim()) {
            return 'İsim ve soyisim gereklidir.';
        }
        if (!formData.email) {
            return 'E-posta adresi gereklidir.';
        }
        if (formData.password.length < 6) {
            return 'Şifre en az 6 karakter olmalıdır.';
        }
        if (formData.password !== formData.confirmPassword) {
            return 'Şifreler eşleşmiyor.';
        }
        if (!agreedToTerms) {
            return 'Kullanım koşullarını kabul etmelisiniz.';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            await signUp(formData.email, formData.password, formData.displayName);
            setSuccess(true);

            // Success mesajını göster ve 2 saniye sonra yönlendir
            setTimeout(() => {
                router.push('/account');
            }, 2000);
        } catch (error: any) {
            setError(error.message || 'Hesap oluşturulurken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = {
        length: formData.password.length >= 6,
        hasLetter: /[a-zA-Z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
    };

    const isPasswordValid = Object.values(passwordStrength).every(Boolean);

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Header />
                <main className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-center">
                                <CheckCircle className="h-12 w-12 text-white mx-auto mb-3" />
                                <h1 className="text-2xl font-bold text-white mb-2">Kayıt Başarılı!</h1>
                                <p className="text-green-100">Hesabınız başarıyla oluşturuldu!</p>
                            </div>

                            <div className="px-8 py-6 text-center">
                                <div className="mb-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-300">Hesap sayfanıza yönlendiriliyorsunuz...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <main className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Register Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-center">
                            <h1 className="text-2xl font-bold text-white mb-2">Hesap Oluşturun</h1>
                            <p className="text-amber-100">Jaxophone'a katılın</p>
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

                                {/* Display Name Field */}
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        İsim ve Soyisim
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="displayName"
                                            name="displayName"
                                            type="text"
                                            value={formData.displayName}
                                            onChange={handleChange}
                                            placeholder="Adınız ve soyadınız"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        E-posta Adresi
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ornek@email.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Şifre
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <span className={`text-xs ${passwordStrength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                En az 6 karakter
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${passwordStrength.hasLetter ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <span className={`text-xs ${passwordStrength.hasLetter ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                En az bir harf
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                En az bir rakam
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Şifre Tekrar
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start space-x-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                                        <Link
                                            href="/terms"
                                            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline"
                                        >
                                            Kullanım Koşulları
                                        </Link>
                                        'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading || !isPasswordValid || !agreedToTerms}
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Hesap oluşturuluyor...
                                        </div>
                                    ) : (
                                        <>
                                            <ArrowRight className="h-4 w-4 mr-2" />
                                            Hesap Oluştur
                                        </>
                                    )}
                                </Button>

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Zaten hesabınız var mı?{' '}
                                        <Link
                                            href="/login"
                                            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer"
                                        >
                                            Giriş yapın
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 