'use client';

import { cn } from '@/lib/utils';

// Temel Spinner
export function Spinner({ className, size = 'md' }: {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-b-2 border-amber-600',
                sizeClasses[size],
                className
            )}
        />
    );
}

// Müzik temalı loading animasyonu
export function MusicNoteLoader({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center justify-center space-x-1', className)}>
            <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-amber-600 to-orange-500 rounded-full animate-pulse"
                        style={{
                            height: `${20 + i * 8}px`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// Sayfa loading ekranı
export function PageLoader({ onClose }: { onClose?: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <div className="text-center">
                {/* Minimal Logo */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                        🎸 Jaxophone
                    </h1>
                    {/* Simplified Loading Animation */}
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-loading-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-loading-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-amber-600 rounded-full animate-loading-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>

                {/* Optional manual close - only show after 2 seconds */}
                {onClose && (
                    <div className="mt-4 opacity-40 hover:opacity-100 transition-opacity">
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Kart/Bölüm loading skeleton
export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse', className)}>
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
}

// Ürün kartı skeleton
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-gray-200"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
}

// Liste loading
export function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
            ))}
        </div>
    );
}

// Navigation/Route loading
export function RouteLoader() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-gray-200">
                <div className="h-full bg-gradient-to-r from-amber-600 to-orange-600 animate-pulse"></div>
            </div>
        </div>
    );
}

// Button loading state
export function ButtonLoader({ children, isLoading, className, ...props }: {
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
    [key: string]: any;
}) {
    return (
        <button
            className={cn(
                'relative overflow-hidden transition-all duration-200',
                isLoading && 'cursor-not-allowed opacity-70',
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20">
                    <Spinner size="sm" className="border-white/60" />
                </div>
            )}
            <span className={cn(isLoading && 'opacity-0')}>
                {children}
            </span>
        </button>
    );
} 