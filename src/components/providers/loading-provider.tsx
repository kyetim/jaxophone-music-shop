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
    const routeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (!isInitialLoad && pathname !== lastPathname) {
            // Önceki timeout'ları temizle
            if (routeChangeTimeoutRef.current) {
                clearTimeout(routeChangeTimeoutRef.current);
            }
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }

            // Loading'i hemen başlat
            setIsLoading(true);

            // Route değişimi tamamlandıktan sonra kısa bir gecikme ile kapat
            routeChangeTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
                setLastPathname(pathname || '');
            }, 150); // Daha kısa süre - sadece flash'ı önlemek için

            return () => {
                if (routeChangeTimeoutRef.current) {
                    clearTimeout(routeChangeTimeoutRef.current);
                }
            };
        }
    }, [pathname, isInitialLoad, lastPathname]);

    const setLoading = (loading: boolean, force: boolean = false) => {
        // Timeout'ları temizle
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }
        if (routeChangeTimeoutRef.current) {
            clearTimeout(routeChangeTimeoutRef.current);
            routeChangeTimeoutRef.current = null;
        }

        if (!loading) {
            setIsLoading(false);
            return;
        }

        // Manual loading set edildiğinde pathname kontrolü yap (force edilmediyse)
        if (!force) {
            const currentPath = window.location.pathname;
            if (currentPath === lastPathname) {
                return;
            }
        }

        setIsLoading(true);

        // Maximum loading süresi (güvenlik için)
        loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    // Component unmount olduğunda timeout'ları temizle
    useEffect(() => {
        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
            if (routeChangeTimeoutRef.current) {
                clearTimeout(routeChangeTimeoutRef.current);
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