import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('🔧 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'EKSIK',
    authDomain: firebaseConfig.authDomain || 'EKSIK',
    projectId: firebaseConfig.projectId || 'EKSIK',
    storageBucket: firebaseConfig.storageBucket || 'EKSIK',
    messagingSenderId: firebaseConfig.messagingSenderId || 'EKSIK',
    appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 20)}...` : 'EKSIK',
});

// Initialize Firebase (avoid multiple initialization)
let app;
try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log('🚀 Firebase başarıyla başlatıldı!');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('Firebase başlatılamadı.');
    app = null;
}

// Initialize Firebase services
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app; 