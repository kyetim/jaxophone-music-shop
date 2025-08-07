import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { NotificationService } from '@/lib/firestore';

export function useNotifications() {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const hasLoaded = useRef(false);

    // Load user notifications only once when user is authenticated
    useEffect(() => {
        if (isAuthenticated && user?.uid && !hasLoaded.current) {
            loadNotifications();
            hasLoaded.current = true;
        } else if (!isAuthenticated) {
            setNotifications([]);
            hasLoaded.current = false;
        }
    }, [isAuthenticated, user?.uid]);

    const loadNotifications = async () => {
        if (!user?.uid) return;

        setLoading(true);
        try {
            const userNotifications = await NotificationService.getUserNotifications(user.uid);
            setNotifications(userNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
            // Fallback to empty array if there's an error
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unread notification count
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    const markAsRead = async (notificationId: string) => {
        if (!user?.uid) return;

        try {
            await NotificationService.markAsRead(notificationId, user.uid);
            // Update local state immediately for better UX
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const clearAllNotifications = async () => {
        if (!user?.uid) return;

        try {
            await NotificationService.clearAllNotifications(user.uid);
            // Clear local state immediately for better UX
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        clearAllNotifications,
        refreshNotifications: loadNotifications
    };
} 