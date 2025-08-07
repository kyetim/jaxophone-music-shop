import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/interfaces/product';

// Collections
export const COLLECTIONS = {
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    BRANDS: 'brands',
    ORDERS: 'orders',
    USERS: 'users'
} as const;

// Helper function to ensure db is available
function ensureDB() {
    if (!db) {
        throw new Error('Firestore is not initialized');
    }
    return db;
}

// Helper function to clean undefined values from objects and arrays
const cleanUndefinedValues = (obj: any): any => {
    if (obj === null || obj === undefined) {
        return null;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => cleanUndefinedValues(item)).filter(item => item !== null);
    }

    if (typeof obj === 'object') {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                cleaned[key] = cleanUndefinedValues(value);
            }
        }
        return cleaned;
    }

    return obj;
};

// Firebase Timestamp'i string'e çeviren helper function
const convertTimestampToString = (timestamp: any): string | undefined => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }
    if (typeof timestamp === 'string') {
        return timestamp;
    }
    return undefined;
};

// Helper function to convert Firestore document to Product
const convertFirestoreDocToProduct = (doc: any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        originalPrice: data.originalPrice,
        imageUrl: data.imageUrl || '',
        imageWebp: data.imageWebp,
        category: data.category || '',
        brand: data.brand || '',
        inStock: data.inStock ?? true,
        stockQuantity: data.stockQuantity || 0,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        tags: data.tags || [],
        createdAt: convertTimestampToString(data.createdAt),
        updatedAt: convertTimestampToString(data.updatedAt),
    };
};

// Product Operations
export class ProductService {
    static async getAll() {
        try {
            const database = ensureDB();
            const querySnapshot = await getDocs(collection(database, COLLECTIONS.PRODUCTS));
            return querySnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const database = ensureDB();
            const docRef = doc(database, COLLECTIONS.PRODUCTS, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return convertFirestoreDocToProduct(docSnap);
            }
            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    static async getByCategory(categoryId: string) {
        try {
            const database = ensureDB();
            const q = query(
                collection(database, COLLECTIONS.PRODUCTS),
                where('category', '==', categoryId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }

    static async search(searchTerm: string, limitNum = 10) {
        try {
            const database = ensureDB();
            // Firebase doesn't support full-text search natively
            // We'll implement a simple name-based search for now
            const q = query(
                collection(database, COLLECTIONS.PRODUCTS),
                orderBy('name'),
                limit(limitNum)
            );

            const querySnapshot = await getDocs(q);
            const allProducts = querySnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));

            // Client-side filtering (for demo - production should use Algolia/Elasticsearch)
            const searchLower = searchTerm.toLowerCase();
            return allProducts.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.brand.toLowerCase().includes(searchLower) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    static async create(product: Omit<Product, 'id'>) {
        try {
            const database = ensureDB();
            const docRef = await addDoc(collection(database, COLLECTIONS.PRODUCTS), {
                ...product,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async update(id: string, updates: Partial<Product>) {
        try {
            const database = ensureDB();
            const docRef = doc(database, COLLECTIONS.PRODUCTS, id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const database = ensureDB();
            const docRef = doc(database, COLLECTIONS.PRODUCTS, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

// Category Operations
export class CategoryService {
    static async getAll() {
        try {
            const database = ensureDB();
            const querySnapshot = await getDocs(collection(database, COLLECTIONS.CATEGORIES));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    static async create(category: any) {
        try {
            const database = ensureDB();
            const docRef = await addDoc(collection(database, COLLECTIONS.CATEGORIES), {
                ...category,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }
}

// Brand Operations
export class BrandService {
    static async getAll() {
        try {
            const database = ensureDB();
            const querySnapshot = await getDocs(collection(database, COLLECTIONS.BRANDS));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }
    }

    static async create(brand: any) {
        try {
            const database = ensureDB();
            const docRef = await addDoc(collection(database, COLLECTIONS.BRANDS), {
                ...brand,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    }
}

// User-specific data operations
export class UserDataService {
    // Cart operations
    static async getUserCart(uid: string) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return data.cart || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching user cart:', error);
            return [];
        }
    }

    static async saveUserCart(uid: string, cartItems: any[]) {
        try {
            const database = ensureDB();
            await updateDoc(doc(database, 'users', uid), {
                cart: cleanUndefinedValues(cartItems),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error saving user cart:', error);
            throw error;
        }
    }

    // Favorites operations
    static async getUserFavorites(uid: string) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return data.favorites || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            return [];
        }
    }

    static async saveUserFavorites(uid: string, favorites: any[]) {
        try {
            const database = ensureDB();
            await updateDoc(doc(database, 'users', uid), {
                favorites: cleanUndefinedValues(favorites),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error saving user favorites:', error);
            throw error;
        }
    }

    // Addresses operations
    static async getUserAddresses(uid: string) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                return data.addresses || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching user addresses:', error);
            return [];
        }
    }

    static async saveUserAddresses(uid: string, addresses: any[]) {
        try {
            const database = ensureDB();
            await updateDoc(doc(database, 'users', uid), {
                addresses: cleanUndefinedValues(addresses),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error saving user addresses:', error);
            throw error;
        }
    }

    // Add new address
    static async addUserAddress(uid: string, address: any) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const addresses = data.addresses || [];
                const newAddress = {
                    ...address,
                    id: Date.now().toString(), // Simple ID generation
                    createdAt: new Date()
                };
                addresses.push(newAddress);

                await updateDoc(doc(database, 'users', uid), {
                    addresses: cleanUndefinedValues(addresses),
                    updatedAt: new Date()
                });

                return newAddress;
            }
            throw new Error('User not found');
        } catch (error) {
            console.error('Error adding user address:', error);
            throw error;
        }
    }

    // Update address
    static async updateUserAddress(uid: string, addressId: string, updatedAddress: any) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const addresses = data.addresses || [];
                const addressIndex = addresses.findIndex((addr: any) => addr.id === addressId);

                if (addressIndex !== -1) {
                    addresses[addressIndex] = {
                        ...addresses[addressIndex],
                        ...updatedAddress,
                        updatedAt: new Date()
                    };

                    await updateDoc(doc(database, 'users', uid), {
                        addresses: cleanUndefinedValues(addresses),
                        updatedAt: new Date()
                    });

                    return addresses[addressIndex];
                }
                throw new Error('Address not found');
            }
            throw new Error('User not found');
        } catch (error) {
            console.error('Error updating user address:', error);
            throw error;
        }
    }

    // Delete address
    static async deleteUserAddress(uid: string, addressId: string) {
        try {
            const database = ensureDB();
            const userDoc = await getDoc(doc(database, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const addresses = data.addresses || [];
                const filteredAddresses = addresses.filter((addr: any) => addr.id !== addressId);

                await updateDoc(doc(database, 'users', uid), {
                    addresses: cleanUndefinedValues(filteredAddresses),
                    updatedAt: new Date()
                });
            }
        } catch (error) {
            console.error('Error deleting user address:', error);
            throw error;
        }
    }
}

// Notification Service for managing notifications
export class NotificationService {
    private static collection = 'notifications';

    // Create a new notification
    static async create(notificationData: {
        type: 'order' | 'promotion' | 'system' | 'product';
        title: string;
        message: string;
        icon: 'shipping' | 'gift' | 'check' | 'star';
        isUrgent?: boolean;
        sentBy: string;
        sentTo: 'all' | string[]; // 'all' for all users, or specific user IDs
    }) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();
        const notification = {
            ...notificationData,
            id: '',
            createdAt: now,
            isRead: false,
            readBy: [] as string[], // Array of user IDs who read this notification
            sentAt: now,
        };

        const docRef = await addDoc(collection(db, this.collection), notification);

        // Update the document with its ID
        await updateDoc(docRef, { id: docRef.id });

        return docRef.id;
    }

    // Get all notifications (for admin)
    static async getAll() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return notifications.sort((a: any, b: any) => {
            const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return bDate.getTime() - aDate.getTime();
        });
    }

    // Get notifications for a specific user
    static async getUserNotifications(userId: string) {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter on client side to avoid index requirement
        return notifications.filter((notification: any) =>
            notification.sentTo === 'all' ||
            (Array.isArray(notification.sentTo) && notification.sentTo.includes(userId))
        );
    }

    // Mark notification as read
    static async markAsRead(notificationId: string, userId: string) {
        if (!db) throw new Error('Firestore not initialized');

        const notificationRef = doc(db, this.collection, notificationId);
        const notificationDoc = await getDoc(notificationRef);

        if (!notificationDoc.exists()) {
            throw new Error('Notification not found');
        }

        const notification = notificationDoc.data();
        const readBy = notification.readBy || [];

        if (!readBy.includes(userId)) {
            readBy.push(userId);
            await updateDoc(notificationRef, {
                readBy,
                isRead: readBy.length > 0
            });
        }
    }

    // Get notification statistics
    static async getStatistics() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        const notifications = querySnapshot.docs.map(doc => doc.data());

        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalSent = notifications.length;
        const thisMonthSent = notifications.filter(n =>
            n.createdAt?.toDate ? n.createdAt.toDate() >= thisMonth : new Date(n.createdAt) >= thisMonth
        ).length;

        // Get total users count (you might want to implement this separately)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Calculate read/unread statistics
        const totalNotifications = notifications.length;
        const readNotifications = notifications.filter(n => n.isRead).length;
        const unreadNotifications = totalNotifications - readNotifications;

        return {
            totalSent,
            thisMonthSent,
            totalUsers,
            totalNotifications,
            readNotifications,
            unreadNotifications
        };
    }

    // Delete notification
    static async delete(notificationId: string) {
        if (!db) throw new Error('Firestore not initialized');

        await deleteDoc(doc(db, this.collection, notificationId));
    }

    // Clear all notifications for a user
    static async clearAllNotifications(userId: string) {
        if (!db) throw new Error('Firestore not initialized');

        try {
            // Get all notifications for the user
            const userNotificationsQuery = query(
                collection(db, this.collection),
                where('sentTo', 'array-contains', userId)
            );

            const querySnapshot = await getDocs(userNotificationsQuery);

            // Delete all notifications in batch
            const batch = writeBatch(db);
            querySnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            return { success: true, deletedCount: querySnapshot.docs.length };
        } catch (error) {
            console.error('Error clearing notifications:', error);
            throw error;
        }
    }
}

// Blog Service for managing blog posts
export class BlogService {
    private static collection = 'blogs';

    // Create a new blog post (admin only)
    static async create(blogData: {
        title: string;
        excerpt: string;
        content: string;
        author: string;
        category: string;
        tags: string[];
        imageUrl?: string;
        isPublished: boolean;
        createdBy: string;
    }) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();

        // Clean the data to remove undefined values
        const cleanBlogData = {
            ...blogData,
            imageUrl: blogData.imageUrl || null, // Convert undefined to null
            tags: blogData.tags.filter(tag => tag && tag.trim() !== ''), // Remove empty tags
        };

        const blog = {
            ...cleanBlogData,
            id: '',
            createdAt: now,
            updatedAt: now,
            publishedAt: blogData.isPublished ? now : null,
            views: 0,
            likes: 0,
            comments: 0,
            status: blogData.isPublished ? 'published' : 'draft'
        };

        // Remove undefined values from the blog object
        const cleanBlog = Object.fromEntries(
            Object.entries(blog).filter(([_, value]) => value !== undefined)
        );

        const docRef = await addDoc(collection(db, this.collection), cleanBlog);

        // Update the document with its ID
        await updateDoc(docRef, { id: docRef.id });

        return docRef.id;
    }

    // Submit a blog post for review (user submission)
    static async submitForReview(blogData: {
        title: string;
        excerpt: string;
        content: string;
        author: string;
        category: string;
        tags: string[];
        imageUrl?: string;
        submittedBy: string;
        userEmail: string;
    }) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();

        // Clean the data to remove undefined values
        const cleanBlogData = {
            ...blogData,
            imageUrl: blogData.imageUrl || null, // Convert undefined to null
            tags: blogData.tags.filter(tag => tag && tag.trim() !== ''), // Remove empty tags
        };

        const blog = {
            ...cleanBlogData,
            id: '',
            createdAt: now,
            updatedAt: now,
            status: 'pending',
            isPublished: false,
            publishedAt: null,
            views: 0,
            likes: 0,
            comments: 0,
            reviewedBy: null,
            reviewedAt: null,
            reviewNotes: null
        };

        // Remove undefined values from the blog object
        const cleanBlog = Object.fromEntries(
            Object.entries(blog).filter(([_, value]) => value !== undefined)
        );

        const docRef = await addDoc(collection(db, this.collection), cleanBlog);

        // Update the document with its ID
        await updateDoc(docRef, { id: docRef.id });

        return docRef.id;
    }

    // Get all published blog posts
    static async getPublished() {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter on client side to avoid index requirement
        return blogs.filter((blog: any) => blog.status === 'published');
    }

    // Get blog post by ID
    static async getById(id: string) {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, this.collection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        }
        return null;
    }

    // Get all blog posts (for admin)
    static async getAll() {
        if (!db) throw new Error('Firestore not initialized');

        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return blogs;
    }

    // Get pending blog submissions
    static async getPending() {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter on client side to avoid index requirement
        return blogs.filter((blog: any) => blog.status === 'pending');
    }

    // Approve blog post
    static async approve(blogId: string, reviewedBy: string, reviewNotes?: string) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();
        await updateDoc(doc(db, this.collection, blogId), {
            status: 'published',
            isPublished: true,
            publishedAt: now,
            reviewedBy,
            reviewedAt: now,
            reviewNotes: reviewNotes || null,
            updatedAt: now
        });
    }

    // Reject blog post
    static async reject(blogId: string, reviewedBy: string, reviewNotes: string) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();
        await updateDoc(doc(db, this.collection, blogId), {
            status: 'rejected',
            reviewedBy,
            reviewedAt: now,
            reviewNotes,
            updatedAt: now
        });
    }

    // Update blog post
    static async update(id: string, updates: any) {
        if (!db) throw new Error('Firestore not initialized');

        await updateDoc(doc(db, this.collection, id), {
            ...updates,
            updatedAt: new Date()
        });
    }

    // Delete blog post
    static async delete(id: string) {
        if (!db) throw new Error('Firestore not initialized');

        await deleteDoc(doc(db, this.collection, id));
    }

    // Increment view count
    static async incrementViews(id: string) {
        if (!db) throw new Error('Firestore not initialized');

        const blogRef = doc(db, this.collection, id);
        const blogDoc = await getDoc(blogRef);

        if (blogDoc.exists()) {
            const currentViews = blogDoc.data().views || 0;
            await updateDoc(blogRef, {
                views: currentViews + 1
            });
        }
    }

    // Get blog statistics
    static async getStatistics() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        const blogs = querySnapshot.docs.map(doc => doc.data());

        const totalPosts = blogs.length;
        const publishedPosts = blogs.filter(b => b.status === 'published').length;
        const pendingPosts = blogs.filter(b => b.status === 'pending').length;
        const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

        return {
            totalPosts,
            publishedPosts,
            pendingPosts,
            totalViews
        };
    }
}

// Review Service for managing product reviews
export class ReviewService {
    private static collection = 'reviews';

    // Create a new review
    static async create(reviewData: {
        productId: string;
        userId: string;
        userName: string;
        userEmail: string;
        rating: number;
        title: string;
        comment: string;
        images?: string[];
        verified: boolean;
    }) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();

        // Clean the data to remove undefined values
        const cleanReviewData = {
            ...reviewData,
            images: reviewData.images?.filter(img => img && img.trim() !== '') || null, // Remove empty images
        };

        const review = {
            ...cleanReviewData,
            id: '',
            createdAt: now,
            updatedAt: now,
            helpful: 0,
            reported: false,
            status: 'pending' // pending, approved, rejected
        };

        // Remove undefined values from the review object
        const cleanReview = Object.fromEntries(
            Object.entries(review).filter(([_, value]) => value !== undefined)
        );

        const docRef = await addDoc(collection(db, this.collection), cleanReview);

        // Update the document with its ID
        await updateDoc(docRef, { id: docRef.id });

        // Update product rating
        await this.updateProductRating(reviewData.productId);

        return docRef.id;
    }

    // Get reviews for a specific product
    static async getProductReviews(productId: string) {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter on client side to avoid index requirement
        return reviews.filter((review: any) =>
            review.productId === productId && review.status === 'approved'
        );
    }

    // Get all reviews (for admin)
    static async getAll() {
        if (!db) throw new Error('Firestore not initialized');

        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return reviews;
    }

    // Get pending reviews
    static async getPending() {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter on client side to avoid index requirement
        return reviews.filter((review: any) => review.status === 'pending');
    }

    // Approve review
    static async approve(reviewId: string) {
        if (!db) throw new Error('Firestore not initialized');

        const reviewRef = doc(db, this.collection, reviewId);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            throw new Error('Review not found');
        }

        const review = reviewDoc.data();
        await updateDoc(reviewRef, {
            status: 'approved',
            updatedAt: new Date()
        });

        // Update product rating
        await this.updateProductRating(review.productId);
    }

    // Reject review
    static async reject(reviewId: string, reason: string) {
        if (!db) throw new Error('Firestore not initialized');

        const reviewRef = doc(db, this.collection, reviewId);
        await updateDoc(reviewRef, {
            status: 'rejected',
            rejectionReason: reason,
            updatedAt: new Date()
        });
    }

    // Update product rating based on reviews
    static async updateProductRating(productId: string) {
        if (!db) throw new Error('Firestore not initialized');

        // Simplified query to avoid index requirement
        const q = query(
            collection(db, this.collection),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => doc.data());

        // Filter on client side to avoid index requirement
        const approvedReviews = reviews.filter((review: any) =>
            review.productId === productId && review.status === 'approved'
        );

        if (approvedReviews.length === 0) return;

        const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / approvedReviews.length;
        const reviewCount = approvedReviews.length;

        // Update product with new rating
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
            rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            reviewCount: reviewCount
        });
    }

    // Mark review as helpful
    static async markHelpful(reviewId: string, userId: string) {
        if (!db) throw new Error('Firestore not initialized');

        const reviewRef = doc(db, this.collection, reviewId);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            throw new Error('Review not found');
        }

        const review = reviewDoc.data();
        const helpfulUsers = review.helpfulUsers || [];

        if (!helpfulUsers.includes(userId)) {
            helpfulUsers.push(userId);
            await updateDoc(reviewRef, {
                helpful: helpfulUsers.length,
                helpfulUsers: helpfulUsers
            });
        }
    }

    // Report review
    static async reportReview(reviewId: string, userId: string, reason: string) {
        if (!db) throw new Error('Firestore not initialized');

        const reviewRef = doc(db, this.collection, reviewId);
        await updateDoc(reviewRef, {
            reported: true,
            reportReason: reason,
            reportedBy: userId,
            reportedAt: new Date()
        });
    }

    // Delete review
    static async delete(reviewId: string) {
        if (!db) throw new Error('Firestore not initialized');

        const reviewRef = doc(db, this.collection, reviewId);
        const reviewDoc = await getDoc(reviewRef);

        if (!reviewDoc.exists()) {
            throw new Error('Review not found');
        }

        const review = reviewDoc.data();

        // Delete the review
        await deleteDoc(reviewRef);

        // Update product rating
        await this.updateProductRating(review.productId);
    }

    // Get review statistics
    static async getStatistics() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        const reviews = querySnapshot.docs.map(doc => doc.data());

        const totalReviews = reviews.length;
        const approvedReviews = reviews.filter(r => r.status === 'approved').length;
        const pendingReviews = reviews.filter(r => r.status === 'pending').length;
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        return {
            totalReviews,
            approvedReviews,
            pendingReviews,
            averageRating: Math.round(averageRating * 10) / 10
        };
    }
}

export class NewsletterService {
    private static collection = 'newsletter_subscribers';

    // Get all newsletter subscribers
    static async getAllSubscribers() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        const subscribers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return subscribers.filter((subscriber: any) => subscriber.isActive);
    }

    // Get subscriber count
    static async getSubscriberCount() {
        if (!db) throw new Error('Firestore not initialized');

        const querySnapshot = await getDocs(collection(db, this.collection));
        return querySnapshot.docs.filter(doc => doc.data().isActive).length;
    }

    // Add new subscriber
    static async addSubscriber(email: string) {
        if (!db) throw new Error('Firestore not initialized');

        const now = new Date();
        const subscriber = {
            email: email.toLowerCase(),
            subscribedAt: now,
            isActive: true
        };

        const docRef = await addDoc(collection(db, this.collection), subscriber);
        return docRef.id;
    }

    // Unsubscribe
    static async unsubscribe(email: string) {
        if (!db) throw new Error('Firestore not initialized');

        const subscribersRef = collection(db, this.collection);
        const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = doc(db, this.collection, querySnapshot.docs[0].id);
            await updateDoc(docRef, { isActive: false });
        }
    }
} 