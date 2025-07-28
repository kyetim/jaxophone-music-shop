'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    Star,
    RefreshCw
} from 'lucide-react';
import { ProductFilters as IProductFilters, FilterGroup } from '@/interfaces/filter';

interface ProductFiltersProps {
    filters: IProductFilters;
    onFiltersChange: (filters: IProductFilters) => void;
    filterGroups: FilterGroup[];
    className?: string;
}

export function ProductFilters({
    filters,
    onFiltersChange,
    filterGroups,
    className = ''
}: ProductFiltersProps) {
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    const toggleGroup = (groupId: string) => {
        const newCollapsed = new Set(collapsedGroups);
        if (newCollapsed.has(groupId)) {
            newCollapsed.delete(groupId);
        } else {
            newCollapsed.add(groupId);
        }
        setCollapsedGroups(newCollapsed);
    };

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const newCategories = checked
            ? [...filters.categories, categoryId]
            : filters.categories.filter(id => id !== categoryId);

        onFiltersChange({
            ...filters,
            categories: newCategories,
            page: 1
        });
    };

    const handleBrandChange = (brandId: string, checked: boolean) => {
        const newBrands = checked
            ? [...filters.brands, brandId]
            : filters.brands.filter(id => id !== brandId);

        onFiltersChange({
            ...filters,
            brands: newBrands,
            page: 1
        });
    };

    const handlePriceRangeChange = (value: [number, number]) => {
        onFiltersChange({
            ...filters,
            priceRange: value,
            page: 1
        });
    };

    const handleToggleFilter = (key: keyof IProductFilters, value: boolean) => {
        onFiltersChange({
            ...filters,
            [key]: value,
            page: 1
        });
    };

    const handleRatingChange = (rating: number) => {
        onFiltersChange({
            ...filters,
            rating: filters.rating === rating ? undefined : rating,
            page: 1
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            categories: [],
            brands: [],
            priceRange: [0, 10000],
            inStock: undefined,
            onSale: undefined,
            rating: undefined,
            sortBy: 'newest',
            searchQuery: filters.searchQuery,
            page: 1,
            limit: filters.limit
        });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.categories.length > 0) count += filters.categories.length;
        if (filters.brands.length > 0) count += filters.brands.length;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count += 1;
        if (filters.inStock) count += 1;
        if (filters.onSale) count += 1;
        if (filters.rating) count += 1;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Filter Header */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="h-5 w-5 text-amber-600" />
                            Filtreler
                            {activeFiltersCount > 0 && (
                                <Badge className="bg-amber-600 text-white text-xs">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </CardTitle>
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-gray-500 hover:text-red-600 cursor-pointer"
                            >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Temizle
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Quick Filters */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Hızlı Filtreler</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={filters.inStock || false}
                                onChange={(e) => handleToggleFilter('inStock', e.target.checked)}
                                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
                                Sadece Stokta Olanlar
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="onSale"
                                checked={filters.onSale || false}
                                onChange={(e) => handleToggleFilter('onSale', e.target.checked)}
                                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor="onSale" className="text-sm text-gray-700 cursor-pointer">
                                İndirimli Ürünler
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Price Range */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Fiyat Aralığı</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-600">Min</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, filters.priceRange[1]])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Max</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value) || 10000])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                    placeholder="10000"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{filters.priceRange[0].toLocaleString('tr-TR')}₺</span>
                            <span>{filters.priceRange[1].toLocaleString('tr-TR')}₺</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rating Filter */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Değerlendirme</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                                key={rating}
                                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${filters.rating === rating ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => handleRatingChange(rating)}
                            >
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < rating
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-700">ve üzeri</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dynamic Filter Groups */}
            {filterGroups.map((group) => (
                <Card key={group.id} className="border-0 shadow-lg">
                    <CardHeader
                        className="pb-2 cursor-pointer"
                        onClick={() => toggleGroup(group.id)}
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{group.label}</CardTitle>
                            {collapsedGroups.has(group.id) ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                            )}
                        </div>
                    </CardHeader>

                    {!collapsedGroups.has(group.id) && (
                        <CardContent className="pt-0">
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                {group.options.map((option) => (
                                    <div key={option.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 flex-1">
                                            <input
                                                type="checkbox"
                                                id={`${group.id}-${option.id}`}
                                                checked={
                                                    group.id === 'categories'
                                                        ? filters.categories.includes(option.id)
                                                        : filters.brands.includes(option.id)
                                                }
                                                onChange={(e) => {
                                                    if (group.id === 'categories') {
                                                        handleCategoryChange(option.id, e.target.checked);
                                                    } else {
                                                        handleBrandChange(option.id, e.target.checked);
                                                    }
                                                }}
                                                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`${group.id}-${option.id}`}
                                                className="text-sm text-gray-700 cursor-pointer flex-1"
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({option.count})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <Card className="border-0 shadow-lg bg-amber-50">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Aktif Filtreler</h3>
                        <div className="flex flex-wrap gap-2">
                            {filters.categories.map((categoryId) => {
                                const categoryGroup = filterGroups.find(g => g.id === 'categories');
                                const category = categoryGroup?.options.find(o => o.id === categoryId);
                                return category ? (
                                    <Badge
                                        key={categoryId}
                                        variant="secondary"
                                        className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleCategoryChange(categoryId, false)}
                                    >
                                        {category.label}
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                ) : null;
                            })}

                            {filters.brands.map((brandId) => {
                                const brandGroup = filterGroups.find(g => g.id === 'brands');
                                const brand = brandGroup?.options.find(o => o.id === brandId);
                                return brand ? (
                                    <Badge
                                        key={brandId}
                                        variant="secondary"
                                        className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleBrandChange(brandId, false)}
                                    >
                                        {brand.label}
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                ) : null;
                            })}

                            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handlePriceRangeChange([0, 10000])}
                                >
                                    {filters.priceRange[0].toLocaleString('tr-TR')}₺ - {filters.priceRange[1].toLocaleString('tr-TR')}₺
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            )}

                            {filters.inStock && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleToggleFilter('inStock', false)}
                                >
                                    Stokta Var
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            )}

                            {filters.onSale && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleToggleFilter('onSale', false)}
                                >
                                    İndirimli
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            )}

                            {filters.rating && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRatingChange(filters.rating!)}
                                >
                                    {filters.rating}+ Yıldız
                                    <X className="h-3 w-3 ml-1" />
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 