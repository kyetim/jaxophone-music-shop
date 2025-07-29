'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { migrateData } from '@/scripts/migrate-data';
import { ProductService, CategoryService, BrandService } from '@/lib/firestore';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, Link as LinkIcon, X } from 'lucide-react';

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

    // Image Upload State
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                addLog('❌ Lütfen sadece resim dosyası seçin');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                addLog('❌ Dosya boyutu 5MB\'dan küçük olmalı');
                return;
            }

            setSelectedFile(file);
            addLog(`📁 Dosya seçildi: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        if (!storage) {
            throw new Error('Firebase Storage not initialized');
        }

        setIsUploading(true);
        setUploadProgress(0);
        addLog('📤 Resim yükleniyor...');

        try {
            // Create unique filename
            const timestamp = Date.now();
            const fileName = `products/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const storageRef = ref(storage, fileName);

            // Upload file
            const snapshot = await uploadBytes(storageRef, file);
            addLog('✅ Dosya yüklendi, URL alınıyor...');

            // Get download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            addLog(`🔗 Resim URL'si hazır: ${downloadURL.substring(0, 50)}...`);

            return downloadURL;
        } catch (error) {
            addLog(`❌ Resim yükleme hatası: ${error}`);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddingProduct) return;

        setIsAddingProduct(true);
        addLog('🎸 Yeni ürün ekleniyor...');

        try {
            let imageUrl = newProduct.imageUrl;

            // If file upload method and file selected, upload first
            if (uploadMethod === 'file' && selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            // Validate image URL
            if (!imageUrl) {
                addLog('❌ Resim URL\'si veya dosyası gerekli');
                return;
            }

            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price),
                originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
                imageUrl: imageUrl,
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

            setSelectedFile(null);
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

                                {/* Image Upload Section */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Ürün Resmi</label>

                                    {/* Upload Method Toggle */}
                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setUploadMethod('url')}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${uploadMethod === 'url'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            URL ile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMethod('file')}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${uploadMethod === 'file'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Dosya Yükle
                                        </button>
                                    </div>

                                    {/* URL Input */}
                                    {uploadMethod === 'url' && (
                                        <input
                                            type="url"
                                            required={uploadMethod === 'url'}
                                            value={newProduct.imageUrl}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="https://images.unsplash.com/photo-..."
                                        />
                                    )}

                                    {/* File Upload */}
                                    {uploadMethod === 'file' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    id="file-upload"
                                                    required={uploadMethod === 'file'}
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    Resim Seç
                                                </label>
                                                {selectedFile && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span>{selectedFile.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedFile(null)}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedFile && (
                                                <div className="text-xs text-gray-500">
                                                    Dosya boyutu: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                                                    {selectedFile.size > 5 * 1024 * 1024 && (
                                                        <span className="text-red-500 ml-2">⚠️ Dosya çok büyük (max 5MB)</span>
                                                    )}
                                                </div>
                                            )}
                                            {isUploading && (
                                                <div className="text-sm text-blue-600">
                                                    📤 Yükleniyor...
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                                        disabled={isAddingProduct || isUploading}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer"
                                    >
                                        {isAddingProduct ? '⏳ Ekleniyor...' : isUploading ? '📤 Resim Yükleniyor...' : '✅ Ürünü Ekle'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddProductForm(false);
                                            setSelectedFile(null);
                                        }}
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