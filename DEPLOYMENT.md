# 🚀 Jaxophone Music Shop - Deployment Rehberi

## 📋 Deploy Öncesi Kontrol Listesi

### ✅ **1. Environment Variables**
```bash
# .env.local dosyasını oluştur ve şu değişkenleri ekle:
cp .env.example .env.local
```

**Gerekli Environment Variables:**
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase Project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID
- `RESEND_API_KEY` - Resend Email Service API Key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API Key
- `NEXT_PUBLIC_SITE_URL` - Site URL (örn: https://jaxophone.com)

### ✅ **2. Firebase Konfigürasyonu**
1. **Firestore Security Rules** güncellenmiş olmalı
2. **Authentication** aktif olmalı (Email/Password + Google)
3. **Storage Rules** ayarlanmış olmalı
4. **Domain** doğrulanmış olmalı (email göndermek için)

### ✅ **3. Resend Email Service**
1. **Domain verification** tamamlanmış olmalı
2. **API Key** alınmış ve environment variable'a eklenmiş olmalı

### ✅ **4. Google Maps API**
1. **Google Cloud Console'da API aktif** edilmiş olmalı
2. **Billing** aktif edilmiş olmalı
3. **API Key** kısıtlamaları ayarlanmış olmalı

## 🌐 **Vercel Deploy**

### Adım 1: Vercel'e Deploy Et
```bash
# Vercel CLI kurulu değilse
npm i -g vercel

# Deploy
vercel

# Environment variables ekle
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add RESEND_API_KEY
# ... diğer environment variables
```

### Adım 2: Domain Bağla
1. Vercel dashboard'da project'i aç
2. **Settings > Domains** git
3. Custom domain ekle
4. DNS ayarlarını güncelle

## 🔧 **Production Optimizasyonları**

### 1. Next.js Build Optimization
```json
// next.config.ts - zaten ayarlanmış
{
  "images": {
    "domains": ["images.unsplash.com", "lh3.googleusercontent.com"]
  }
}
```

### 2. Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read only for users
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // User data - only own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reviews - authenticated users
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner() || isAdmin();
    }
  }
}
```

## 🚨 **Güvenlik Kontrolü**

### ✅ **Yapılması Gerekenler:**
- [ ] Firebase API Keys environment variable'da
- [ ] Resend API Key gizli
- [ ] Google Maps API Key kısıtlamaları ayarlanmış
- [ ] Firestore security rules production-ready
- [ ] HTTPS zorlaması aktif
- [ ] CORS ayarları doğru

## 📊 **Performance Kontrolleri**

### ✅ **Optimize Edilmiş Özellikler:**
- [x] Image optimization (Next.js Image component)
- [x] Code splitting (Next.js automatic)
- [x] Lazy loading (React Suspense)
- [x] Bundle optimization (useMemo, useCallback)
- [x] Database query optimization (Firestore indexes)

## 🎯 **Deploy Sonrası Test Listesi**

### ✅ **Fonksiyonel Testler:**
- [ ] Kullanıcı kayıt/giriş çalışıyor
- [ ] Ürün ekleme/silme çalışıyor (admin)
- [ ] Sepet işlemleri çalışıyor
- [ ] Email gönderimi çalışıyor
- [ ] Google Maps yükleniyor
- [ ] Responsive design tüm cihazlarda çalışıyor
- [ ] Dark/Light mode çalışıyor
- [ ] Arama fonksiyonu çalışıyor
- [ ] Kategori filtreleme çalışıyor

### ✅ **Performance Testleri:**
- [ ] Lighthouse Score > 90
- [ ] Core Web Vitals yeşil
- [ ] Mobile performance iyileştirilmiş

## 📝 **Son Kontroller**

### ✅ **İçerik:**
- [ ] Logo ve branding doğru
- [ ] İletişim bilgileri güncel
- [ ] Yasal sayfalar mevcut (Gizlilik Politikası, Kullanım Şartları)
- [ ] 404 sayfası tasarlanmış
- [ ] Meta tags (SEO) eklenmiş

### ✅ **Analitik:**
- [ ] Google Analytics kurulmuş (opsiyonel)
- [ ] Error tracking kurulmuş (opsiyonel)
- [ ] Performance monitoring (opsiyonel)

## 🔗 **Faydalı Linkler**
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Resend Dashboard](https://resend.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ⚠️ **ÖNEMLİ NOTLAR**

1. **Environment Variables** mutlaka deployment platform'da ayarlanmalı
2. **Firebase Security Rules** production için güncellenmeli
3. **Domain verification** e-mail servisi için kritik
4. **Google Maps API** billing aktif edilmeli
5. **HTTPS** mutlaka kullanılmalı 