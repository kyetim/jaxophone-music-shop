'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLoading } from '@/components/providers/loading-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { CartSidebar } from './cart-sidebar';
import { FavoritesSidebar } from './favorites-sidebar';
import { SearchInput } from '@/components/search/search-input';

export function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const cartHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const favoritesHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cartItemCount = useAppSelector((state) => state.cart.itemCount);
    const favoritesCount = useAppSelector((state) => state.favorites.items.length);
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const { setLoading } = useLoading();
    const router = useRouter();

    // Navigation link click handler with manual routing
    const handleNavClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default Link behavior

        // Mevcut pathname'i al
        const currentPath = window.location.pathname;

        // Eğer aynı sayfaya gidiliyorsa loading gösterme
        if (currentPath === href) {
            setIsMobileMenuOpen(false);
            setIsCartOpen(false);
            setIsFavoritesOpen(false);
            return;
        }

        // Loading'i başlat (force=true ile same page kontrolünü bypass et)
        setLoading(true, true); // FORCE mode for navigation

        // Sidebar'ları kapat
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
        setIsFavoritesOpen(false);

        // Navigate et
        router.push(href);
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
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 lg:h-20 items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center group flex-shrink-0 cursor-pointer"
                            onClick={(e) => handleNavClick('/', e)}
                        >
                            <div className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                Jaxophone
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick('/', e)}
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/categories"
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick('/categories', e)}
                            >
                                Kategoriler
                            </Link>
                            <Link
                                href="/products"
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick('/products', e)}
                            >
                                Ürünler
                            </Link>
                            <Link
                                href="/brands"
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick('/brands', e)}
                            >
                                Markalar
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors cursor-pointer"
                                onClick={(e) => handleNavClick('/about', e)}
                            >
                                Hakkımızda
                            </Link>
                        </nav>

                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center flex-1 max-w-sm mx-4 lg:mx-6">
                            <SearchInput
                                placeholder="Ürün, marka ara..."
                                className="w-full"
                            />
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2">
                            {/* Search Button - Mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden cursor-pointer"
                                onClick={handleMobileSearchToggle}
                            >
                                <Search className="h-5 w-5 text-gray-600" />
                            </Button>

                            {/* Favorites with Hover Sidebar */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={handleFavoritesMouseEnter}
                                onMouseLeave={handleFavoritesMouseLeave}
                            >
                                <Button variant="ghost" size="icon" className="relative group">
                                    <Link
                                        href="/favorites"
                                        onClick={(e) => handleNavClick('/favorites', e)}
                                    >
                                        <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                                        {favoritesCount > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white font-semibold animate-pulse">
                                                {favoritesCount}
                                            </Badge>
                                        )}
                                    </Link>
                                </Button>
                            </div>

                            {/* Cart with Hover Sidebar */}
                            <div
                                className="relative cursor-pointer"
                                onMouseEnter={handleCartMouseEnter}
                                onMouseLeave={handleCartMouseLeave}
                            >
                                <Button variant="ghost" size="icon" className="relative group">
                                    <Link
                                        href="/cart"
                                        onClick={(e) => handleNavClick('/cart', e)}
                                    >
                                        <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-200" />
                                        {cartItemCount > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-2 border-white font-semibold animate-pulse">
                                                {cartItemCount}
                                            </Badge>
                                        )}
                                    </Link>
                                </Button>
                            </div>

                            {/* User Account */}
                            <div className="relative">
                                {isAuthenticated ? (
                                    <Button variant="ghost" size="icon" className="relative group cursor-pointer">
                                        <Link
                                            href="/account"
                                            onClick={(e) => handleNavClick('/account', e)}
                                        >
                                            <User className="h-5 w-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-200" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                        <Link
                                            href="/login"
                                            onClick={(e) => handleNavClick('/login', e)}
                                        >
                                            <User className="h-5 w-5 text-gray-600 hover:text-amber-600 transition-colors duration-200" />
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer" onClick={handleMobileMenuToggle}>
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <Menu className="h-5 w-5 text-gray-600" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {isMobileSearchOpen && (
                        <div className="md:hidden pb-4">
                            <SearchInput
                                placeholder="Ürün ara..."
                                className="w-full"
                                onResultClick={handleMobileSearchClose}
                            />
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="border-t border-gray-100 bg-white px-4 py-4">
                        <nav className="space-y-3">
                            <Link
                                href="/"
                                className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                onClick={(e) => handleNavClick('/', e)}
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/categories"
                                className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                onClick={(e) => handleNavClick('/categories', e)}
                            >
                                Kategoriler
                            </Link>
                            <Link
                                href="/products"
                                className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                onClick={(e) => handleNavClick('/products', e)}
                            >
                                Ürünler
                            </Link>
                            <Link
                                href="/brands"
                                className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                onClick={(e) => handleNavClick('/brands', e)}
                            >
                                Markalar
                            </Link>
                            <Link
                                href="/about"
                                className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                onClick={(e) => handleNavClick('/about', e)}
                            >
                                Hakkımızda
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/account"
                                        className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                        onClick={(e) => handleNavClick('/account', e)}
                                    >
                                        Hesabım
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block text-gray-600 hover:text-amber-600 font-medium transition-colors py-2 cursor-pointer"
                                        onClick={(e) => handleNavClick('/orders', e)}
                                    >
                                        Siparişlerim
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block text-amber-600 hover:text-amber-700 font-medium transition-colors py-2 cursor-pointer"
                                    onClick={(e) => handleNavClick('/login', e)}
                                >
                                    Giriş Yap
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

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