import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '@/interfaces/product';
import { UserDataService } from '@/lib/firestore';

interface FavoritesState {
    items: Product[];
    isLoading: boolean;
}

const initialState: FavoritesState = {
    items: [],
    isLoading: false,
};

// Async thunk to save favorites to Firestore
export const saveFavoritesToFirestore = createAsyncThunk(
    'favorites/saveToFirestore',
    async ({ uid, favorites }: { uid: string; favorites: Product[] }, { rejectWithValue }) => {
        try {
            await UserDataService.saveUserFavorites(uid, favorites);
            return favorites;
        } catch (error) {
            return rejectWithValue('Failed to save favorites');
        }
    }
);

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
        setFavoritesItems: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
        },
        setFavoritesLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveFavoritesToFirestore.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveFavoritesToFirestore.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(saveFavoritesToFirestore.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    setFavoritesItems,
    setFavoritesLoading
} = favoritesSlice.actions;
export default favoritesSlice.reducer; 