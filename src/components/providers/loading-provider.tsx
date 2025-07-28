'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader } from '@/components/ui/loading';

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean, force?: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading: () => { },
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [lastPathname, setLastPathname] = useState<string>('');
    const pathname = usePathname();
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // İlk yüklemede loading gösterme
    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false);
            setLastPathname(pathname || '');
            return;
        }
    }, [isInitialLoad, pathname]);

    // Route değişikliklerinde loading göster
    useEffect(() => {
        if (!isInitialLoad) {
            // Eğer pathname aynıysa loading gösterme
            if (pathname === lastPathname) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setLastPathname(pathname || '');

            // Minimum loading süresi (UX için)
            const minLoadingTime = 200; // Daha doğal ve hızlı
            const startTime = Date.now();

            const timer = setTimeout(() => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

                setTimeout(() => {
                    setIsLoading(false);
                }, remainingTime);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [pathname, isInitialLoad, lastPathname]);

    const setLoading = (loading: boolean, force: boolean = false) => {
        // Eğer loading false yapılırsa, mevcut timeout'ları temizle
        if (!loading && loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }

        // Manual loading set edildiğinde de pathname kontrolü yap (force edilmediyse)
        if (loading && !force) {
            // Aynı sayfadaysak loading gösterme
            const currentPath = window.location.pathname;
            if (currentPath === lastPathname) {
                return;
            }

            // Maximum loading süresi (güvenlik için)
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
            }, 2000); // 3 saniyeden 2 saniyeye düşür
        }

        if (loading && force) {
            // Maximum loading süresi (güvenlik için)
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
            }, 2000); // 3 saniyeden 2 saniyeye düşür
        }

        setIsLoading(loading);
    };

    // Component unmount olduğunda timeout'ları temizle
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
            {isLoading && <PageLoader onClose={() => setIsLoading(false)} />}
        </LoadingContext.Provider>
    );
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
}; 