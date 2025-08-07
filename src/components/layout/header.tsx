'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLoading } from '@/components/providers/loading-provider';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Bell, Gift, ChevronDown } from 'lucide-react';
import { CartSidebar } from './cart-sidebar';
import { FavoritesSidebar } from './favorites-sidebar';
import { NotificationsSidebar } from './notifications-sidebar';
import { SearchInput } from '@/components/search/search-input';

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const cartHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const favoritesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const notificationsHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const categoryHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cartItemCount = useAppSelector((state) => state.cart.itemCount);
    const favoritesCount = useAppSelector((state) => state.favorites.items.length);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);
    const { unreadCount } = useNotifications();
    const { setLoading } = useLoading();
    const router = useRouter();

    // Main categories for horizontal navigation (DoReMusic style)
    const mainCategories = [
        { name: 'PİYANOLAR', href: '/products?category=piano', active: false },
        { name: 'TUŞLULAR', href: '/products?category=keyboard', active: false },
        { name: 'GİTARLAR', href: '/products?category=guitar', active: false },
        { name: 'AMFİ & PEDAL', href: '/products?category=amplifier', active: false },
        { name: 'YAYLILAR', href: '/products?category=strings', active: false },
        { name: 'NEFESLİLER', href: '/products?category=winds', active: false },
        { name: 'DAVUL & PERKÜSYON', href: '/products?category=drums', active: false },
        { name: 'STÜDYO & DJ', href: '/products?category=studio', active: false },
        { name: 'SESLENDIRME', href: '/products?category=sound', active: false },
        { name: 'HI-FI', href: '/products?category=hifi', active: false },
        { name: 'AKSESUARLAR', href: '/products?category=accessories', active: false },
        { name: 'OUTLET', href: '/products?category=outlet', active: false }
    ];

    // Mega menu categories (similar to DoReMusic structure)
    const megaMenuCategories: Record<string, {
        sections: { title: string; items: string[] }[];
        featured: { title: string; items: string[] };
    }> = {
        'GİTARLAR': {
            sections: [
                {
                    title: 'Gitar Kategorisi Anasayfa',
                    items: ['Elektro Gitarlar', 'Klasik Gitarlar', 'Akustik Gitarlar', 'Bas Gitarlar', 'Gitar Setleri', 'Ukuleleler', 'Guitarlele']
                },
                {
                    title: 'Udlar',
                    items: ['Mandolinler', 'Banjolar', 'Gitar Telleri', 'Gitar Parçaları', 'Gitar Aksesuarları', 'Sehpa & Standlar', 'Penalar']
                },
                {
                    title: 'Kılıf & Taşıma Çantaları',
                    items: ['Bakım & Temizlik Ürünleri']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'PİYANOLAR': {
            sections: [
                {
                    title: 'Piyanolar Kategorisi Anasayfa',
                    items: ['Akustik Duvar Piyanolar', 'Akustik Kuyruklu Piyanolar', 'Dijital Konsol Piyanolar', 'Dijital Kuyruklu Piyanolar', 'Dijital Taşınabilir Piyanolar', 'Akustik Silent Piyanolar', 'Akustik Disklavier Piyanolar']
                },
                {
                    title: 'Piyano Aksesuarları',
                    items: ['Piyano Tabureleri', 'Piyano Pedal Uzatıcıları', 'Piyano Kapakları', 'Piyano Lambaları', 'Metronom & Tuner', 'Piyano Bakım Ürünleri']
                }
            ],
            featured: {
                title: 'ÖNE ÇIKAN ÜRÜNLER',
                items: ['YENİ MODELLER', 'KAMPANYALI ÜRÜNLER']
            }
        },
        'TUŞLULAR': {
            sections: [
                {
                    title: 'Tuşlular Kategorisi Anasayfa',
                    items: ['Eğitim Klavyeleri & Orglar', 'Ritmli Klavyeler', 'Synthesizer', 'Midi Klavyeler', 'Mini Orglar', 'Launchpad\'ler', 'Hammond Orglar']
                },
                {
                    title: 'Groovebox & Modüler Synthesizer',
                    items: ['Akordiyonlar', 'Pedallar', 'Standlar', 'Taşıma Çantaları', 'Kablolar', 'Tabureler', 'Aksesuarlar']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'AMFİ & PEDAL': {
            sections: [
                {
                    title: 'Amfi & Pedal Kategorisi Anasayfa',
                    items: ['Elektro Gitar Amfileri', 'Bas Gitar Amfileri', 'Akustik Gitar Amfileri', 'Amfi Parçaları', 'Amfi Aksesuarları', 'Efekt Pedalları', 'Efekt Prosesörleri']
                },
                {
                    title: 'Pedal & Prosesör Aksesuarları',
                    items: ['Pedal Board\'lar', 'Pedal Güç Kaynakları', 'Pedal Kabloları', 'Footswitch\'ler', 'Expression Pedalları', 'Tuner Pedalları']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'YAYLILAR': {
            sections: [
                {
                    title: 'Yaylılar Kategorisi Anasayfa',
                    items: ['Kemanlar', 'Viyolalar', 'Çellolar', 'Kontrabaslar', 'Yaylar / Arşeler', 'Teller', 'Yaylı Parçaları']
                },
                {
                    title: 'Aksesuarlar',
                    items: ['Yaylı Kılıfları', 'Omuz Yastıkları', 'Çene Dayamalar', 'Rozan & Reçine', 'Mute\'lar', 'Yaylı Standları']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'NEFESLİLER': {
            sections: [
                {
                    title: 'Nefesliler Kategorisi Anasayfa',
                    items: ['Klarnetler', 'Yan Flütler', 'Saksafonlar', 'Mızıkalar', 'Trompetler', 'Trombonlar', 'Dijital Nefesli Enstrümanlar']
                },
                {
                    title: 'Melodikalar',
                    items: ['Kornolar', 'Tubalar', 'Obualar', 'Fagotlar', 'Marching Brass', 'Kornetler', 'Flugelhorn']
                },
                {
                    title: 'Suzafonlar',
                    items: ['Blok Flütler', 'Pikololar', 'Aksesuarlar']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'DAVUL & PERKÜSYON': {
            sections: [
                {
                    title: 'Davul & Perküsyon Anasayfa',
                    items: ['Akustik Davullar', 'Akustik Davul Aksesuarları', 'Elektronik Davullar', 'Elektronik Davul Aksesuarları', 'Orff Çalgıları', 'Perküsyonlar', 'Perküsyon Aksesuarları']
                },
                {
                    title: 'Aksamlar',
                    items: ['Ziller', 'Bagetler', 'Malet & Beaterlar', 'Deriler', 'Çalışma Pedleri', 'Bando Davulları', 'Konser Perküsyonları']
                },
                {
                    title: 'Kılıf & Taşıma Çantaları',
                    items: ['Temizlik & Bakım Ürünleri', 'Ses Terapisi ve Meditasyon']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'STÜDYO & DJ': {
            sections: [
                {
                    title: 'Stüdyo & DJ Anasayfa',
                    items: ['Ses Kartları', 'Monitör Hoparlörler', 'Midi Klavyeler', 'Monitör & DJ Kulaklıklar', 'Stüdyo Mikrofonları', 'Bluetooth Kulaklıklar', 'USB Mikrofonlar']
                },
                {
                    title: 'DJ Mikser',
                    items: ['DJ Turntable', 'DJ Controller', 'Groovebox & Modüler Synth', 'Launchpad\'ler', 'Hazır Stüdyo Paketleri', 'Kayıt Cihazları', 'Kontrol Arayüzleri']
                },
                {
                    title: 'Mikrofon Aksesuarları',
                    items: ['Podcast Uyumlu Ürünler', 'In-ear Monitörler', 'Telsiz Mikrofonlar', 'Mikrofon ve Monitör Kabloları', 'Stüdyo & Dj Standları', 'Stüdyo Monitör Stand ve İzolatörleri']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'SESLENDIRME': {
            sections: [
                {
                    title: 'Seslendirme Anasayfa',
                    items: ['Aktif Hoparlörler', 'Pasif Hoparlörler', 'Zayıf Akım Hoparlörler', 'Analog Mikserler', 'Dijital Mikserler', 'Power Mikserler', 'Sahne Mikrofonları']
                },
                {
                    title: 'Power Amfiler',
                    items: ['DI Box', 'Kablolar', 'Sehpa & Standlar', 'In-ear Monitörler', 'Telsiz Mikrofonlar']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'HI-FI': {
            sections: [
                {
                    title: 'Hi-Fi Kategorisi Anasayfa',
                    items: ['Aktif Hoparlörler', 'Pasif Hoparlörler', 'Pikap\'lar', 'Hi-Fi Amfiler', 'Subwoofer', 'Streamer ve Network Çalıcılar', 'Soundbarlar']
                },
                {
                    title: 'Bluetooth Kulaklıklar',
                    items: ['Kablo & Hi-Fi Aksesuarları', 'Plakçalar Aksesuarları', 'Hoparlör Standları']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'AKSESUARLAR': {
            sections: [
                {
                    title: 'Aksesuarlar Kategorisi Anasayfa',
                    items: ['Sehpa & Standlar', 'Kablolar', 'Akort Aletleri', 'Metronomlar', 'Teller', 'Kılıf & Taşıma Çantaları', 'Temizlik & Bakım Ürünleri']
                },
                {
                    title: 'Sırt Çantaları',
                    items: ['Metoda', 'Dergi & Magazin', 'T-Shirt', 'Fincan & Mug', 'Müzikal Hediye Ürünleri', 'Saz & Bağlama Telleri']
                }
            ],
            featured: {
                title: 'ÇOK SATAN ÜRÜNLER',
                items: ['TANITIM VIDEOLARI', 'İNDİRİMLİ ÜRÜNLER']
            }
        },
        'OUTLET': {
            sections: [
                {
                    title: 'Outlet Kategorisi',
                    items: ['İndirimli Ürünler', 'Sergi Ürünleri', 'Son Model Ürünler', 'Kampanyalı Ürünler']
                }
            ],
            featured: {
                title: 'OUTLET FIRSATLARI',
                items: ['BÜYÜK İNDİRİMLER', 'SERGİ ÜRÜNLERİ']
            }
        }
    };

    // Navigation handlers
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        router.push(href);
    };

    const handleCategoryHover = (categoryName: string | null) => {
        if (categoryHoverTimeoutRef.current) {
            clearTimeout(categoryHoverTimeoutRef.current);
            categoryHoverTimeoutRef.current = null;
        }

        if (categoryName) {
            // Add delay before opening dropdown to prevent accidental activation
            categoryHoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(categoryName);
            }, 300); // 300ms delay before opening
        } else {
            categoryHoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(null);
            }, 200); // Reduced from 1000ms to 200ms for quick closing
        }
    };

    const handleCartHover = (isHovering: boolean) => {
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
            cartHoverTimeoutRef.current = null;
        }

        if (isHovering) {
            cartHoverTimeoutRef.current = setTimeout(() => {
                setIsCartOpen(true);
            }, 500); // 500ms delay before opening
        } else {
            cartHoverTimeoutRef.current = setTimeout(() => {
                setIsCartOpen(false);
            }, 1200); // 1200ms delay before closing
        }
    };

    const handleFavoritesHover = (isHovering: boolean) => {
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
            favoritesHoverTimeoutRef.current = null;
        }

        if (isHovering) {
            favoritesHoverTimeoutRef.current = setTimeout(() => {
                setIsFavoritesOpen(true);
            }, 500); // 500ms delay before opening
        } else {
            favoritesHoverTimeoutRef.current = setTimeout(() => {
                setIsFavoritesOpen(false);
            }, 1200); // 1200ms delay before closing
        }
    };

    const handleNotificationsHover = (isHovering: boolean) => {
        if (notificationsHoverTimeoutRef.current) {
            clearTimeout(notificationsHoverTimeoutRef.current);
            notificationsHoverTimeoutRef.current = null;
        }

        if (isHovering) {
            notificationsHoverTimeoutRef.current = setTimeout(() => {
                setIsNotificationsOpen(true);
            }, 500); // 500ms delay before opening
        } else {
            notificationsHoverTimeoutRef.current = setTimeout(() => {
                setIsNotificationsOpen(false);
            }, 1200); // 1200ms delay before closing
        }
    };

    // Manual close handlers to clear timeouts
    const handleCartClose = () => {
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
            cartHoverTimeoutRef.current = null;
        }
        setIsCartOpen(false);
    };

    const handleFavoritesClose = () => {
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
            favoritesHoverTimeoutRef.current = null;
        }
        setIsFavoritesOpen(false);
    };

    const handleNotificationsClose = () => {
        if (notificationsHoverTimeoutRef.current) {
            clearTimeout(notificationsHoverTimeoutRef.current);
            notificationsHoverTimeoutRef.current = null;
        }
        setIsNotificationsOpen(false);
    };

    return (
        <>
            {/* Promotional Top Bar - DoReMusic Style */}
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white py-2 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between text-sm">
                        {/* Left side promotional icons */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Gift className="h-4 w-4" />
                                <span className="font-semibold">Sepette Ek İndirim Kodu:</span>
                                <span className="bg-white text-red-600 px-2 py-1 rounded font-bold">JAXO2025</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>Binlerce Üründe</span>
                                <span className="font-semibold">Vade Farksız 3 Taksit</span>
                            </div>
                        </div>

                        {/* Right side partner logos */}
                        <div className="hidden lg:flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-3">
                                <span>🏛️ Garanti BBVA</span>
                                <span>💳 AXESS</span>
                                <span>🌍 WORLD</span>
                                <span>📱 maximum</span>
                                <span>🏦 Ziraat Bankası</span>
                                <span>🏢 HALKBANK</span>
                                <span>💼 QNB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Info Bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-2 px-4 hidden md:block">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-6">
                            <Link href="/about" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Hakkımızda</Link>
                            <Link href="/products" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Ürünler</Link>
                            <Link href="/brands" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Markalar</Link>
                            <Link href="/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</Link>
                            <Link href="/admin" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Admin Dashboard</Link>
                            <Link href="/installment" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Sipariş Takibi</Link>
                            <Link href="/contact" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">İletişim</Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>08509557777</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - DoReMusic Style */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center cursor-pointer group relative flex-shrink-0">
                            <div className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                                jaxophone
                            </div>
                            <div className="absolute -bottom-1 sm:-bottom-2 -right-2 sm:-right-4 text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors duration-300 tracking-wide">
                                Music Shop
                            </div>
                        </Link>

                        {/* Center Search */}
                        <div className="flex-1 max-w-2xl mx-4 sm:mx-8 hidden md:block">
                            <div className="relative">
                                <SearchInput
                                    placeholder="Aramak istediğiniz ürünü yazın"
                                    className="w-full"
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 rounded-lg"
                                >
                                    <Search className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                            {/* User Account - Hidden on small mobile */}
                            <Link
                                href={isAuthenticated ? "/account" : "/login"}
                                className="hidden sm:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick(isAuthenticated ? "/account" : "/login", e)}
                            >
                                <User className="h-5 w-5" />
                                <div className="hidden lg:block text-sm">
                                    <div className="font-medium">
                                        {isAuthenticated ? (user?.displayName || user?.email?.split('@')[0] || "Kullanıcı") : "Giriş Yap"}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {isAuthenticated ? "Hesabım" : "veya Üye Ol"}
                                    </div>
                                </div>
                            </Link>

                            {/* Notifications - Show on mobile */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleNotificationsHover(true)}
                                onMouseLeave={() => handleNotificationsHover(false)}
                            >
                                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
                                {isAuthenticated && unreadCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-amber-600 border-white dark:border-gray-900 flex items-center justify-center">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Favorites - Show on mobile */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleFavoritesHover(true)}
                                onMouseLeave={() => handleFavoritesHover(false)}
                            >
                                <Heart className={`h-5 w-5 transition-colors ${favoritesCount > 0 ? 'text-red-500 fill-current' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'}`} />
                                {favoritesCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 border-white dark:border-gray-900 flex items-center justify-center">
                                        {favoritesCount}
                                    </Badge>
                                )}
                            </div>

                            {/* Shopping Cart */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleCartHover(true)}
                                onMouseLeave={() => handleCartHover(false)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" />
                                        {cartItemCount > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-amber-600 border-white dark:border-gray-900 flex items-center justify-center">
                                                {cartItemCount}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="hidden lg:block text-sm">
                                        <div className="font-medium text-gray-900 dark:text-white">Alışveriş</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Sepetim</div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden ml-2 sm:ml-0"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Horizontal Category Navigation - DoReMusic Style */}
            <nav className="bg-gray-900 text-white sticky top-20 z-40 hidden lg:block">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center">
                        {mainCategories.map((category) => (
                            <div
                                key={category.name}
                                className="relative group"
                                onMouseEnter={() => handleCategoryHover(category.name)}
                                onMouseLeave={() => handleCategoryHover(null)}
                            >
                                <Link
                                    href={category.href}
                                    className={`block px-4 py-4 text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap relative overflow-hidden
                                        ${hoveredCategory === category.name
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'hover:bg-gray-800 hover:text-amber-300 text-gray-100'
                                        }`}
                                    onClick={(e) => handleNavClick(category.href, e)}
                                >
                                    <span className="relative z-10">{category.name}</span>
                                    {/* Elegant hover background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    {/* Bottom border effect */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </Link>

                                {/* Mega Menu Dropdown - Individual positioning for each category */}
                                {hoveredCategory === category.name && megaMenuCategories[category.name] && (
                                    <div
                                        className="absolute top-full bg-white text-gray-900 shadow-2xl z-50 border-t-4 border-blue-600 animate-fade-in dropdown-hover"
                                        onMouseEnter={() => handleCategoryHover(category.name)}
                                        onMouseLeave={() => handleCategoryHover(null)}
                                        style={{
                                            left: category.name === 'PİYANOLAR' || category.name === 'TUŞLULAR' ? '0px' :
                                                category.name === 'OUTLET' || category.name === 'AKSESUARLAR' || category.name === 'HI-FI' || category.name === 'SESLENDIRME' ? '-800px' :
                                                    '-300px',
                                            width: '1000px'
                                        }}
                                    >
                                        <div className="p-8">
                                            <div className="grid grid-cols-12 gap-8">
                                                {/* Category Sections */}
                                                <div className="col-span-9">
                                                    <div className="grid grid-cols-3 gap-8">
                                                        {megaMenuCategories[category.name].sections.map((section, index) => (
                                                            <div key={index}>
                                                                <h3 className="font-bold text-gray-900 mb-4 border-b-2 border-amber-200 pb-2 text-base">
                                                                    {section.title}
                                                                </h3>
                                                                <ul className="space-y-3">
                                                                    {section.items.map((item, itemIndex) => (
                                                                        <li key={itemIndex}>
                                                                            <Link
                                                                                href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                                                                                className="text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 cursor-pointer block py-1 px-2 rounded-md whitespace-nowrap"
                                                                                onClick={(e) => handleNavClick(`/products?category=${item.toLowerCase().replace(' ', '-')}`, e)}
                                                                            >
                                                                                {item}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Featured Section */}
                                                <div className="col-span-3 bg-gradient-to-br from-gray-50 to-amber-50 p-4 rounded-xl border border-amber-100">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <Gift className="h-5 w-5 text-amber-600" />
                                                        <h3 className="font-semibold text-gray-900 text-sm">{megaMenuCategories[category.name].featured.title}</h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {megaMenuCategories[category.name].featured.items.map((item, index) => (
                                                            <div key={index} className="flex items-center space-x-2 text-xs bg-white p-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                                                                <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                    {index === 0 ? '📹' : index === 1 ? '🎬' : '🏷️'}
                                                                </div>
                                                                <span className="text-gray-700 font-medium text-xs leading-tight">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-4 space-y-3">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <SearchInput
                                placeholder="Ürün ara..."
                                className="w-full"
                            />
                        </div>

                        {/* Mobile User Account - Show in mobile menu */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                            <Link
                                href={isAuthenticated ? "/account" : "/login"}
                                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                onClick={(e) => {
                                    handleNavClick(isAuthenticated ? "/account" : "/login", e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <User className="h-5 w-5" />
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {isAuthenticated ? (user?.displayName || user?.email?.split('@')[0] || "Kullanıcı") : "Giriş Yap"}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {isAuthenticated ? "Hesabım" : "veya Üye Ol"}
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Mobile Categories */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Kategoriler</h3>
                            {mainCategories.slice(0, 6).map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                    onClick={(e) => {
                                        handleNavClick(category.href, e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Additional mobile links */}
                        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Sayfalar</h3>
                            <Link
                                href="/about"
                                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                onClick={(e) => {
                                    handleNavClick('/about', e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Hakkımızda
                            </Link>

                            <Link
                                href="/products"
                                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                onClick={(e) => {
                                    handleNavClick('/products', e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Ürünler
                            </Link>

                            <Link
                                href="/contact"
                                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                onClick={(e) => {
                                    handleNavClick('/contact', e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                İletişim
                            </Link>

                            <Link
                                href="/blog"
                                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                onClick={(e) => {
                                    handleNavClick('/blog', e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Blog
                            </Link>

                            <Link
                                href="/installment"
                                className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer rounded-md"
                                onClick={(e) => {
                                    handleNavClick('/installment', e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Sipariş Takibi
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebars */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={handleCartClose}
                onMouseEnter={() => handleCartHover(true)}
                onMouseLeave={() => handleCartHover(false)}
            />

            <FavoritesSidebar
                isOpen={isFavoritesOpen}
                onClose={handleFavoritesClose}
                onMouseEnter={() => handleFavoritesHover(true)}
                onMouseLeave={() => handleFavoritesHover(false)}
            />

            <NotificationsSidebar
                isOpen={isNotificationsOpen}
                onClose={handleNotificationsClose}
                onMouseEnter={() => handleNotificationsHover(true)}
                onMouseLeave={() => handleNotificationsHover(false)}
            />
        </>
    );
} 