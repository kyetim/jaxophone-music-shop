'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ProductService } from '@/lib/firestore';
import {
    Users,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    FileText,
    DollarSign,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    X,
    Save,
    Image as ImageIcon
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    imageWebp?: string;
    category: string;
    brand: string;
    inStock: boolean;
    stockQuantity: number;
    rating: number;
    reviewCount: number;
    tags: string[];
}

// ProductModal component moved outside to prevent re-renders
const ProductModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    submitText,
    formData,
    onInputChange,
    categories,
    selectedFile,
    uploadPreview,
    onFileSelect,
    onFileUpload,
    onClearFileSelection,
    isUploading,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    submitText: string;
    formData: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    categories: string[];
    selectedFile: File | null;
    uploadPreview: string;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: () => void;
    onClearFileSelection: () => void;
    isUploading: boolean;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ürün Adı *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Kategori Seçin</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fiyat (₺) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={onInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stok *
                            </label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={onInputChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marka
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Durum
                            </label>
                            <select
                                name="inStock"
                                value={formData.inStock.toString()}
                                onChange={(e) => onInputChange({
                                    target: { name: 'inStock', value: e.target.value === 'true' }
                                } as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="true">Aktif</option>
                                <option value="false">Pasif</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ürün Görseli
                        </label>

                        {/* Mevcut görsel gösterimi */}
                        {formData.imageUrl && !uploadPreview && (
                            <div className="mb-3">
                                <img
                                    src={formData.imageUrl}
                                    alt="Mevcut görsel"
                                    className="w-20 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {/* Yüklenecek dosya önizlemesi */}
                        {uploadPreview && (
                            <div className="mb-3">
                                <img
                                    src={uploadPreview}
                                    alt="Yüklenecek görsel"
                                    className="w-20 h-20 object-cover rounded-lg border"
                                />
                            </div>
                        )}

                        <div className="space-y-3">
                            {/* Dosya seçimi */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Dosya Seç</span>
                                </label>

                                {selectedFile && (
                                    <span className="text-sm text-gray-600">
                                        {selectedFile.name}
                                    </span>
                                )}
                            </div>

                            {/* Dosya yükleme butonu */}
                            {selectedFile && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={onFileUpload}
                                        disabled={isUploading}
                                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Yükleniyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                <span>Yükle</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onClearFileSelection}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                    >
                                        İptal
                                    </button>
                                </div>
                            )}

                            {/* URL ile görsel ekleme */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={onInputChange}
                                    placeholder="https://example.com/image.jpg (opsiyonel)"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <span className="text-sm text-gray-500">veya URL (opsiyonel)</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Açıklama
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Kaydediliyor...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>{submitText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form state for adding/editing products
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: '',
        imageUrl: '',
        brand: '',
        inStock: true
    });

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string>('');

    // Categories for products
    const categories = [
        'Gitar',
        'Piyano',
        'Davul',
        'Amfi',
        'Pedal',
        'Aksesuar',
        'Ses Sistemi',
        'Klavye',
        'Yaylı Çalgılar',
        'Nefesli Çalgılar',
        'Vurmalı Çalgılar',
        'OUTLET'
    ];

    useEffect(() => {
        // Load products from database
        const loadProducts = async () => {
            try {
                const products = await ProductService.getAll();
                setProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
                alert('Ürünler yüklenirken bir hata oluştu.');
            }
        };
        loadProducts();
    }, []);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle form input changes
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            category: '',
            price: '',
            stockQuantity: '',
            description: '',
            imageUrl: '',
            brand: '',
            inStock: true
        });
        setSelectedFile(null);
        setUploadPreview('');
    }, []);

    // Open add product modal
    const openAddModal = useCallback(() => {
        resetForm();
        setIsAddModalOpen(true);
    }, [resetForm]);

    // Open edit product modal
    const openEditModal = useCallback((product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stockQuantity: product.stockQuantity.toString(),
            description: product.description,
            imageUrl: product.imageUrl,
            brand: product.brand,
            inStock: product.inStock
        });
        setIsEditModalOpen(true);
    }, []);

    // Add new product
    const handleAddProduct = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Form validation
            if (!formData.name.trim()) {
                alert('Lütfen ürün adını giriniz.');
                return;
            }
            if (!formData.category) {
                alert('Lütfen kategori seçiniz.');
                return;
            }
            if (!formData.price || parseFloat(formData.price) <= 0) {
                alert('Lütfen geçerli bir fiyat giriniz.');
                return;
            }
            if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
                alert('Lütfen geçerli bir stok miktarı giriniz.');
                return;
            }

            const newProductData = {
                name: formData.name.trim(),
                category: formData.category,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim() || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMDkxIDEyIDI0IDEzLjc5MDkgMjQgMTZDMjQgMTguMjA5MSAyMi4yMDkxIDIwIDIwIDIwQzE3Ljc5MDkgMjAgMTYgMTguMjA5MSAxNiAxNkMxNiAxMy43OTA5IDE3Ljc5MDkgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yOCAyOEMyOCAyOS4xMDQ2IDI3LjEwNDYgMzAgMjYgMzBIMTRDMTIuODk1NCAzMCAxMiAyOS4xMDQ2IDEyIDI4VjI2QzEyIDI0Ljg5NTQgMTIuODk1NCAyNCAxNCAyNEgyNkMyNy4xMDQ2IDI0IDI4IDI0Ljg5NTQgMjggMjZWMjhaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=',
                brand: formData.brand.trim(),
                inStock: formData.inStock,
                rating: 0,
                reviewCount: 0,
                tags: []
            };

            const newProductId = await ProductService.create(newProductData);
            const newProduct = { id: newProductId, ...newProductData };
            setProducts(prev => [...prev, newProduct]);
            setIsAddModalOpen(false);
            resetForm();
            alert('Ürün başarıyla eklendi!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Ürün eklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, resetForm]);

    // Update product
    const handleUpdateProduct = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setIsLoading(true);

        try {
            // Form validation
            if (!formData.name.trim()) {
                alert('Lütfen ürün adını giriniz.');
                return;
            }
            if (!formData.category) {
                alert('Lütfen kategori seçiniz.');
                return;
            }
            if (!formData.price || parseFloat(formData.price) <= 0) {
                alert('Lütfen geçerli bir fiyat giriniz.');
                return;
            }
            if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
                alert('Lütfen geçerli bir stok miktarı giriniz.');
                return;
            }

            const updatedProductData = {
                name: formData.name.trim(),
                category: formData.category,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim() || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMDkxIDEyIDI0IDEzLjc5MDkgMjQgMTZDMjQgMTguMjA5MSAyMi4yMDkxIDIwIDIwIDIwQzE3Ljc5MDkgMjAgMTYgMTguMjA5MSAxNiAxNkMxNiAxMy43OTA5IDE3Ljc5MDkgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yOCAyOEMyOCAyOS4xMDQ2IDI3LjEwNDYgMzAgMjYgMzBIMTRDMTIuODk1NCAzMCAxMiAyOS4xMDQ2IDEyIDI4VjI2QzEyIDI0Ljg5NTQgMTIuODk1NCAyNCAxNCAyNEgyNkMyNy4xMDQ2IDI0IDI4IDI0Ljg5NTQgMjggMjZWMjhaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=',
                brand: formData.brand.trim(),
                inStock: formData.inStock
            };

            await ProductService.update(selectedProduct.id, updatedProductData);
            const updatedProduct = { ...selectedProduct, ...updatedProductData };
            setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            resetForm();
            alert('Ürün başarıyla güncellendi!');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Ürün güncellenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedProduct, resetForm]);

    // Delete product
    const handleDeleteProduct = useCallback(async (productId: string) => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

        try {
            await ProductService.delete(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Ürün silinirken bir hata oluştu.');
        }
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Preview oluştur
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Upload file
    const handleFileUpload = useCallback(async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setFormData(prev => ({ ...prev, imageUrl: result.url }));
                alert('Dosya başarıyla yüklendi! Görsel URL\'si forma eklendi.');
                setSelectedFile(null);
                setUploadPreview('');
            } else {
                alert(`Yükleme hatası: ${result.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile]);

    // Clear file selection
    const clearFileSelection = useCallback(() => {
        setSelectedFile(null);
        setUploadPreview('');
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
                            <p className="text-xl text-indigo-100">
                                Jaxophone müzik mağazası yönetim paneli
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-lg mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {[
                                    { id: 'overview', name: 'Genel Bakış', icon: BarChart3 },
                                    { id: 'products', name: 'Ürün Yönetimi', icon: Package },
                                    { id: 'orders', name: 'Siparişler', icon: ShoppingCart },
                                    { id: 'customers', name: 'Müşteriler', icon: Users },
                                    { id: 'reports', name: 'Raporlar', icon: FileText },
                                    { id: 'settings', name: 'Ayarlar', icon: Settings }
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Ürün Yönetimi</h3>
                                        <button
                                            onClick={openAddModal}
                                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Yeni Ürün Ekle</span>
                                        </button>
                                    </div>

                                    {/* Search and Filter */}
                                    <div className="flex items-center space-x-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Ürün ara..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                                            <Filter className="h-4 w-4" />
                                            <span>Filtrele</span>
                                        </button>
                                        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                            <Download className="h-4 w-4" />
                                            <span>Dışa Aktar</span>
                                        </button>
                                    </div>

                                    {/* Products Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ürün
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Kategori
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fiyat
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Stok
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Durum
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        İşlemler
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredProducts.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <img
                                                                        className="h-10 w-10 rounded-lg object-cover"
                                                                        src={product.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMDkxIDEyIDI0IDEzLjc5MDkgMjQgMTZDMjQgMTguMjA5MSAyMi4yMDkxIDIwIDIwIDIwQzE3Ljc5MDkgMjAgMTYgMTguMjA5MSAxNiAxNkMxNiAxMy43OTA5IDE3Ljc5MDkgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yOCAyOEMyOCAyOS4xMDQ2IDI3LjEwNDYgMzAgMjYgMzBIMTRDMTIuODk1NCAzMCAxMiAyOS4xMDQ2IDEyIDI4VjI2QzEyIDI0Ljg5NTQgMTIuODk1NCAyNCAxNCAyNEgyNkMyNy4xMDQ2IDI0IDI4IDI0Ljg5NTQgMjggMjZWMjhaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo='}
                                                                        alt={product.name}
                                                                        onError={(e) => {
                                                                            // Prevent infinite loop by setting a data URL
                                                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMDkxIDEyIDI0IDEzLjc5MDkgMjQgMTZDMjQgMTguMjA5MSAyMi4yMDkxIDIwIDIwIDIwQzE3Ljc5MDkgMjAgMTYgMTguMjA5MSAxNiAxNkMxNiAxMy43OTA5IDE3Ljc5MDkgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yOCAyOEMyOCAyOS4xMDQ2IDI3LjEwNDYgMzAgMjYgMzBIMTRDMTIuODk1NCAzMCAxMiAyOS4xMDQ2IDEyIDI4VjI2QzEyIDI0Ljg5NTQgMTIuODk1NCAyNCAxNCAyNEgyNkMyNy4xMDQ2IDI0IDI4IDI0Ljg5NTQgMjggMjZWMjhaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {product.brand}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {product.category}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {product.price.toLocaleString('tr-TR')}₺
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
                                                                product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                {product.stockQuantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {product.inStock ? 'Aktif' : 'Pasif'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => openEditModal(product)}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    title="Düzenle"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(product.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Sil"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredProducts.length === 0 && (
                                        <div className="text-center py-12">
                                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
                                            <p className="text-gray-500">Arama kriterlerinize uygun ürün bulunamadı.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Other tabs placeholder */}
                            {activeTab === 'overview' && (
                                <div className="text-center py-12">
                                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Genel Bakış</h3>
                                    <p className="text-gray-500">Genel istatistikler ve özet bilgiler burada görüntülenecek.</p>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="text-center py-12">
                                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş Yönetimi</h3>
                                    <p className="text-gray-500">Sipariş takibi ve yönetimi burada görüntülenecek.</p>
                                </div>
                            )}

                            {activeTab === 'customers' && (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri Yönetimi</h3>
                                    <p className="text-gray-500">Müşteri bilgileri ve yönetimi burada görüntülenecek.</p>
                                </div>
                            )}

                            {activeTab === 'reports' && (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Raporlar</h3>
                                    <p className="text-gray-500">Satış raporları ve analizler burada görüntülenecek.</p>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="text-center py-12">
                                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ayarlar</h3>
                                    <p className="text-gray-500">Sistem ayarları burada yapılandırılacak.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <ProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProduct}
                title="Yeni Ürün Ekle"
                submitText="Ürün Ekle"
                formData={formData}
                onInputChange={handleInputChange}
                categories={categories}
                selectedFile={selectedFile}
                uploadPreview={uploadPreview}
                onFileSelect={handleFileSelect}
                onFileUpload={handleFileUpload}
                onClearFileSelection={clearFileSelection}
                isUploading={isUploading}
                isLoading={isLoading}
            />

            {/* Edit Product Modal */}
            <ProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleUpdateProduct}
                title="Ürün Düzenle"
                submitText="Güncelle"
                formData={formData}
                onInputChange={handleInputChange}
                categories={categories}
                selectedFile={selectedFile}
                uploadPreview={uploadPreview}
                onFileSelect={handleFileSelect}
                onFileUpload={handleFileUpload}
                onClearFileSelection={clearFileSelection}
                isUploading={isUploading}
                isLoading={isLoading}
            />
        </>
    );
} 