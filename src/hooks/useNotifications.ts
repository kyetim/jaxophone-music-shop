import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { NotificationService } from '@/lib/firestore';

export function useNotifications() {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Load user notifications
    useEffect(() => {
        if (isAuthenticated && user?.uid) {
            loadNotifications();
        } else {
            setNotifications([]);
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
            // Update local state
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        refreshNotifications: loadNotifications
    };
} 