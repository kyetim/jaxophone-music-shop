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
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 