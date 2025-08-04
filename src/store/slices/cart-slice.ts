import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/interfaces/product';
import { UserDataService } from '@/lib/firestore';

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    isLoading: boolean;
}

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
};

function calculateTotals(items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
}

// Async thunk to save cart to Firestore
export const saveCartToFirestore = createAsyncThunk(
    'cart/saveToFirestore',
    async ({ uid, cartItems }: { uid: string; cartItems: CartItem[] }, { rejectWithValue }) => {
        try {
            await UserDataService.saveUserCart(uid, cartItems);
            return cartItems;
        } catch (error) {
            return rejectWithValue('Failed to save cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.product.id === action.payload.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }

            const totals = calculateTotals(state.items);
            state.total = totals.total;
            state.itemCount = totals.itemCount;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.product.id !== action.payload);
            const totals = calculateTotals(state.items);
            state.total = totals.total;
            state.itemCount = totals.itemCount;
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item.product.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                if (item.quantity <= 0) {
                    state.items = state.items.filter(item => item.product.id !== action.payload.id);
                }
            }
            const totals = calculateTotals(state.items);
            state.total = totals.total;
            state.itemCount = totals.itemCount;
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
        },
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            const totals = calculateTotals(state.items);
            state.total = totals.total;
            state.itemCount = totals.itemCount;
        },
        setCartLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCartToFirestore.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveCartToFirestore.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(saveCartToFirestore.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartItems,
    setCartLoading
} = cartSlice.actions;
export default cartSlice.reducer; 