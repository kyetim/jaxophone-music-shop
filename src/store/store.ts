import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cart-slice';
import userReducer from './slices/user-slice';
import favoritesReducer from './slices/favorites-slice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 