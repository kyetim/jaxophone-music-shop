import { useEffect, useRef } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    setUser,
    setUserProfile,
    setUserLoading,
    setUserError,
    clearUser
} from '@/store/slices/user-slice';

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
                } else {
                    dispatch(clearUser());
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                dispatch(setUserError('Kimlik doğrulama hatası'));
            } finally {
                // Loading'i sadece ilk kez false yap
                if (!hasInitialized.current) {
                    hasInitialized.current = true;
                    dispatch(setUserLoading(false));
                }
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

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
                };

                dispatch(setUserProfile(profileData));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            dispatch(setUserError('Kullanıcı profili yüklenemedi'));
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

    const logout = async () => {
        if (!auth) {
            throw new Error('Firebase Auth servisi bulunamadı.');
        }

        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
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

            dispatch(setUserProfile({ ...userProfile, ...updatesForRedux }));
        } catch (error: any) {
            const errorMessage = getErrorMessage(error.code);
            dispatch(setUserError(errorMessage));
            throw error;
        }
    };

    return {
        user,
        userProfile,
        loading: isLoading,
        error,
        signIn,
        signUp,
        logout,
        updateUserProfile,
        fetchUserProfile,
    };
}

function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.';
        case 'auth/wrong-password':
            return 'Hatalı şifre girdiniz.';
        case 'auth/email-already-in-use':
            return 'Bu e-posta adresi zaten kullanımda.';
        case 'auth/weak-password':
            return 'Şifre en az 6 karakter olmalıdır.';
        case 'auth/invalid-email':
            return 'Geçersiz e-posta adresi.';
        case 'auth/too-many-requests':
            return 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
        default:
            return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
} 