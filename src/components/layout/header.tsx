'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLoading } from '@/components/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Bell, Gift, ChevronDown } from 'lucide-react';
import { CartSidebar } from './cart-sidebar';
import { FavoritesSidebar } from './favorites-sidebar';
import { SearchInput } from '@/components/search/search-input';

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const cartHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const favoritesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const categoryHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cartItemCount = useAppSelector((state) => state.cart.itemCount);
    const favoritesCount = useAppSelector((state) => state.favorites.items.length);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const { setLoading } = useLoading();
    const router = useRouter();

    // Main categories for horizontal navigation (DoReMusic style)
    const mainCategories = [
        { name: 'PİYANOLAR', href: '/products?category=piano', active: false },
        { name: 'TUŞLULAR', href: '/products?category=keyboard', active: false },
        { name: 'GİTARLAR', href: '/products?category=guitar', active: true },
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
            setHoveredCategory(categoryName);
        } else {
            categoryHoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(null);
            }, 150);
        }
    };

    const handleCartHover = (isHovering: boolean) => {
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
        }

        if (isHovering) {
            setIsCartOpen(true);
        } else {
            cartHoverTimeoutRef.current = setTimeout(() => {
                setIsCartOpen(false);
            }, 300);
        }
    };

    const handleFavoritesHover = (isHovering: boolean) => {
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
        }

        if (isHovering) {
            setIsFavoritesOpen(true);
        } else {
            favoritesHoverTimeoutRef.current = setTimeout(() => {
                setIsFavoritesOpen(false);
            }, 300);
        }
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
            <div className="bg-white border-b border-gray-100 py-2 px-4 hidden md:block">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-6">
                            <Link href="/about" className="hover:text-amber-600 transition-colors">Hakkımızda</Link>
                            <Link href="/blog" className="hover:text-amber-600 transition-colors">Blog</Link>
                            <Link href="/stores" className="hover:text-amber-600 transition-colors">Mağazalar</Link>
                            <Link href="/installment" className="hover:text-amber-600 transition-colors">Sipariş Takibi</Link>
                            <Link href="/contact" className="hover:text-amber-600 transition-colors">İletişim</Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>08509557777</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - DoReMusic Style */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center cursor-pointer group">
                            <div className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                                jaxophone
                            </div>
                        </Link>

                        {/* Center Search */}
                        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
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
                        <div className="flex items-center space-x-6">
                            {/* User Account */}
                            <Link
                                href={isAuthenticated ? "/account" : "/login"}
                                className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick(isAuthenticated ? "/account" : "/login", e)}
                            >
                                <User className="h-5 w-5" />
                                <div className="hidden lg:block text-sm">
                                    <div className="font-medium">
                                        {isAuthenticated ? "Hesabım" : "Giriş Yap"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {isAuthenticated ? "Hoş geldin!" : "veya Üye Ol"}
                                    </div>
                                </div>
                            </Link>

                            {/* Notifications */}
                            <div className="relative">
                                <Bell className="h-5 w-5 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer" />
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-amber-600 border-white flex items-center justify-center">
                                    1
                                </Badge>
                            </div>

                            {/* Favorites */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleFavoritesHover(true)}
                                onMouseLeave={() => handleFavoritesHover(false)}
                            >
                                <Heart className={`h-5 w-5 transition-colors ${favoritesCount > 0 ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-red-500'}`} />
                                {favoritesCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-red-500 border-white flex items-center justify-center">
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
                                        <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-amber-600 transition-colors" />
                                        {cartItemCount > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-amber-600 border-white flex items-center justify-center">
                                                {cartItemCount}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="hidden lg:block text-sm">
                                        <div className="font-medium text-gray-900">Alışveriş</div>
                                        <div className="text-xs text-gray-500">Sepetim</div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Horizontal Category Navigation - DoReMusic Style */}
            <nav className="bg-gray-900 text-white sticky top-20 z-40 hidden lg:block">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center">
                        {mainCategories.map((category) => (
                            <div
                                key={category.name}
                                className="relative group"
                                onMouseEnter={() => handleCategoryHover(category.name)}
                                onMouseLeave={() => handleCategoryHover(null)}
                            >
                                <Link
                                    href={category.href}
                                    className={`block px-4 py-3 text-sm font-medium transition-colors cursor-pointer
                                        ${category.active
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-800 hover:text-amber-300'
                                        }`}
                                    onClick={(e) => handleNavClick(category.href, e)}
                                >
                                    {category.name}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {hoveredCategory === category.name && megaMenuCategories[category.name] && (
                                    <div
                                        className="absolute top-full left-0 w-screen max-w-6xl bg-white text-gray-900 shadow-xl z-50 border-t-2 border-blue-600"
                                        onMouseEnter={() => handleCategoryHover(category.name)}
                                        onMouseLeave={() => handleCategoryHover(null)}
                                    >
                                        <div className="p-6">
                                            <div className="grid grid-cols-12 gap-6">
                                                {/* Category Sections */}
                                                <div className="col-span-9">
                                                    <div className="grid grid-cols-3 gap-6">
                                                        {megaMenuCategories[category.name].sections.map((section, index) => (
                                                            <div key={index}>
                                                                <h3 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                                                                    {section.title}
                                                                </h3>
                                                                <ul className="space-y-2">
                                                                    {section.items.map((item, itemIndex) => (
                                                                        <li key={itemIndex}>
                                                                            <Link
                                                                                href={`/products?category=${item.toLowerCase().replace(' ', '-')}`}
                                                                                className="text-sm text-gray-600 hover:text-amber-600 transition-colors cursor-pointer block whitespace-nowrap"
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
                                                <div className="col-span-3 bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <Gift className="h-5 w-5 text-amber-600" />
                                                        <h3 className="font-semibold text-gray-900">{megaMenuCategories[category.name].featured.title}</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {megaMenuCategories[category.name].featured.items.map((item, index) => (
                                                            <div key={index} className="flex items-center space-x-2 text-sm">
                                                                <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center">
                                                                    {index === 0 ? '📹' : index === 1 ? '🎬' : '🏷️'}
                                                                </div>
                                                                <span className="text-gray-700 whitespace-nowrap">{item}</span>
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
                <div className="lg:hidden bg-white border-b border-gray-200">
                    <div className="px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <SearchInput
                                placeholder="Ürün ara..."
                                className="w-full"
                            />
                        </div>

                        {/* Mobile Categories */}
                        {mainCategories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="block py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
                                onClick={(e) => {
                                    handleNavClick(category.href, e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {category.name}
                            </Link>
                        ))}

                        {/* Additional mobile links */}
                        <Link
                            href="/about"
                            className="block py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer border-t border-gray-200 pt-4"
                            onClick={(e) => {
                                handleNavClick('/about', e);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Hakkımızda
                        </Link>
                    </div>
                </div>
            )}

            {/* Sidebars */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onMouseEnter={() => handleCartHover(true)}
                onMouseLeave={() => handleCartHover(false)}
            />

            <FavoritesSidebar
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
                onMouseEnter={() => handleFavoritesHover(true)}
                onMouseLeave={() => handleFavoritesHover(false)}
            />
        </>
    );
} 