'use client';

import { useAppSelector } from '@/store/hooks';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Bell,
    X,
    Mail,
    Gift,
    AlertCircle,
    CheckCircle,
    Clock,
    Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface NotificationsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function NotificationsSidebar({ isOpen, onClose, onMouseEnter, onMouseLeave }: NotificationsSidebarProps) {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const { notifications, loading, markAsRead, clearAllNotifications } = useNotifications();
    const [isClearing, setIsClearing] = useState(false);

    const getNotificationIcon = (icon: string) => {
        switch (icon) {
            case 'shipping':
                return <AlertCircle className="h-4 w-4 text-blue-600" />;
            case 'gift':
                return <Gift className="h-4 w-4 text-red-600" />;
            case 'check':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'star':
                return <Star className="h-4 w-4 text-yellow-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    const getNotificationTypeColor = (type: string) => {
        switch (type) {
            case 'order':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'promotion':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'system':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'product':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            default:
                return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds} saniye önce`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika önce`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
        if (seconds < 2592000) return `${Math.floor(seconds / 86400)} gün önce`;
        return `${Math.floor(seconds / 2592000)} ay önce`;
    };

    const handleNotificationClick = async (notification: any) => {
        if (notification.isRead) return;
        await markAsRead(notification.id);
    };

    const handleClearAllNotifications = async () => {
        if (notifications.length === 0) return;

        const confirmed = window.confirm('Tüm bildirimlerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');
        if (!confirmed) return;

        setIsClearing(true);
        try {
            await clearAllNotifications();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                    onMouseEnter={onMouseLeave}
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
                    fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col hover-smooth
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Bildirimler
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
                {!isAuthenticated ? (
                    /* Not Logged In */
                    <div className="flex flex-col items-center justify-center flex-1 p-6">
                        <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bildirimlerinizi Görün</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                            Sipariş durumları, özel fırsatlar ve daha fazlası için giriş yapın!
                        </p>
                        <Button
                            asChild
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                            onClick={onClose}
                        >
                            <Link href="/login">Giriş Yap</Link>
                        </Button>
                    </div>
                ) : (
                    /* Notifications List */
                    <>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 space-y-3">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">Henüz bildiriminiz yok</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 rounded-lg border ${getNotificationTypeColor(notification.type)} hover:shadow-md transition-shadow cursor-pointer ${!notification.isRead ? 'ring-2 ring-amber-200 dark:ring-amber-800' : ''}`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.icon)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{getTimeAgo(notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date(notification.createdAt))}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
                            <div className="p-4 space-y-3">
                                {notifications.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={handleClearAllNotifications}
                                        disabled={isClearing}
                                    >
                                        {isClearing ? 'Siliniyor...' : 'Bildirimleri Temizle'}
                                    </Button>
                                )}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    onClick={onClose}
                                >
                                    <Link href="/account">
                                        Tüm Bildirimleri Gör
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
} 