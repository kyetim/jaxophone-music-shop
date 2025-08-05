import { useEffect, useRef } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    sendPasswordResetEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setUser,
    setUserProfile,
    setUserLoading,
    setUserError,
    clearUser
} from '@/store/slices/user-slice';
import { clearCart, setCartItems, setCartLoading } from '@/store/slices/cart-slice';
import { clearFavorites, setFavoritesItems, setFavoritesLoading } from '@/store/slices/favorites-slice';
import { UserDataService } from '@/lib/firestore';
import { RootState } from '@/store/store';

export interface AuthUser extends User {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    uid: string;
}

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

// Undefined değerleri filtreleyen helper function
const sanitizeData = (data: any): any => {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            cleaned[key] = data[key];
        }
    });
    return cleaned;
};

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, userProfile, isLoading, error } = useAppSelector((state) => state.user);
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Firebase auth service'i yoksa loading'i false yap
        if (!auth) {
            dispatch(setUserLoading(false));
            dispatch(setUserError('Firebase yapılandırması eksik. .env.local dosyasını kontrol edin.'));
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Firebase user'ı Redux'a kaydet (sadece serialize edilebilir alanları)
                    const serializableUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        emailVerified: firebaseUser.emailVerified,
                    };
                    dispatch(setUser(serializableUser));

                    // Kullanıcı profilini Firestore'dan çek
                    await fetchUserProfile(firebaseUser.uid);

                    // Sadece ilk girişte cart ve favorites'ı Firestore'dan yükle
                    // Redux Persist sayfa geçişlerinde state'i koruyacak
                    if (!hasInitialized.current) {
                        await loadUserCart(firebaseUser.uid);
                        await loadUserFavorites(firebaseUser.uid);
                        hasInitialized.current = true;
                    }
                } else {
                    dispatch(clearUser());
                    hasInitialized.current = false;
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                dispatch(setUserError('Kimlik doğrulama hatası'));
            } finally {
                dispatch(setUserLoading(false));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Auth state'inin senkronizasyonunu kontrol et
    useEffect(() => {
        if (hasInitialized.current && auth) {
            const currentUser = auth.currentUser;
            const isAuthenticatedInRedux = !!user;

            // Firebase'de user var ama Redux'ta yoksa, Redux'ı güncelle
            if (currentUser && !isAuthenticatedInRedux) {
                const serializableUser = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                    emailVerified: currentUser.emailVerified,
                };
                dispatch(setUser(serializableUser));
                fetchUserProfile(currentUser.uid);
                loadUserCart(currentUser.uid);
                loadUserFavorites(currentUser.uid);
            }
            // Firebase'de user yok ama Redux'ta varsa, Redux'ı temizle
            else if (!currentUser && isAuthenticatedInRedux) {
                dispatch(clearUser());
            }
        }
    }, [user, dispatch]);

    const fetchUserProfile = async (uid: string) => {
        if (!db) {
            console.warn('Firestore service bulunamadı');
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();

                // Timestamp'leri string'e çevir
                const profileData = {
                    ...data,
                    createdAt: convertTimestampToString(data.createdAt),
                    lastLoginAt: convertTimestampToString(data.lastLoginAt),
                    updatedAt: convertTimestampToString(data.updatedAt),
                };

                dispatch(setUserProfile(profileData));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            dispatch(setUserError('Kullanıcı profili yüklenemedi'));
        }
    };

    const loadUserCart = async (uid: string) => {
        try {
            dispatch(setCartLoading(true));
            const cartItems = await UserDataService.getUserCart(uid);
            dispatch(setCartItems(cartItems));
        } catch (error) {
            console.error('Error loading user cart:', error);
        } finally {
            dispatch(setCartLoading(false));
        }
    };

    const loadUserFavorites = async (uid: string) => {
        try {
            dispatch(setFavoritesLoading(true));
            const favorites = await UserDataService.getUserFavorites(uid);
            dispatch(setFavoritesItems(favorites));
        } catch (error) {
            console.error('Error loading user favorites:', error);
        } finally {
            dispatch(setFavoritesLoading(false));
        }
    };

    const saveUserCart = async (cartItems: any[]) => {
        if (!user?.uid) return;
        try {
            await UserDataService.saveUserCart(user.uid, cartItems);
        } catch (error) {
            console.error('Error saving user cart:', error);
        }
    };

    const saveUserFavorites = async (favorites: any[]) => {
        if (!user?.uid) return;
        try {
            await UserDataService.saveUserFavorites(user.uid, favorites);
        } catch (error) {
            console.error('Error saving user favorites:', error);
        }
    };

    const signIn = async (email: string, password: string) => {
        if (!auth || !db) {
            throw new Error('Firebase servisleri bulunamadı. Yapılandırmayı kontrol edin.');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            const result = await signInWithEmailAndPassword(auth, email, password);

            // Son giriş tarihini güncelle - undefined değerleri filtrele
            const updateData = sanitizeData({
                lastLoginAt: new Date(),
            });

            await setDoc(doc(db, 'users', result.user.uid), updateData, { merge: true });

            return result.user;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        if (!auth || !db) {
            throw new Error('Firebase servisleri bulunamadı. Yapılandırmayı kontrol edin.');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Kullanıcı profilini güncelle
            await updateProfile(result.user, { displayName });

            // Firestore'da kullanıcı dokümantı oluştur - undefined değerleri filtrele
            const now = new Date();
            const userProfileData: any = {
                uid: result.user.uid,
                email: email,
                displayName: displayName,
                createdAt: now,
                lastLoginAt: now,
                addresses: [],
                preferences: {
                    newsletter: true,
                    smsNotifications: true,
                    emailNotifications: true,
                },
            };

            // photoURL sadece varsa ekle
            if (result.user.photoURL) {
                userProfileData.photoURL = result.user.photoURL;
            }

            // Undefined değerleri filtrele
            const sanitizedData = sanitizeData(userProfileData);
            await setDoc(doc(db, 'users', result.user.uid), sanitizedData);

            // Redux'a string formatında kaydet
            const profileForRedux = {
                ...userProfileData,
                photoURL: result.user.photoURL || undefined, // Redux için undefined da olabilir
                createdAt: now.toISOString(),
                lastLoginAt: now.toISOString(),
            };

            dispatch(setUserProfile(profileForRedux));

            return result.user;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const signOut = async () => {
        if (!auth) {
            throw new Error('Firebase Auth servisi bulunamadı');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));
            await firebaseSignOut(auth);
            dispatch(clearUser());
            dispatch(clearCart());
            dispatch(clearFavorites());
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const resetPassword = async (email: string) => {
        if (!auth) {
            throw new Error('Firebase Auth servisi bulunamadı');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false,
            });

            return true;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const updateUserProfile = async (updates: Partial<any>) => {
        if (!user || !db) return;

        try {
            // Timestamp'leri string'e çevir ve undefined değerleri filtrele
            const updatesForFirestore = { ...updates };
            if (updatesForFirestore.createdAt) {
                updatesForFirestore.createdAt = convertTimestampToString(updatesForFirestore.createdAt);
            }
            if (updatesForFirestore.lastLoginAt) {
                updatesForFirestore.lastLoginAt = convertTimestampToString(updatesForFirestore.lastLoginAt);
            }
            if (updatesForFirestore.updatedAt) {
                updatesForFirestore.updatedAt = convertTimestampToString(updatesForFirestore.updatedAt);
            }

            // Undefined değerleri filtrele
            const sanitizedUpdates = sanitizeData(updatesForFirestore);

            await setDoc(doc(db, 'users', user.uid), sanitizedUpdates, { merge: true });

            // Redux için timestamp'leri string'e çevir
            const updatesForRedux = { ...updates };
            if (updatesForRedux.createdAt) {
                updatesForRedux.createdAt = convertTimestampToString(updatesForRedux.createdAt);
            }
            if (updatesForRedux.lastLoginAt) {
                updatesForRedux.lastLoginAt = convertTimestampToString(updatesForRedux.lastLoginAt);
            }
            if (updatesForRedux.updatedAt) {
                updatesForRedux.updatedAt = convertTimestampToString(updatesForRedux.updatedAt);
            }

            dispatch(setUserProfile({ ...userProfile, ...updatesForRedux }));
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        if (!auth || !user?.email) {
            throw new Error('Kullanıcı oturumu bulunamadı');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            // Önce mevcut şifre ile yeniden kimlik doğrulama yap
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser!, credential);

            // Şifreyi güncelle
            await updatePassword(auth.currentUser!, newPassword);

            return true;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const deleteAccount = async (currentPassword: string) => {
        if (!auth || !user?.email || !db) {
            throw new Error('Kullanıcı oturumu bulunamadı');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            // Önce mevcut şifre ile yeniden kimlik doğrulama yap
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser!, credential);

            // Firestore'dan kullanıcı verilerini sil
            await deleteDoc(doc(db, 'users', user.uid));

            // Firebase Auth'dan kullanıcıyı sil
            await deleteUser(auth.currentUser!);

            // Redux state'ini temizle
            dispatch(clearUser());
            dispatch(clearCart());
            dispatch(clearFavorites());

            return true;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const sendEmailVerificationEmail = async () => {
        if (!auth || !user) {
            throw new Error('Kullanıcı oturumu bulunamadı veya e-posta doğrulaması yapılamadı.');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            await sendEmailVerification(auth.currentUser!);

            return true;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    const signInWithGoogle = async () => {
        if (!auth || !db) {
            throw new Error('Firebase servisleri bulunamadı. Yapılandırmayı kontrol edin.');
        }

        try {
            dispatch(setUserError(null));
            dispatch(setUserLoading(true));

            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Kullanıcı profilini Firestore'da kontrol et veya oluştur
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));

            if (!userDoc.exists()) {
                // Yeni Google kullanıcısı için profil oluştur
                const now = new Date();
                const userProfileData: any = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    createdAt: now,
                    lastLoginAt: now,
                    emailVerified: result.user.emailVerified,
                    addresses: [],
                    preferences: {
                        newsletter: true,
                        smsNotifications: true,
                        emailNotifications: true,
                    },
                };

                const sanitizedData = sanitizeData(userProfileData);
                await setDoc(doc(db, 'users', result.user.uid), sanitizedData);

                // Redux'a string formatında kaydet
                const profileForRedux = {
                    ...userProfileData,
                    createdAt: now.toISOString(),
                    lastLoginAt: now.toISOString(),
                };

                dispatch(setUserProfile(profileForRedux));
            } else {
                // Mevcut kullanıcı için son giriş tarihini güncelle
                const updateData = sanitizeData({
                    lastLoginAt: new Date(),
                });
                await setDoc(doc(db, 'users', result.user.uid), updateData, { merge: true });
            }

            return result.user;
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        } finally {
            dispatch(setUserLoading(false));
        }
    };

    // Firebase error kodlarını Türkçe mesajlara çevir
    const getErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.';
            case 'auth/wrong-password':
                return 'Hatalı şifre girdiniz.';
            case 'auth/email-already-in-use':
                return 'Bu e-posta adresi zaten kullanımda.';
            case 'auth/weak-password':
                return 'Şifre çok zayıf. En az 6 karakter olmalıdır.';
            case 'auth/invalid-email':
                return 'Geçersiz e-posta adresi.';
            case 'auth/too-many-requests':
                return 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.';
            case 'auth/network-request-failed':
                return 'İnternet bağlantınızı kontrol edin.';
            case 'auth/invalid-credential':
                return 'Geçersiz e-posta veya şifre.';
            case 'auth/user-disabled':
                return 'Bu hesap devre dışı bırakılmış.';
            case 'auth/expired-action-code':
                return 'Şifre sıfırlama bağlantısının süresi dolmuş.';
            case 'auth/invalid-action-code':
                return 'Geçersiz veya kullanılmış şifre sıfırlama bağlantısı.';
            default:
                return 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.';
        }
    };

    return {
        user,
        userProfile,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        changePassword,
        deleteAccount,
        fetchUserProfile,
        saveUserCart,
        saveUserFavorites,
        sendEmailVerificationEmail,
        signInWithGoogle,
    };
} 