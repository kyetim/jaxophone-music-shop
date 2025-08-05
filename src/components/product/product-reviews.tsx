'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ReviewService } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    ThumbsUp,
    Flag,
    Camera,
    X,
    Send,
    User,
    Calendar,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';

interface ProductReviewsProps {
    productId: string;
    productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
    const user = useAppSelector((state) => state.user.user);

    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const productReviews = await ReviewService.getProductReviews(productId);
            setReviews(productReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated || !user) {
            alert('Yorum yapmak için giriş yapmalısınız.');
            return;
        }

        setSubmitting(true);

        try {
            // Upload images if any
            const imageUrls: string[] = [];
            for (const image of selectedImages) {
                // Here you would upload to Firebase Storage
                // For now, we'll use a placeholder
                const imageUrl = await uploadImage(image);
                imageUrls.push(imageUrl);
            }

            await ReviewService.create({
                productId,
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0] || 'Anonim',
                userEmail: user.email || '',
                rating: formData.rating,
                title: formData.title,
                comment: formData.comment,
                images: imageUrls.length > 0 ? imageUrls : undefined,
                verified: true
            });

            // Reset form
            setFormData({ rating: 5, title: '', comment: '' });
            setSelectedImages([]);
            setImagePreviewUrls([]);
            setShowReviewForm(false);

            // Reload reviews
            await loadReviews();

            alert('Yorumunuz başarıyla gönderildi! İnceleme sonrası yayınlanacaktır.');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setSubmitting(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        // This is a placeholder - in real implementation, upload to Firebase Storage
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => file.type.startsWith('image/'));

        if (selectedImages.length + validFiles.length > 5) {
            alert('En fazla 5 fotoğraf yükleyebilirsiniz.');
            return;
        }

        setSelectedImages(prev => [...prev, ...validFiles]);

        // Create preview URLs
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviewUrls(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleMarkHelpful = async (reviewId: string) => {
        if (!isAuthenticated || !user) {
            alert('Bu işlem için giriş yapmalısınız.');
            return;
        }

        try {
            await ReviewService.markHelpful(reviewId, user.uid);
            await loadReviews(); // Reload to update helpful count
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    };

    const handleReportReview = async (reviewId: string) => {
        if (!isAuthenticated || !user) {
            alert('Bu işlem için giriş yapmalısınız.');
            return;
        }

        const reason = prompt('Yorumu neden rapor ediyorsunuz?');
        if (reason) {
            try {
                await ReviewService.reportReview(reviewId, user.uid, reason);
                alert('Yorum rapor edildi. Teşekkürler.');
            } catch (error) {
                console.error('Error reporting review:', error);
            }
        }
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? 'button' : undefined}
                        onClick={interactive ? () => onRatingChange?.(star) : undefined}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        disabled={!interactive}
                    >
                        <Star
                            className={`h-5 w-5 ${star <= rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Müşteri Yorumları
                </h2>
                {isAuthenticated && (
                    <Button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        {showReviewForm ? 'İptal' : 'Yorum Yap'}
                    </Button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">
                            {productName} için Yorum Yazın
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                                    Puanınız *
                                </Label>
                                {renderStars(formData.rating, true, (rating) =>
                                    setFormData(prev => ({ ...prev, rating }))
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.rating} yıldız seçtiniz
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                    Başlık *
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Yorumunuz için kısa bir başlık"
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <Label htmlFor="comment" className="text-gray-700 dark:text-gray-300">
                                    Yorumunuz *
                                </Label>
                                <Textarea
                                    id="comment"
                                    value={formData.comment}
                                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Ürün hakkında detaylı yorumunuzu yazın..."
                                    rows={4}
                                    className="mt-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <Label className="text-gray-700 dark:text-gray-300 mb-2 block">
                                    Fotoğraf Ekle (İsteğe Bağlı)
                                </Label>
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    {imagePreviewUrls.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {imagePreviewUrls.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <Image
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        width={200}
                                                        height={200}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    {imagePreviewUrls.length < 5 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-gray-300 dark:border-gray-600"
                                        >
                                            <Camera className="h-4 w-4 mr-2" />
                                            Fotoğraf Seç ({imagePreviewUrls.length}/5)
                                        </Button>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        En fazla 5 fotoğraf yükleyebilirsiniz. JPG, PNG formatları desteklenir.
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowReviewForm(false)}
                                    className="border-gray-300 dark:border-gray-600"
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            <span>Gönderiliyor...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Send className="h-4 w-4 mr-2" />
                                            <span>Yorum Gönder</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    // Loading state
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </CardContent>
                        </Card>
                    ))
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Card key={review.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-6">
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {review.userName}
                                                </h4>
                                                {review.verified && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(review.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {review.title}
                                    </h5>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        {review.images.map((image: string, index: number) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={image}
                                                    alt={`Review image ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Review Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleMarkHelpful(review.id)}
                                            className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>Faydalı ({review.helpful || 0})</span>
                                        </button>
                                        <button
                                            onClick={() => handleReportReview(review.id)}
                                            className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Flag className="h-4 w-4" />
                                            <span>Rapor Et</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Henüz yorum yok
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Bu ürün için ilk yorumu siz yazın!
                            </p>
                            {isAuthenticated && (
                                <Button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    İlk Yorumu Yaz
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 