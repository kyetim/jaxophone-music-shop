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
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Hesabım
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Hoş geldiniz, {user.displayName || user.email}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-lg border-0 dark:bg-gray-900 dark:border-gray-800">
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
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {user.emailVerified ? 'E-posta onaylandı' : 'E-posta onaylanmadı'}
                                        </span>
                                        {user.emailVerified && (
                                            <Shield className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>

                                    {userProfile && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Üye olma: {new Date(userProfile.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
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
                    <div className="lg:col-span-2">
                        {/* Navigation Tabs */}
                        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Profil
                            </button>
                            <button
                                onClick={() => setActiveTab('cart')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'cart'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Sepetim ({cartItemCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('favorites')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'favorites'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Favorilerim ({favoritesItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'addresses'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Adreslerim
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Card
                                        className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-900 dark:border-gray-800"
                                        onClick={() => setActiveTab('cart')}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sepetim</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {cartItemCount} ürün • {cartTotal.toLocaleString('tr-TR')}₺
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-900 dark:border-gray-800"
                                        onClick={() => setActiveTab('addresses')}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Adreslerim</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {userProfile?.addresses?.length || 0} adres
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-900 dark:border-gray-800"
                                        onClick={() => setActiveTab('favorites')}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Favorilerim</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {favoritesItems.length} ürün
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity */}
                                <Card className="shadow-lg border-0 dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Bell className="h-5 w-5 text-amber-600" />
                                            Son Aktiviteler
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">Hesap oluşturuldu</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {userProfile && new Date(userProfile.createdAt).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>

                                            {userProfile && userProfile.lastLoginAt !== userProfile.createdAt && (
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">Son giriş</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {new Date(userProfile.lastLoginAt).toLocaleString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-center py-4">
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Daha fazla aktivite için alışverişe başlayın!</p>
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
                                <Card className="shadow-lg border-0 dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Settings className="h-5 w-5 text-amber-600" />
                                            Hesap Ayarları
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">E-posta Bildirimleri</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Kampanya ve fırsat e-postaları al</p>
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

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">SMS Bildirimleri</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sipariş durumu SMS'leri</p>
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
                        )}

                        {activeTab === 'cart' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sepetim</h2>
                                    <Badge variant="secondary" className="text-sm">
                                        {cartItemCount} ürün
                                    </Badge>
                                </div>

                                {cartItems.length === 0 ? (
                                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                                        <CardContent className="p-8 text-center">
                                            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sepetiniz Boş</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Henüz sepetinize ürün eklemediniz.</p>
                                            <Button asChild>
                                                <a href="/products">Alışverişe Başla</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <Card key={item.product.id} className="dark:bg-gray-900 dark:border-gray-800">
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.product.imageWebp || item.product.imageUrl}
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.brand}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    Adet: {item.quantity}
                                                                </span>
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    {(item.product.price * item.quantity).toLocaleString('tr-TR')}₺
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        <Card className="dark:bg-gray-900 dark:border-gray-800">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Toplam</span>
                                                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                                        {cartTotal.toLocaleString('tr-TR')}₺
                                                    </span>
                                                </div>
                                                <Button className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                                    Sepeti Tamamla
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorilerim</h2>
                                    <Badge variant="secondary" className="text-sm">
                                        {favoritesItems.length} ürün
                                    </Badge>
                                </div>

                                {favoritesItems.length === 0 ? (
                                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                                        <CardContent className="p-8 text-center">
                                            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Favori Ürününüz Yok</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Beğendiğiniz ürünleri favorilerinize ekleyin.</p>
                                            <Button asChild>
                                                <a href="/products">Ürünleri Keşfet</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favoritesItems.map((product) => (
                                            <Card key={product.id} className="dark:bg-gray-900 dark:border-gray-800">
                                                <CardContent className="p-4">
                                                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                                                        <Image
                                                            src={product.imageWebp || product.imageUrl}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{product.name}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                                            {product.price.toLocaleString('tr-TR')}₺
                                                        </span>
                                                        <Button size="sm" variant="outline">
                                                            Sepete Ekle
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Adreslerim</h2>
                                    <Button className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Yeni Adres Ekle
                                    </Button>
                                </div>

                                {(!userProfile?.addresses || userProfile.addresses.length === 0) ? (
                                    <Card className="dark:bg-gray-900 dark:border-gray-800">
                                        <CardContent className="p-8 text-center">
                                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Henüz Adres Eklenmemiş</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">Teslimat adreslerinizi ekleyin.</p>
                                            <Button className="flex items-center gap-2">
                                                <Plus className="h-4 w-4" />
                                                İlk Adresinizi Ekleyin
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {userProfile.addresses.map((address: any) => (
                                            <Card key={address.id} className="dark:bg-gray-900 dark:border-gray-800">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-medium text-gray-900 dark:text-white">{address.title}</h4>
                                                                {address.isDefault && (
                                                                    <Badge variant="secondary" className="text-xs">Varsayılan</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                                {address.fullName}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                                {address.address}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {address.district}, {address.city} {address.zipCode}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {address.phone}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 