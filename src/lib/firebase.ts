import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Direct config (env variables'lar çalışmıyor)
const firebaseConfig = {
    apiKey: "AIzaSyC04i2rxkOzt2BBtp8q0WHXRiA6sfvi6qY",
    authDomain: "jaxophone-music-shop.firebaseapp.com",
    projectId: "jaxophone-music-shop",
    storageBucket: "jaxophone-music-shop.firebasestorage.app",
    messagingSenderId: "409998936254",
    appId: "1:409998936254:web:e8edd4635b8f13f593f6ef"
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