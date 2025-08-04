'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Calendar,
    Settings,
    LogOut,
    ShoppingBag,
    MapPin,
    Bell,
    Shield,
    Heart,
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import Image from 'next/image';

export default function AccountPage() {
    const { user, userProfile, isAuthenticated, isLoading } = useAppSelector((state) => state.user);
    const { items: cartItems, total: cartTotal, itemCount: cartItemCount } = useAppSelector((state) => state.cart);
    const { items: favoritesItems } = useAppSelector((state) => state.favorites);
    const { signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    </div>
                </main>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Hesabım
                    </h1>
                    <p className="text-gray-600">
                        Hoş geldiniz, {user.displayName || user.email}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">
                                            {user.displayName || 'Kullanıcı'}
                                        </CardTitle>
                                        <p className="text-amber-100">{user.email}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">
                                            {user.emailVerified ? 'E-posta onaylandı' : 'E-posta onaylanmadı'}
                                        </span>
                                        {user.emailVerified && (
                                            <Shield className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>

                                    {userProfile && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">
                                                Üye olma: {new Date(userProfile.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t">
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="w-full border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Çıkış Yap
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-1">Siparişlerim</h3>
                                    <p className="text-sm text-gray-600">Sipariş geçmişini görüntüle</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-1">Adreslerim</h3>
                                    <p className="text-sm text-gray-600">Teslimat adreslerini yönet</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-1">Favorilerim</h3>
                                    <p className="text-sm text-gray-600">Beğendiğin ürünler</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-amber-600" />
                                    Son Aktiviteler
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Hesap oluşturuldu</p>
                                            <p className="text-sm text-gray-600">
                                                {userProfile && new Date(userProfile.createdAt).toLocaleString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>

                                    {userProfile && userProfile.lastLoginAt !== userProfile.createdAt && (
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Son giriş</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(userProfile.lastLoginAt).toLocaleString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center py-4">
                                        <p className="text-gray-500 text-sm">Daha fazla aktivite için alışverişe başlayın!</p>
                                        <Button
                                            asChild
                                            className="mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 cursor-pointer"
                                        >
                                            <a href="/products">Ürünleri Keşfet</a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-amber-600" />
                                    Hesap Ayarları
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                                            <p className="text-sm text-gray-600">Kampanya ve fırsat e-postaları al</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                defaultChecked={userProfile?.preferences?.emailNotifications ?? true}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">SMS Bildirimleri</p>
                                            <p className="text-sm text-gray-600">Sipariş durumu SMS'leri</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                defaultChecked={userProfile?.preferences?.smsNotifications ?? true}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 