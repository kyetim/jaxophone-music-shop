'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateQuantity, removeFromCart } from '@/store/slices/cart-slice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    Plus,
    Minus,
    X,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function CartSidebar({ isOpen, onClose, onMouseEnter, onMouseLeave }: CartSidebarProps) {
    const dispatch = useAppDispatch();
    const { items, total, itemCount } = useAppSelector((state) => state.cart);

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                    onMouseEnter={onMouseLeave} // Close sidebar when hovering over backdrop
                />
            )}

            {/* Invisible hover extension area */}
            {isOpen && (
                <div
                    className="fixed top-0 right-80 w-20 h-full z-45"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Sepetim ({itemCount})
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                {items.length === 0 ? (
                    /* Empty Cart */
                    <div className="flex flex-col items-center justify-center flex-1 p-6">
                        <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sepetiniz Boş</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                            Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünleri keşfedin!
                        </p>
                        <Button
                            asChild
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                            onClick={onClose}
                        >
                            <Link href="/">Alışverişe Başla</Link>
                        </Button>
                    </div>
                ) : (
                    /* Cart Items Layout */
                    <>
                        {/* Scrollable Items List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 space-y-3">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        {/* Product Image */}
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.imageWebp || item.product.imageUrl}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                                sizes="56px"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-xs text-gray-900 dark:text-white truncate leading-tight">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.product.brand}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveItem(item.product.id)}
                                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 h-5 w-5 flex-shrink-0 ml-1 cursor-pointer"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-5 w-5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-2 w-2" />
                                                    </Button>
                                                    <span className="text-xs font-medium w-6 text-center dark:text-white">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-5 w-5 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white cursor-pointer"
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-2 w-2" />
                                                    </Button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="font-semibold text-xs text-gray-900 dark:text-white">
                                                        {(item.product.price * item.quantity).toLocaleString('tr-TR')}₺
                                                    </div>
                                                    {item.product.originalPrice && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                                            {(item.product.originalPrice * item.quantity).toLocaleString('tr-TR')}₺
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer - Fixed at Bottom */}
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                            <div className="p-4 space-y-3">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Ara Toplam</span>
                                    <span className="font-bold text-lg text-amber-600">
                                        {total.toLocaleString('tr-TR')}₺
                                    </span>
                                </div>

                                {/* Free Shipping Progress */}
                                {total < 500 && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2">
                                        <p className="text-xs text-amber-800 dark:text-amber-300 mb-1">
                                            🎁 {(500 - total).toLocaleString('tr-TR')}₺ daha alışveriş yapın!
                                        </p>
                                        <div className="bg-amber-200 dark:bg-amber-700 rounded-full h-1.5">
                                            <div
                                                className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min((total / 500) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg py-2 cursor-pointer"
                                        onClick={onClose}
                                    >
                                        <Link href="/checkout">
                                            Hızlı Checkout
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 py-2 cursor-pointer"
                                        onClick={onClose}
                                    >
                                        <Link href="/cart">
                                            Sepeti Görüntüle
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
} 