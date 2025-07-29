'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { migrateData } from '@/scripts/migrate-data';
import { ProductService, CategoryService, BrandService } from '@/lib/firestore';

export default function AdminPage() {
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationLog, setMigrationLog] = useState<string[]>([]);
    const [stats, setStats] = useState<{
        products: number;
        categories: number;
        brands: number;
    } | null>(null);

    // New Product Form State
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        category: '',
        brand: '',
        stockQuantity: '',
        rating: '4.5',
        reviewCount: '0',
        tags: ''
    });

    const addLog = (message: string) => {
        setMigrationLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleMigrateData = async () => {
        if (isMigrating) return;

        setIsMigrating(true);
        setMigrationLog([]);
        addLog('🚀 Data migration başlatıldı...');

        try {
            // Override console.log to capture migration logs
            const originalLog = console.log;
            console.log = (message: string) => {
                addLog(message);
                originalLog(message);
            };

            await migrateData();

            // Restore console.log
            console.log = originalLog;

            addLog('🎉 Migration başarıyla tamamlandı!');

            // Refresh stats
            await loadStats();
        } catch (error) {
            addLog(`❌ Migration hatası: ${error}`);
            console.error('Migration error:', error);
        } finally {
            setIsMigrating(false);
        }
    };

    const loadStats = async () => {
        try {
            const [products, categories, brands] = await Promise.all([
                ProductService.getAll(),
                CategoryService.getAll(),
                BrandService.getAll()
            ]);

            setStats({
                products: products.length,
                categories: categories.length,
                brands: brands.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleLoadStats = () => {
        loadStats();
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddingProduct) return;

        setIsAddingProduct(true);
        addLog('🎸 Yeni ürün ekleniyor...');

        try {
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price),
                originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
                imageUrl: newProduct.imageUrl,
                category: newProduct.category,
                brand: newProduct.brand,
                inStock: true,
                stockQuantity: Number(newProduct.stockQuantity),
                rating: Number(newProduct.rating),
                reviewCount: Number(newProduct.reviewCount),
                tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const productId = await ProductService.create(productData);
            addLog(`✅ Ürün başarıyla eklendi: ${newProduct.name} (${productId})`);

            // Reset form
            setNewProduct({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                imageUrl: '',
                category: '',
                brand: '',
                stockQuantity: '',
                rating: '4.5',
                reviewCount: '0',
                tags: ''
            });

            setShowAddProductForm(false);
            await loadStats();

        } catch (error) {
            addLog(`❌ Ürün ekleme hatası: ${error}`);
            console.error('Add product error:', error);
        } finally {
            setIsAddingProduct(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        🔧 Admin Panel - Database Management
                    </h1>

                    {/* Current Stats */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                📊 Mevcut Database İstatistikleri
                            </h2>
                            <Button
                                onClick={handleLoadStats}
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                            >
                                Yenile
                            </Button>
                        </div>

                        {stats ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats.products}</div>
                                    <div className="text-blue-800">Ürünler</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
                                    <div className="text-green-800">Kategoriler</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.brands}</div>
                                    <div className="text-purple-800">Markalar</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">
                                    İstatistikleri yüklemek için "Yenile" butonuna tıklayın
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Add New Product Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                🎸 Yeni Ürün Ekle
                            </h2>
                            <Button
                                onClick={() => setShowAddProductForm(!showAddProductForm)}
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                            >
                                {showAddProductForm ? 'Formu Gizle' : 'Ürün Ekle'}
                            </Button>
                        </div>

                        {showAddProductForm && (
                            <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: Fender Player Telecaster"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.brand}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: Fender"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: guitars"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            required
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: 35000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Orijinal Fiyat (₺) - Opsiyonel</label>
                                        <input
                                            type="number"
                                            value={newProduct.originalPrice}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: 42000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı</label>
                                        <input
                                            type="number"
                                            required
                                            value={newProduct.stockQuantity}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="Örn: 15"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
                                    <input
                                        type="url"
                                        required
                                        value={newProduct.imageUrl}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="https://images.unsplash.com/photo-..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                    <textarea
                                        required
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        rows={3}
                                        placeholder="Ürün açıklaması..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler (virgülle ayırın)</label>
                                    <input
                                        type="text"
                                        value={newProduct.tags}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, tags: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="electric, telecaster, professional, maple"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isAddingProduct}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer"
                                    >
                                        {isAddingProduct ? '⏳ Ekleniyor...' : '✅ Ürünü Ekle'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddProductForm(false)}
                                        className="cursor-pointer"
                                    >
                                        İptal
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Migration Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            🚀 Data Migration
                        </h2>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                            <h3 className="font-medium text-amber-800 mb-2">⚠️ Dikkat!</h3>
                            <p className="text-amber-700 text-sm">
                                Bu işlem sample müzik enstrümanları, kategoriler ve markaları Firestore database'e ekleyecek.
                                Sadece database boşken çalıştırın.
                            </p>
                        </div>

                        <Button
                            onClick={handleMigrateData}
                            disabled={isMigrating}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer"
                        >
                            {isMigrating ? '⏳ Migration Çalışıyor...' : '🚀 Sample Data Migration Başlat'}
                        </Button>
                    </div>

                    {/* Migration Log */}
                    {migrationLog.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                📝 Migration Log
                            </h2>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
                                {migrationLog.map((log, index) => (
                                    <div key={index} className="mb-1">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 