'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLoading } from '@/components/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, MapPin, Clock, Truck, Shield, ChevronDown, Bell, Gift } from 'lucide-react';
import { CartSidebar } from './cart-sidebar';
import { FavoritesSidebar } from './favorites-sidebar';
import { SearchInput } from '@/components/search/search-input';

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const cartHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const favoritesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cartItemCount = useAppSelector((state) => state.cart.itemCount);
    const favoritesCount = useAppSelector((state) => state.favorites.items.length);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const { setLoading } = useLoading();
    const router = useRouter();

    // Categories for mega menu
    const categories = [
        {
            name: 'Gitarlar',
            href: '/categories/guitars',
            subcategories: ['Elektro Gitar', 'Akustik Gitar', 'Klasik Gitar', 'Bass Gitar']
        },
        {
            name: 'Piyanolar',
            href: '/categories/pianos',
            subcategories: ['Dijital Piyano', 'Akustik Piyano', 'Klavye', 'Synthesizer']
        },
        {
            name: 'Davullar',
            href: '/categories/drums',
            subcategories: ['Akustik Davul', 'Elektronik Davul', 'Percussion', 'Davul Parçaları']
        },
        {
            name: 'Üflemeli',
            href: '/categories/wind',
            subcategories: ['Saksafon', 'Flüt', 'Klarnet', 'Trompet']
        }
    ];

    // Navigation link click handler with manual routing
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();

        // Same page check
        const currentPath = window.location.pathname;
        if (currentPath === href) {
            // Close sidebars for same page clicks
            setIsMobileMenuOpen(false);
            setIsCartOpen(false);
            setIsFavoritesOpen(false);
            return;
        }

        // Sidebar'ları hemen kapat
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
        setIsFavoritesOpen(false);

        // Loading'i başlat ve hemen navigate et
        setLoading(true, true);

        // Navigate işlemini bir sonraki tick'te yap (smooth transition için)
        setTimeout(() => {
            router.push(href);
        }, 10); // Minimal delay for smooth transition
    };

    // Mobile menu handlers
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Close other sidebars when opening mobile menu
        if (!isMobileMenuOpen) {
            setIsCartOpen(false);
            setIsFavoritesOpen(false);
        }
    };

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    // Mobile search handlers
    const handleMobileSearchToggle = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
    };

    const handleMobileSearchClose = () => {
        setIsMobileSearchOpen(false);
    };

    // Cart hover handlers
    const handleCartMouseEnter = () => {
        // Clear any existing timeout
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
            cartHoverTimeoutRef.current = null;
        }
        // Close favorites if open
        setIsFavoritesOpen(false);
        setIsCartOpen(true);
    };

    const handleCartMouseLeave = () => {
        // Set timeout to close cart sidebar after delay
        cartHoverTimeoutRef.current = setTimeout(() => {
            setIsCartOpen(false);
        }, 300); // 300ms delay
    };

    const handleCartSidebarMouseEnter = () => {
        // Clear timeout when entering cart sidebar
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
            cartHoverTimeoutRef.current = null;
        }
    };

    const handleCartSidebarMouseLeave = () => {
        // Close sidebar when leaving it
        setIsCartOpen(false);
    };

    const handleCartClose = () => {
        // Clear any timeouts and close
        if (cartHoverTimeoutRef.current) {
            clearTimeout(cartHoverTimeoutRef.current);
            cartHoverTimeoutRef.current = null;
        }
        setIsCartOpen(false);
    };

    // Favorites hover handlers
    const handleFavoritesMouseEnter = () => {
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
            favoritesHoverTimeoutRef.current = null;
        }
        setIsCartOpen(false);
        setIsFavoritesOpen(true);
    };

    const handleFavoritesMouseLeave = () => {
        favoritesHoverTimeoutRef.current = setTimeout(() => {
            setIsFavoritesOpen(false);
        }, 300);
    };

    const handleFavoritesSidebarMouseEnter = () => {
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
            favoritesHoverTimeoutRef.current = null;
        }
    };

    const handleFavoritesSidebarMouseLeave = () => {
        // Close sidebar when leaving it
        setIsFavoritesOpen(false);
    };

    const handleFavoritesClose = () => {
        // Clear any timeouts and close
        if (favoritesHoverTimeoutRef.current) {
            clearTimeout(favoritesHoverTimeoutRef.current);
            favoritesHoverTimeoutRef.current = null;
        }
        setIsFavoritesOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 items-center justify-between">
                        {/* Left Side - Contact Info */}
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="font-medium">0212 555 0123</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>İstanbul, Beyoğlu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Pzt-Cmt 09:00-22:00</span>
                            </div>
                        </div>

                        {/* Center - Promotions */}
                        <div className="flex items-center gap-2 animate-gentle-float">
                            <Gift className="h-4 w-4" />
                            <span className="font-semibold">Ücretsiz Kargo - 500₺ Üzeri Alışverişlerde!</span>
                        </div>

                        {/* Right Side - Account Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center gap-2">
                                <Truck className="h-3.5 w-3.5" />
                                <span>Hızlı Teslimat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5" />
                                <span>Güvenli Alışveriş</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-elegant">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center group flex-shrink-0 cursor-pointer"
                            onClick={(e) => handleNavClick('/', e)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-gold animate-gentle-float">
                                    J
                                </div>
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                                        Jaxophone
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium tracking-wider">
                                        MUSIC STORE
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Navigation with Mega Menu */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                                onClick={(e) => handleNavClick('/', e)}
                            >
                                Ana Sayfa
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            {/* Categories with Mega Menu */}
                            <div
                                className="relative group"
                                onMouseEnter={() => setHoveredCategory('categories')}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <button className="flex items-center gap-1 text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer relative">
                                    Kategoriler
                                    <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                                </button>

                                {/* Mega Menu */}
                                {hoveredCategory === 'categories' && (
                                    <div className="absolute top-full left-0 w-96 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-elegant-xl p-6 animate-scale-in">
                                        <div className="grid grid-cols-1 gap-4">
                                            {categories.map((category) => (
                                                <div key={category.name} className="group">
                                                    <Link
                                                        href={category.href}
                                                        className="block font-semibold text-gray-800 hover:text-amber-600 transition-colors duration-300 mb-2 cursor-pointer"
                                                        onClick={(e) => handleNavClick(category.href, e)}
                                                    >
                                                        {category.name}
                                                    </Link>
                                                    <div className="grid grid-cols-2 gap-2 pl-3">
                                                        {category.subcategories.map((sub) => (
                                                            <Link
                                                                key={sub}
                                                                href={`${category.href}/${sub.toLowerCase().replace(' ', '-')}`}
                                                                className="text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                                                onClick={(e) => handleNavClick(`${category.href}/${sub.toLowerCase().replace(' ', '-')}`, e)}
                                                            >
                                                                {sub}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <Link
                                                href="/categories"
                                                className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors duration-300 cursor-pointer"
                                                onClick={(e) => handleNavClick('/categories', e)}
                                            >
                                                Tüm Kategoriler
                                                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/products"
                                className="text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                                onClick={(e) => handleNavClick('/products', e)}
                            >
                                Ürünler
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link
                                href="/brands"
                                className="text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                                onClick={(e) => handleNavClick('/brands', e)}
                            >
                                Markalar
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-amber-600 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer relative group"
                                onClick={(e) => handleNavClick('/about', e)}
                            >
                                Hakkımızda
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>
                        </nav>

                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <SearchInput
                                    placeholder="Ne arıyorsunuz?"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 shadow-elegant"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Mobile Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer"
                                onClick={handleMobileSearchToggle}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Notifications */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer group"
                            >
                                <Bell className="h-5 w-5 group-hover:animate-gentle-float" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 hover:bg-red-600 border-white animate-elegant-pulse">
                                    3
                                </Badge>
                            </Button>

                            {/* Favorites with Enhanced Styling */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={handleFavoritesMouseEnter}
                                onMouseLeave={handleFavoritesMouseLeave}
                            >
                                <Button variant="ghost" size="icon" className="relative group hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                                    <Link
                                        href="/favorites"
                                        onClick={(e) => handleNavClick('/favorites', e)}
                                    >
                                        <Heart className="h-5 w-5 group-hover:scale-110 group-hover:fill-current transition-all duration-300" />
                                    </Link>
                                    {favoritesCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 hover:bg-red-600 border-white animate-elegant-pulse">
                                            {favoritesCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {/* Cart with Enhanced Styling */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={handleCartMouseEnter}
                                onMouseLeave={handleCartMouseLeave}
                            >
                                <Button variant="ghost" size="icon" className="relative group hover:bg-amber-50 hover:text-amber-600 transition-all duration-300">
                                    <Link
                                        href="/cart"
                                        onClick={(e) => handleNavClick('/cart', e)}
                                    >
                                        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                                    </Link>
                                    {cartItemCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-amber-500 hover:bg-amber-600 border-white animate-elegant-pulse">
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {/* User Account */}
                            <div className="relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                                >
                                    <Link
                                        href={isAuthenticated ? "/account" : "/login"}
                                        onClick={(e) => handleNavClick(isAuthenticated ? "/account" : "/login", e)}
                                    >
                                        <User className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                                    </Link>
                                </Button>

                                {/* User Dropdown Preview */}
                                <div className="absolute top-full right-0 w-48 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-elegant-lg p-3 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                                    <div className="text-sm text-gray-600 text-center">
                                        {isAuthenticated ? (
                                            <div className="space-y-2">
                                                <div className="font-semibold text-gray-800">Hesabım</div>
                                                <div className="text-amber-600">Profil ve Siparişler</div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="font-semibold text-gray-800">Giriş Yap</div>
                                                <div className="text-amber-600">Hesabına erişim sağla</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                                onClick={handleMobileMenuToggle}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6 rotate-90 transition-transform duration-300" />
                                ) : (
                                    <Menu className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 p-4 animate-slide-up">
                    <div className="relative">
                        <SearchInput
                            placeholder="Ne arıyorsunuz?"
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 shadow-elegant"
                            onResultClick={handleMobileSearchClose}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            )}

            {/* Mobile Navigation Menu */}
            <div className={`lg:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 shadow-elegant-lg">
                    {/* Mobile Categories */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 gradient-gold">Kategoriler</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                                    onClick={(e) => handleNavClick(category.href, e)}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-amber-600 font-bold text-sm">
                                            {category.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm group-hover:text-amber-600 transition-colors duration-300">
                                            {category.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {category.subcategories.length} alt kategori
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="px-6 py-4 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-600 font-semibold transition-all duration-300 cursor-pointer group"
                            onClick={(e) => handleNavClick('/', e)}
                        >
                            <div className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/products"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-600 font-semibold transition-all duration-300 cursor-pointer group"
                            onClick={(e) => handleNavClick('/products', e)}
                        >
                            <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            Tüm Ürünler
                        </Link>
                        <Link
                            href="/brands"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-600 font-semibold transition-all duration-300 cursor-pointer group"
                            onClick={(e) => handleNavClick('/brands', e)}
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            Markalar
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-600 font-semibold transition-all duration-300 cursor-pointer group"
                            onClick={(e) => handleNavClick('/about', e)}
                        >
                            <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            Hakkımızda
                        </Link>
                    </nav>

                    {/* Mobile Account Section */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        {isAuthenticated ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">Hoş geldiniz!</div>
                                        <div className="text-sm text-gray-600">Hesap detaylarınız</div>
                                    </div>
                                </div>
                                <Link
                                    href="/account"
                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-elegant hover:shadow-elegant-lg transition-all duration-300 cursor-pointer group"
                                    onClick={(e) => handleNavClick('/account', e)}
                                >
                                    <User className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Hesabım</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                                    onClick={(e) => handleNavClick('/login', e)}
                                >
                                    <User className="h-5 w-5" />
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-amber-600 text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-300 cursor-pointer"
                                    onClick={(e) => handleNavClick('/register', e)}
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={handleCartClose}
                onMouseEnter={handleCartSidebarMouseEnter}
                onMouseLeave={handleCartSidebarMouseLeave}
            />

            {/* Favorites Sidebar */}
            <FavoritesSidebar
                isOpen={isFavoritesOpen}
                onClose={handleFavoritesClose}
                onMouseEnter={handleFavoritesSidebarMouseEnter}
                onMouseLeave={handleFavoritesSidebarMouseLeave}
            />
        </>
    );
} 