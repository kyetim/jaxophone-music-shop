import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/interfaces/product';

interface FavoritesState {
    items: Product[];
}

const initialState: FavoritesState = {
    items: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<Product>) => {
            const exists = state.items.some(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
            }
        },
        removeFromFavorites: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearFavorites: (state) => {
            state.items = [];
        },
    },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 