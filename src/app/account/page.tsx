'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    Trash2,
    X,
    AlertTriangle,
    Eye,
    EyeOff,
    Save,
    Key,
    Smartphone,
    Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Address {
    id: string;
    title: string;
    fullName: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
    createdAt: string;
}

export default function AccountPage() {
    const { user, userProfile, isAuthenticated, isLoading } = useAppSelector((state) => state.user);
    const { items: cartItems, total: cartTotal, itemCount: cartItemCount } = useAppSelector((state) => state.cart);
    const { items: favoritesItems } = useAppSelector((state) => state.favorites);
    const { signOut, updateUserProfile, changePassword, deleteAccount, sendEmailVerificationEmail } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        title: '',
        fullName: '',
        phone: '',
        address: '',
        district: '',
        city: '',
        zipCode: '',
        isDefault: false
    });

    // Account settings states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        phone: (userProfile as any)?.phone || ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [deletePassword, setDeletePassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const [preferences, setPreferences] = useState({
        emailNotifications: userProfile?.preferences?.emailNotifications ?? true,
        smsNotifications: userProfile?.preferences?.smsNotifications ?? true,
        newsletter: userProfile?.preferences?.newsletter ?? true
    });

    // Türkiye şehirleri
    const cities = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
        'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
        'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
        'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
        'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
        'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
        'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
        'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
    ];

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
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

    const handleAddAddress = () => {
        setEditingAddress(null);
        setAddressForm({
            title: '',
            fullName: '',
            phone: '',
            address: '',
            district: '',
            city: '',
            zipCode: '',
            isDefault: false
        });
        setShowAddressModal(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressForm({
            title: address.title,
            fullName: address.fullName,
            phone: address.phone,
            address: address.address,
            district: address.district,
            city: address.city,
            zipCode: address.zipCode,
            isDefault: address.isDefault
        });
        setShowAddressModal(true);
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!user?.uid || !userProfile?.addresses) return;

        try {
            const updatedAddresses = userProfile.addresses.filter((addr: any) => addr.id !== addressId);
            await updateUserProfile({ addresses: updatedAddresses });
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid || !userProfile) return;

        try {
            const newAddress: Address = {
                id: editingAddress?.id || Date.now().toString(),
                ...addressForm,
                createdAt: editingAddress?.createdAt || new Date().toISOString()
            };

            let updatedAddresses = [...(userProfile.addresses || [])];

            if (editingAddress) {
                // Update existing address
                updatedAddresses = updatedAddresses.map((addr: any) =>
                    addr.id === editingAddress.id ? newAddress : addr
                );
            } else {
                // Add new address
                updatedAddresses.push(newAddress);
            }

            // If this address is set as default, remove default from others
            if (newAddress.isDefault) {
                updatedAddresses = updatedAddresses.map((addr: any) => ({
                    ...addr,
                    isDefault: addr.id === newAddress.id
                }));
            }

            await updateUserProfile({ addresses: updatedAddresses });
            setShowAddressModal(false);
            setAddressForm({
                title: '',
                fullName: '',
                phone: '',
                address: '',
                district: '',
                city: '',
                zipCode: '',
                isDefault: false
            });
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    // Account settings functions
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        try {
            await updateUserProfile({
                displayName: profileForm.displayName,
                phone: profileForm.phone
            });
            setShowProfileModal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Yeni şifre en az 6 karakter olmalıdır!');
            return;
        }

        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setShowPasswordModal(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            alert('Şifre başarıyla güncellendi!');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Şifre güncellenirken hata oluştu!');
        }
    };

    const handlePreferencesUpdate = async () => {
        if (!user?.uid) return;

        try {
            await updateUserProfile({
                preferences: preferences
            });
            alert('Tercihler başarıyla güncellendi!');
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    const handleAccountDelete = async () => {
        if (!user?.uid) return;

        try {
            await deleteAccount(deletePassword);
            setShowDeleteConfirm(false);
            router.push('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Hesap silinirken hata oluştu!');
        }
    };

    const handleEmailVerification = async () => {
        if (!user?.uid) return;

        try {
            await sendEmailVerificationEmail();
            alert('E-posta doğrulama bağlantısı gönderildi! E-posta kutunuzu kontrol edin.');
        } catch (error) {
            console.error('Error sending email verification:', error);
            alert('E-posta doğrulama bağlantısı gönderilirken hata oluştu!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
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
                        Hoş geldiniz, {user?.displayName || user?.email}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl border-0 dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                            {/* Header with gradient background */}
                            <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6">
                                {/* Background pattern */}
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                                {/* User info */}
                                <div className="relative flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                            {user?.photoURL ? (
                                                <Image
                                                    src={user.photoURL}
                                                    alt={user?.displayName || 'Kullanıcı'}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-10 w-10 text-white" />
                                            )}
                                        </div>
                                        {user?.emailVerified && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <Shield className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-white truncate">
                                            {user?.displayName || 'Kullanıcı'}
                                        </h3>
                                        <p className="text-amber-100 text-sm truncate">{user?.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-amber-100 text-xs font-medium">Çevrimiçi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile details */}
                            <CardContent className="p-6 space-y-6">
                                {/* Quick stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {cartItemCount}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Sepet</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                                            {favoritesItems.length}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Favori</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                                            {userProfile?.addresses?.length || 0}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Adres</div>
                                    </div>
                                </div>

                                {/* Account info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                            <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                E-posta Durumu
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                {user?.emailVerified ? 'Onaylandı' : 'Onay bekliyor'}
                                            </p>
                                        </div>
                                        {user?.emailVerified ? (
                                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Onaylı
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                Bekliyor
                                            </Badge>
                                        )}
                                    </div>

                                    {userProfile && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Üyelik Tarihi
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(userProfile.createdAt).toLocaleDateString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {userProfile && userProfile.lastLoginAt !== userProfile.createdAt && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Son Giriş
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(userProfile.lastLoginAt).toLocaleDateString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-700 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Çıkış Yap
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Hesap Ayarları
                                    </Button>
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
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                Ayarlar
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
                                            <Card key={item.product.id} className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/products/${item.product.id}`)}>
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
                                                            <h4 className="font-medium text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{item.product.name}</h4>
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
                                                <Button
                                                    className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                                    onClick={() => router.push('/checkout')}
                                                >
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
                                    <Button onClick={handleAddAddress} className="flex items-center gap-2">
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
                                            <Button onClick={handleAddAddress} className="flex items-center gap-2">
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
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditAddress(address)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 hover:text-red-700"
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                            >
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

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hesap Ayarları</h2>
                                </div>

                                {/* Profile Settings */}
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <User className="h-5 w-5 text-amber-600" />
                                            Profil Bilgileri
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">Ad Soyad</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user?.displayName || 'Belirtilmemiş'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 dark:text-gray-300">E-posta</Label>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            Profili Düzenle
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Security Settings */}
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Key className="h-5 w-5 text-amber-600" />
                                            Güvenlik
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Şifre Değiştir</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
                                            </div>
                                            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                                                Değiştir
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">E-posta Onayı</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {user?.emailVerified ? 'E-posta adresiniz onaylandı' : 'E-posta adresinizi onaylayın'}
                                                </p>
                                            </div>
                                            {!user?.emailVerified && (
                                                <Button variant="outline" onClick={handleEmailVerification}>
                                                    Onayla
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notification Preferences */}
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Bell className="h-5 w-5 text-amber-600" />
                                            Bildirim Tercihleri
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">E-posta Bildirimleri</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Kampanya ve fırsat e-postaları</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={preferences.emailNotifications}
                                                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">SMS Bildirimleri</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sipariş durumu SMS'leri</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={preferences.smsNotifications}
                                                    onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Globe className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Bülten</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Haftalık ürün bülteni</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={preferences.newsletter}
                                                    onChange={(e) => setPreferences({ ...preferences, newsletter: e.target.checked })}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                            </label>
                                        </div>

                                        <Button onClick={handlePreferencesUpdate} className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Tercihleri Kaydet
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Danger Zone */}
                                <Card className="dark:bg-gray-900 dark:border-gray-800 border-red-200 dark:border-red-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                            <AlertTriangle className="h-5 w-5" />
                                            Tehlikeli Bölge
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Hesabı Sil</h4>
                                            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                                                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                                                onClick={() => setShowDeleteConfirm(true)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Hesabı Sil
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAddressModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Adres Başlığı</Label>
                                <Input
                                    id="title"
                                    value={addressForm.title}
                                    onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                                    placeholder="Ev, İş, vb."
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">Ad Soyad</Label>
                                <Input
                                    id="fullName"
                                    value={addressForm.fullName}
                                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                    placeholder="Ad Soyad"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Telefon</Label>
                                <Input
                                    id="phone"
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    placeholder="0555 123 45 67"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Adres</Label>
                                <Textarea
                                    id="address"
                                    value={addressForm.address}
                                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                    placeholder="Mahalle, Sokak, Bina No, Daire No"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="district" className="text-gray-700 dark:text-gray-300">İlçe</Label>
                                <Input
                                    id="district"
                                    value={addressForm.district}
                                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                    placeholder="İlçe"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">Şehir</Label>
                                <select
                                    id="city"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="">Şehir seçin</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300">Posta Kodu</Label>
                                <Input
                                    id="zipCode"
                                    value={addressForm.zipCode}
                                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                    placeholder="34000"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                />
                                <Label htmlFor="isDefault" className="text-gray-700 dark:text-gray-300">
                                    Varsayılan adres olarak ayarla
                                </Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddressModal(false)}
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                    {editingAddress ? 'Güncelle' : 'Ekle'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Profile Edit Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profili Düzenle</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProfileModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="profileDisplayName" className="text-gray-700 dark:text-gray-300">Ad Soyad</Label>
                                <Input
                                    id="profileDisplayName"
                                    value={profileForm.displayName}
                                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="profilePhone" className="text-gray-700 dark:text-gray-300">Telefon</Label>
                                <Input
                                    id="profilePhone"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="0555 123 45 67"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowProfileModal(false)}
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Şifre Değiştir</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">Mevcut Şifre</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">Yeni Şifre</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Yeni Şifre (Tekrar)</Label>
                                <div className="relative mt-1">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button type="submit" className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                    Değiştir
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Account Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Hesabı Sil</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                <div>
                                    <h4 className="font-medium text-red-800 dark:text-red-200">Dikkat!</h4>
                                    <p className="text-sm text-red-600 dark:text-red-300">
                                        Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hesabınızı silmek istediğinizden emin misiniz? Bu işlem:
                            </p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                <li>• Tüm sipariş geçmişinizi silecek</li>
                                <li>• Favorilerinizi ve sepetinizi silecek</li>
                                <li>• Adres bilgilerinizi silecek</li>
                                <li>• Hesap ayarlarınızı silecek</li>
                            </ul>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="deletePassword" className="text-gray-700 dark:text-gray-300">
                                        Hesabınızı silmek için şifrenizi girin
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="deletePassword"
                                            type={showDeletePassword ? "text" : "password"}
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            className="pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            placeholder="Mevcut şifrenizi girin"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                        >
                                            {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                    }}
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleAccountDelete}
                                    disabled={!deletePassword.trim()}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Hesabı Sil
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 