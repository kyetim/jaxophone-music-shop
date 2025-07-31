'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLoading } from '@/components/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, MapPin, Clock, Truck, Shield, ChevronDown, Bell, Gift, Filter, TrendingUp, Star, Zap } from 'lucide-react';
import { CartSidebar } from './cart-sidebar';
import { FavoritesSidebar } from './favorites-sidebar';
import { SearchInput } from '@/components/search/search-input';


export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const cartHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const favoritesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const categoryHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cartItemCount = useAppSelector((state) => state.cart.itemCount);
    const favoritesCount = useAppSelector((state) => state.favorites.items.length);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const { setLoading } = useLoading();
    const router = useRouter();

    // Categories for mega menu
    const categories = [
        {
            name: 'Enstrümanlar',
            href: '/products?category=instruments',
            subcategories: [
                { name: 'Gitar', href: '/products?category=guitar' },
                { name: 'Piyano', href: '/products?category=piano' },
                { name: 'Davul', href: '/products?category=drums' },
                { name: 'Keman', href: '/products?category=violin' },
                { name: 'Flüt', href: '/products?category=flute' },
                { name: 'Saksafon', href: '/products?category=saxophone' }
            ]
        },
        {
            name: 'Aksesuarlar',
            href: '/products?category=accessories',
            subcategories: [
                { name: 'Kılıflar', href: '/products?category=cases' },
                { name: 'Teller', href: '/products?category=strings' },
                { name: 'Amfi', href: '/products?category=amplifiers' },
                { name: 'Metronom', href: '/products?category=metronome' }
            ]
        }
    ];

    // Popular search terms for the new search section
    const popularSearches = [
        'Elektro Gitar', 'Akustik Gitar', 'Dijital Piyano', 'Davul Seti',
        'Gitar Kılıfı', 'Piyano Pedalı', 'Saksafon', 'Keman Yayı'
    ];

    // Quick categories for search section
    const quickCategories = [
        { name: 'Gitarlar', icon: '🎸', href: '/products?category=guitar' },
        { name: 'Piyanolar', icon: '🎹', href: '/products?category=piano' },
        { name: 'Davullar', icon: '🥁', href: '/products?category=drums' },
        { name: 'Yaylılar', icon: '🎻', href: '/products?category=strings' },
        { name: 'Nefesliler', icon: '🎺', href: '/products?category=winds' },
        { name: 'Aksesuarlar', icon: '🎼', href: '/products?category=accessories' }
    ];

    // Navigation link click handler with manual routing
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        router.push(href);
    };

    // Mobile menu handlers
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchOpen) {
            setIsMobileSearchOpen(false);
        }
    };

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    // Mobile search handlers
    const handleMobileSearchToggle = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleMobileSearchClose = () => {
        setIsMobileSearchOpen(false);
    };

    // Cart hover handlers
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

    const handleCategoryHover = (categoryName: string | null) => {
        // Clear any existing timeout
        if (categoryHoverTimeoutRef.current) {
            clearTimeout(categoryHoverTimeoutRef.current);
            categoryHoverTimeoutRef.current = null;
        }

        if (categoryName) {
            // Immediately show the hovered category
            setHoveredCategory(categoryName);
        } else {
            // Delay hiding the category dropdown
            categoryHoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(null);
            }, 150); // 150ms delay before hiding
        }
    };

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 hover:text-amber-300 transition-colors cursor-pointer">
                                <Phone className="h-4 w-4" />
                                <span>+90 212 345 67 89</span>
                            </div>
                            <div className="flex items-center space-x-2 hover:text-amber-300 transition-colors cursor-pointer">
                                <MapPin className="h-4 w-4" />
                                <span>İstanbul, Türkiye</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-green-300">
                                <Truck className="h-4 w-4" />
                                <span>Ücretsiz Kargo (500₺ üzeri)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-300">
                                <Shield className="h-4 w-4" />
                                <span>Güvenli Alışveriş</span>
                            </div>
                            <div className="flex items-center space-x-2 text-amber-300">
                                <Clock className="h-4 w-4" />
                                <span>7/24 Destek</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-elegant z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 cursor-pointer group flex-shrink-0">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <span className="text-white font-bold text-lg">🎵</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-elegant-pulse">
                                    <Gift className="h-1.5 w-1.5 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                                    Jaxophone
                                </h1>
                                <p className="text-xs text-gray-500 -mt-1">Music Shop</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center max-w-2xl">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative group whitespace-nowrap"
                                onClick={(e) => handleNavClick('/', e)}
                            >
                                Ana Sayfa
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            {/* Categories with Mega Menu */}
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="relative group"
                                    onMouseEnter={() => handleCategoryHover(category.name)}
                                    onMouseLeave={() => handleCategoryHover(null)}
                                >
                                    <Link
                                        href={category.href}
                                        className="flex items-center text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative group whitespace-nowrap"
                                        onClick={(e) => handleNavClick(category.href, e)}
                                    >
                                        {category.name}
                                        <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
                                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                                    </Link>

                                    {/* Mega Menu */}
                                    {hoveredCategory === category.name && (
                                        <div
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-3 animate-fade-in z-[100]"
                                            onMouseEnter={() => handleCategoryHover(category.name)}
                                            onMouseLeave={() => handleCategoryHover(null)}
                                        >
                                            {category.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 cursor-pointer"
                                                    onClick={(e) => handleNavClick(sub.href, e)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link
                                href="/products"
                                className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative group whitespace-nowrap"
                                onClick={(e) => handleNavClick('/products', e)}
                            >
                                Ürünler
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative group whitespace-nowrap"
                                onClick={(e) => handleNavClick('/about', e)}
                            >
                                Hakkımızda
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            {/* Admin Link - Only on XL screens or wider for space */}
                            {(process.env.NODE_ENV === 'development' || true) && (
                                <Link
                                    href="/admin"
                                    className="hidden xl:flex text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:scale-105 cursor-pointer relative group whitespace-nowrap"
                                    onClick={(e) => handleNavClick('/admin', e)}
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-md font-medium">
                                            🔧
                                        </span>
                                    </span>
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></div>
                                </Link>
                            )}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {/* Mobile Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer"
                                onClick={handleMobileSearchToggle}
                            >
                                <Search className="h-4 w-4" />
                            </Button>

                            {/* Search Toggle for Desktop */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer"
                                onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
                                title={isSearchBarVisible ? 'Arama çubuğunu gizle' : 'Arama çubuğunu göster'}
                            >
                                <Search className="h-4 w-4" />
                            </Button>

                            {/* Notifications */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer group"
                            >
                                <Bell className="h-4 w-4 group-hover:animate-gentle-float" />
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 hover:bg-red-600 border-white animate-elegant-pulse flex items-center justify-center">
                                    3
                                </Badge>
                            </Button>

                            {/* Favorites with Enhanced Styling */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleFavoritesHover(true)}
                                onMouseLeave={() => handleFavoritesHover(false)}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer group"
                                >
                                    <Heart className={`h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-gentle-float ${favoritesCount > 0 ? 'text-red-500 fill-current' : ''}`} />
                                    {favoritesCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 hover:bg-red-600 border-white animate-elegant-pulse flex items-center justify-center">
                                            {favoritesCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {/* Cart with Enhanced Styling */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => handleCartHover(true)}
                                onMouseLeave={() => handleCartHover(false)}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 cursor-pointer group"
                                >
                                    <ShoppingCart className="h-4 w-4 group-hover:scale-110 group-hover:animate-gentle-float transition-all duration-300" />
                                    {cartItemCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-amber-500 hover:bg-amber-600 border-white animate-elegant-pulse flex items-center justify-center">
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {/* User Account */}
                            <div className="hidden sm:block relative group cursor-pointer">
                                <Link
                                    href={isAuthenticated ? "/account" : "/login"}
                                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    onClick={(e) => handleNavClick(isAuthenticated ? "/account" : "/login", e)}
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                                        <User className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="hidden lg:block">
                                        {isAuthenticated ? (
                                            <div className="space-y-0">
                                                <div className="text-sm font-semibold text-gray-800">Hesabım</div>
                                                <div className="text-xs text-amber-600">Hoş geldin!</div>
                                            </div>
                                        ) : (
                                            <div className="space-y-0">
                                                <div className="text-sm font-semibold text-gray-800">Giriş Yap</div>
                                                <div className="text-xs text-amber-600">Hesaba erişim</div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                                onClick={handleMobileMenuToggle}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5 rotate-90 transition-transform duration-300" />
                                ) : (
                                    <Menu className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Search Section */}
            {isSearchBarVisible && (
                <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            {/* Main Search Area */}
                            <div className="lg:col-span-8">
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Search className="h-5 w-5 text-amber-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Ne arıyorsunuz?</h3>
                                        <div className="flex items-center gap-1 text-amber-600">
                                            <Zap className="h-4 w-4" />
                                            <span className="text-sm font-medium">Hızlı Arama</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <SearchInput
                                            placeholder="Enstrüman, marka, model ara... (örn: Yamaha elektro gitar)"
                                            className="w-full"
                                        />

                                        {/* Quick Category Filters */}
                                        <div className="flex items-center gap-1 mt-3">
                                            <Filter className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600 mr-2">Hızlı Kategoriler:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {quickCategories.map((cat) => (
                                                    <Link
                                                        key={cat.name}
                                                        href={cat.href}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 cursor-pointer group"
                                                        onClick={(e) => handleNavClick(cat.href, e)}
                                                    >
                                                        <span className="group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Popular Searches & Trends */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <h4 className="font-semibold text-gray-900">Popüler Aramalar</h4>
                                        <Star className="h-4 w-4 text-amber-500" />
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {popularSearches.map((search, index) => (
                                            <Link
                                                key={index}
                                                href={`/products?search=${encodeURIComponent(search)}`}
                                                className="inline-block px-2 py-1 text-xs bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 rounded-md transition-all duration-300 cursor-pointer"
                                                onClick={(e) => handleNavClick(`/products?search=${encodeURIComponent(search)}`, e)}
                                            >
                                                {search}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Special Offers */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <Gift className="h-4 w-4" />
                                            <span className="font-medium">Özel Fırsatlar</span>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            %20 indirim + ücretsiz kargo
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Search Bar */}
            {isMobileSearchOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 p-4 animate-slide-up">
                    <SearchInput
                        placeholder="Ne arıyorsunuz?"
                        className="w-full"
                        onResultClick={handleMobileSearchClose}
                    />
                </div>
            )}

            {/* Mobile Navigation Menu */}
            <div className={`lg:hidden transition-all duration-500 ease-in-out 
                ${isMobileMenuOpen
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }
            `}>
                <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-4">
                    <Link
                        href="/"
                        className="block text-gray-700 hover:text-amber-600 font-medium py-2 cursor-pointer"
                        onClick={(e) => {
                            handleNavClick('/', e);
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Ana Sayfa
                    </Link>

                    {categories.map((category) => (
                        <div key={category.name} className="space-y-2">
                            <Link
                                href={category.href}
                                className="block text-gray-700 hover:text-amber-600 font-medium py-2 cursor-pointer"
                                onClick={(e) => {
                                    handleNavClick(category.href, e);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {category.name}
                            </Link>
                            <div className="pl-4 space-y-1">
                                {category.subcategories.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className="block text-gray-600 hover:text-amber-600 py-1 text-sm cursor-pointer"
                                        onClick={(e) => {
                                            handleNavClick(sub.href, e);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/products"
                        className="block text-gray-700 hover:text-amber-600 font-medium py-2 cursor-pointer"
                        onClick={(e) => {
                            handleNavClick('/products', e);
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Ürünler
                    </Link>

                    <Link
                        href="/about"
                        className="block text-gray-700 hover:text-amber-600 font-medium py-2 cursor-pointer"
                        onClick={(e) => {
                            handleNavClick('/about', e);
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        Hakkımızda
                    </Link>

                    {/* Mobile User Actions */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <Link
                            href={isAuthenticated ? "/account" : "/login"}
                            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
                            onClick={(e) => {
                                handleNavClick(isAuthenticated ? "/account" : "/login", e);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <span className="text-gray-700 font-medium">
                                {isAuthenticated ? "Hesabım" : "Giriş Yap"}
                            </span>
                            <User className="h-5 w-5 text-gray-500" />
                        </Link>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Favorilerim</span>
                            <div className="flex items-center gap-1">
                                <Heart className="h-5 w-5 text-red-500" />
                                {favoritesCount > 0 && (
                                    <Badge className="h-5 w-5 text-xs bg-red-500">{favoritesCount}</Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Sepetim</span>
                            <div className="flex items-center gap-1">
                                <ShoppingCart className="h-5 w-5 text-amber-600" />
                                {cartItemCount > 0 && (
                                    <Badge className="h-5 w-5 text-xs bg-amber-500">{cartItemCount}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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