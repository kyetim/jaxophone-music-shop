# 🔥 Firebase Setup Rehberi

## 1. Firebase Console'da Proje Oluşturma

### Adım 1: Firebase Console'a Git
- [https://console.firebase.google.com/](https://console.firebase.google.com/) adresine git
- Google hesabınla giriş yap

### Adım 2: Yeni Proje Oluştur
1. **"Create a project"** butonuna tıkla
2. **Proje adı**: `jaxophone-music-shop`
3. **Continue** butonuna tıkla
4. **Google Analytics**: AÇIK bırak (önerilen)
5. **Analytics location**: Turkey seç
6. **Create project** butonuna tıkla
7. **Continue** butonuna tıkla (hazır olduğunda)

## 2. Web App Ekleme

### Adım 3: Web App Kur
1. Project Overview sayfasında **</> (Web)** ikonuna tıkla
2. **App nickname**: `jaxophone-web`
3. **Firebase Hosting**: ✅ TIKLA (önemli!)
4. **Register app** butonuna tıkla

### Adım 4: Firebase SDK Bilgilerini Kaydet
Şu ekranda gözükecek config bilgilerini KOPYALA:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "jaxophone-music-shop.firebaseapp.com",
  projectId: "jaxophone-music-shop",
  storageBucket: "jaxophone-music-shop.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
};
```
**BU BİLGİLERİ SAKLA!** Sonra lazım olacak.

## 3. Authentication Kurulumu

### Adım 5: Authentication Aktif Et
1. Sol menüden **"Authentication"** seç
2. **"Get started"** butonuna tıkla
3. **"Sign-in method"** sekmesine git
4. Şu providers'ları aktif et:
   - ✅ **Email/Password** → Enable → Save
   - ✅ **Google** → Enable → Save (opsiyonel)

## 4. Firestore Database Kurulumu

### Adım 6: Firestore Oluştur
1. Sol menüden **"Firestore Database"** seç
2. **"Create database"** butonuna tıkla
3. **Security rules**: "Start in test mode" seç
4. **Location**: europe-west3 (Frankfurt) seç
5. **Done** butonuna tıkla

## 5. Güvenlik Kuralları

### Adım 7: Security Rules Güncelle
Firestore Database → Rules sekmesine git ve şunu yaz:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders belong to authenticated users
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Products are public for reading
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Categories are public
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 6. Hosting Kurulumu (İleriye Dönük)

### Adım 8: Hosting Hazırla
1. Sol menüden **"Hosting"** seç
2. **"Get started"** butonuna tıkla
3. Firebase CLI'yi şimdilik kurma, sadece **"Next"** → **"Continue to console"**

---

## ✅ Firebase Console Kurulumu Tamamlandı!

**Sonraki adım**: Next.js projesine Firebase SDK'yı eklemek.

**Hazır olduğunuzda bana şunu söyleyin:**
1. "Firebase projem oluştu" ✅
2. Firebase config bilgilerini aldınız ✅
3. Authentication aktif ✅
4. Firestore database kuruldu ✅

Sonra kod tarafına geçeceğiz! 