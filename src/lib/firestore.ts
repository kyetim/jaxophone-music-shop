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
    DocumentSnapshot
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