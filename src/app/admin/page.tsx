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
    Image as ImageIcon,
    Bell,
    Send
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
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Ürün Adı *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                placeholder="Ürün adını girin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Kategori *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white"
                            >
                                <option value="">Kategori seçin</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Marka *
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                placeholder="Marka adını girin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Stok Miktarı *
                            </label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={onInputChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Stok Durumu *
                            </label>
                            <select
                                name="inStock"
                                value={formData.inStock.toString()}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white"
                            >
                                <option value="true">Stokta</option>
                                <option value="false">Stokta Yok</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Açıklama *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400 resize-none"
                            placeholder="Ürün açıklamasını girin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Resim URL *
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={onInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* File Upload Section */}
                    <div className="border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-4">Dosya Yükleme</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ürün Resmi Seçin
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onFileSelect}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                                />
                            </div>

                            {selectedFile && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Seçilen dosya: {selectedFile.name}</span>
                                        <button
                                            type="button"
                                            onClick={onClearFileSelection}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {uploadPreview && (
                                        <div className="mt-2">
                                            <img
                                                src={uploadPreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        onClick={onFileUpload}
                                        disabled={isUploading}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Yükleniyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                <span>Dosyayı Yükle</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
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
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// NotificationModal component for sending notifications
const NotificationModal = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Tüm Kullanıcılara Bildirim Gönder</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Bildirim Türü *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        >
                            <option value="">Tür seçin</option>
                            <option value="order">Sipariş Bildirimi</option>
                            <option value="promotion">Promosyon</option>
                            <option value="system">Sistem Bildirimi</option>
                            <option value="product">Ürün Bildirimi</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Başlık *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onInputChange}
                            placeholder="Bildirim başlığı"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Mesaj *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={onInputChange}
                            placeholder="Bildirim mesajı"
                            rows={4}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            İkon
                        </label>
                        <select
                            name="icon"
                            value={formData.icon}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="shipping">Kargo (Mavi)</option>
                            <option value="gift">Hediye (Kırmızı)</option>
                            <option value="check">Onay (Yeşil)</option>
                            <option value="star">Yıldız (Sarı)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isUrgent"
                                checked={formData.isUrgent}
                                onChange={(e) => onInputChange({
                                    target: { name: 'isUrgent', value: e.target.checked }
                                } as any)}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-300">Acil Bildirim</label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    <span>Gönderiliyor...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    <span>Bildirim Gönder</span>
                                </>
                            )}
                        </Button>
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
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isNotificationLoading, setIsNotificationLoading] = useState(false);

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

    // Form state for notifications
    const [notificationFormData, setNotificationFormData] = useState({
        type: '',
        title: '',
        message: '',
        icon: 'shipping',
        isUrgent: false
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

    // Handle notification form input changes
    const handleNotificationInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNotificationFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    }, []);

    // Handle notification submission
    const handleNotificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsNotificationLoading(true);

        try {
            // Burada gerçek bildirim gönderme API'si çağrılacak
            console.log('Sending notification:', notificationFormData);

            // Simüle edilmiş başarı
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Bildirim başarıyla gönderildi!');
            setIsNotificationModalOpen(false);
            setNotificationFormData({
                type: '',
                title: '',
                message: '',
                icon: 'shipping',
                isUrgent: false
            });
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Bildirim gönderilirken bir hata oluştu.');
        } finally {
            setIsNotificationLoading(false);
        }
    };

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
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <Header />

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
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-800">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', name: 'Genel Bakış', icon: BarChart3 },
                                { id: 'products', name: 'Ürün Yönetimi', icon: Package },
                                { id: 'orders', name: 'Siparişler', icon: ShoppingCart },
                                { id: 'customers', name: 'Müşteriler', icon: Users },
                                { id: 'reports', name: 'Raporlar', icon: FileText },
                                { id: 'settings', name: 'Ayarlar', icon: Settings },
                                { id: 'notifications', name: 'Bildirimler', icon: Bell }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ürün Yönetimi</h3>
                                    <button
                                        onClick={openAddModal}
                                        className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
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
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        />
                                    </div>
                                    <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600">
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
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Ürün
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Kategori
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Fiyat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Stok
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Durum
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    İşlemler
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <img
                                                                    className="h-10 w-10 rounded-lg object-cover"
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMyMi4yMDkxIDEyIDI0IDEzLjc5MDkgMjQgMTZDMjQgMTguMjA5MSAyMi4yMDkxIDIwIDIwIDIwQzE3Ljc5MDkgMjAgMTYgMTguMjA5MSAxNiAxNkMxNiAxMy43OTA5IDE3Ljc5MDkgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0yOCAyOEMyOCAyOS4xMDQ2IDI3LjEwNDYgMzAgMjYgMzBIMTRDMTIuODk1NCAzMCAxMiAyOS4xMDQ2IDEyIDI4VjI2QzEyIDI0Ljg5NTQgMTIuODk1NCAyNCAxNCAyNEgyNkMyNy4xMDQ2IDI0IDI4IDI0Ljg5NTQgMjggMjZWMjhaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {product.brand}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        ₺{product.price.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {product.stockQuantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.inStock
                                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                                                            }`}>
                                                            {product.inStock ? 'Stokta' : 'Tükendi'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => openEditModal(product)}
                                                                className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(product.id)}
                                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
                                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Ürün bulunamadı</h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Arama kriterlerinize uygun ürün bulunmuyor.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Other tabs placeholder */}
                        {activeTab === 'overview' && (
                            <div className="text-center py-12">
                                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Genel Bakış</h3>
                                <p className="text-gray-400">Genel istatistikler ve özet bilgiler burada görüntülenecek.</p>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="text-center py-12">
                                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Sipariş Yönetimi</h3>
                                <p className="text-gray-400">Sipariş takibi ve yönetimi burada görüntülenecek.</p>
                            </div>
                        )}

                        {activeTab === 'customers' && (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Müşteri Yönetimi</h3>
                                <p className="text-gray-400">Müşteri bilgileri ve yönetimi burada görüntülenecek.</p>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Raporlar</h3>
                                <p className="text-gray-400">Satış raporları ve analizler burada görüntülenecek.</p>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="text-center py-12">
                                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Ayarlar</h3>
                                <p className="text-gray-400">Sistem ayarları burada yapılandırılacak.</p>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2">Bildirim Yönetimi</h3>
                                        <p className="text-gray-400">Tüm kullanıcılara toplu bildirim gönderin</p>
                                    </div>
                                    <Button
                                        onClick={() => setIsNotificationModalOpen(true)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        <Bell className="h-4 w-4 mr-2" />
                                        Yeni Bildirim
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Notification Stats */}
                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Toplam Gönderilen</p>
                                                <p className="text-2xl font-bold text-white">1,247</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <Bell className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Bu Ay</p>
                                                <p className="text-2xl font-bold text-white">89</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Aktif Kullanıcı</p>
                                                <p className="text-2xl font-bold text-white">2,341</p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Notifications */}
                                <div className="bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="p-6 border-b border-gray-700">
                                        <h4 className="text-lg font-medium text-white">Son Gönderilen Bildirimler</h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-white font-medium">Özel İndirim Fırsatı!</p>
                                                        <p className="text-gray-400 text-sm">Tüm gitar kategorisinde %20 indirim</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">2 saat önce</p>
                                                    <p className="text-green-400 text-sm">2,341 kullanıcıya gönderildi</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-white font-medium">Sistem Güncellemesi</p>
                                                        <p className="text-gray-400 text-sm">Yeni özellikler eklendi</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">1 gün önce</p>
                                                    <p className="text-green-400 text-sm">2,341 kullanıcıya gönderildi</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-white font-medium">Yeni Ürünler</p>
                                                        <p className="text-gray-400 text-sm">Yeni gitar modelleri eklendi</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 text-sm">3 gün önce</p>
                                                    <p className="text-green-400 text-sm">2,341 kullanıcıya gönderildi</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

            {/* Notification Modal */}
            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={() => setIsNotificationModalOpen(false)}
                onSubmit={handleNotificationSubmit}
                formData={notificationFormData}
                onInputChange={handleNotificationInputChange}
                isLoading={isNotificationLoading}
            />
        </div>
    );
} 