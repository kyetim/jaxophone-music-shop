import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Serialize edilebilir user interface
interface SerializableUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: string; // ISO string olarak sakla
    lastLoginAt: string; // ISO string olarak sakla
    addresses: Array<{
        id: string;
        title: string;
        fullName: string;
        address: string;
        city: string;
        district: string;
        zipCode: string;
        phone: string;
        isDefault: boolean;
    }>;
    preferences: {
        newsletter: boolean;
        smsNotifications: boolean;
        emailNotifications: boolean;
    };
}

interface UserState {
    user: SerializableUser | null;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Firebase Timestamp'i string'e çeviren helper function
const convertTimestampToString = (timestamp: any): string => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }
    if (typeof timestamp === 'string') {
        return timestamp;
    }
    return new Date().toISOString();
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            if (action.payload) {
                // Firebase User'dan sadece serialize edilebilir alanları al
                state.user = {
                    uid: action.payload.uid,
                    email: action.payload.email,
                    displayName: action.payload.displayName,
                    photoURL: action.payload.photoURL,
                    emailVerified: action.payload.emailVerified,
                };
                state.isAuthenticated = true;
            } else {
                state.user = null;
                state.isAuthenticated = false;
            }
            state.isLoading = false;
            state.error = null;
        },
        setUserProfile: (state, action: PayloadAction<any>) => {
            if (action.payload) {
                // Firebase Timestamp'leri string'e çevir
                state.userProfile = {
                    ...action.payload,
                    createdAt: convertTimestampToString(action.payload.createdAt),
                    lastLoginAt: convertTimestampToString(action.payload.lastLoginAt),
                };
            } else {
                state.userProfile = null;
            }
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUserError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.userProfile) {
                const updates = { ...action.payload };
                // Timestamp alanlarını string'e çevir
                if (updates.createdAt) {
                    updates.createdAt = convertTimestampToString(updates.createdAt);
                }
                if (updates.lastLoginAt) {
                    updates.lastLoginAt = convertTimestampToString(updates.lastLoginAt);
                }
                state.userProfile = { ...state.userProfile, ...updates };
            }
        },
        clearUser: (state) => {
            state.user = null;
            state.userProfile = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const {
    setUser,
    setUserProfile,
    setUserLoading,
    setUserError,
    updateUserProfile,
    clearUser,
} = userSlice.actions;

export default userSlice.reducer; 