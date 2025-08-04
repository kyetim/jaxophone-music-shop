import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cart-slice';
import userReducer from './slices/user-slice';
import favoritesReducer from './slices/favorites-slice';

// Persist configuration for user state
const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['user', 'userProfile', 'isAuthenticated'], // Only persist these fields
    blacklist: ['isLoading', 'error'] // Don't persist loading and error states
};

// Don't persist cart and favorites - they'll be stored in Firestore
const cartPersistConfig = {
    key: 'cart',
    storage,
    whitelist: [] // Don't persist cart data
};

const favoritesPersistConfig = {
    key: 'favorites',
    storage,
    whitelist: [] // Don't persist favorites data
};

// Create persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, favoritesReducer);

// Custom middleware to save cart and favorites to Firestore
const firestoreMiddleware = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    const state = store.getState();
    const user = state.user.user;

    // Only save if user is authenticated
    if (!user?.uid) return result;

    // Save cart to Firestore when cart changes
    if (action.type?.startsWith('cart/') && action.type !== 'cart/setCartLoading') {
        const { items } = state.cart;
        // Use setTimeout to avoid blocking the UI
        setTimeout(() => {
            import('@/lib/firestore').then(({ UserDataService }) => {
                UserDataService.saveUserCart(user.uid, items).catch(console.error);
            });
        }, 0);
    }

    // Save favorites to Firestore when favorites change
    if (action.type?.startsWith('favorites/') && action.type !== 'favorites/setFavoritesLoading') {
        const { items } = state.favorites;
        // Use setTimeout to avoid blocking the UI
        setTimeout(() => {
            import('@/lib/firestore').then(({ UserDataService }) => {
                UserDataService.saveUserFavorites(user.uid, items).catch(console.error);
            });
        }, 0);
    }

    return result;
};

export const store = configureStore({
    reducer: {
        cart: persistedCartReducer,
        user: persistedUserReducer,
        favorites: persistedFavoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PURGE',
                    'user/setUser',
                    'user/setUserProfile',
                    'user/updateUserProfile'
                ],
                ignoredActionsPaths: [
                    'payload.lastLoginAt',
                    'payload.createdAt',
                    'payload.stsTokenManager',
                    'payload.accessToken',
                    'payload.auth',
                    'payload.proactiveRefresh'
                ],
                ignoredPaths: [
                    'user.user',
                    'user.userProfile.createdAt',
                    'user.userProfile.lastLoginAt',
                    'cart.items.product.createdAt',
                    'cart.items.product.updatedAt',
                    'favorites.items.createdAt',
                    'favorites.items.updatedAt'
                ],
            },
        }).concat(firestoreMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 