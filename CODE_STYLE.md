# Jaxophone Music Shop – Kodlama Standartları & Proje Yapısı

## 1. Genel Yaklaşım

- **Dil:** Tüm kod TypeScript ile yazılmalı.
- **Framework:** Next.js (App Router), React, Shadcn UI, Radix UI, Tailwind CSS.
- **Programlama Tarzı:** Fonksiyonel ve deklaratif. Sınıflardan kaçınılmalı.
- **Dosya Yapısı:** Her dosyada önce ana bileşen, ardından alt bileşenler, yardımcı fonksiyonlar, statik içerik ve tipler yer almalı.

---

## 2. Dosya ve Dizin Yapısı

- **Dizinler:** Küçük harf ve tire ile (`components/auth-wizard`).
- **Bileşenler:** Her bileşen kendi dosyasında, named export ile.
- **Yardımcılar:** `helpers/` dizininde saf fonksiyonlar.
- **Tipler:** `interfaces/` dizininde, sadece interface kullan.

---

## 3. Adlandırma Kuralları

- **Değişkenler:** Anlamlı, yardımcı fiil içeren isimler (`isLoading`, `hasError`).
- **Dizinler:** Küçük harf, tireli (`product-list`).
- **Bileşenler:** Named export, PascalCase (`export function ProductList()`).

---

## 4. TypeScript Kullanımı

- **interface** kullan, **type** ve **enum**'dan kaçın.
- **Map** ile sabitler oluştur.
- **Fonksiyonel Bileşenler:** Her zaman fonksiyon bildirimi ile:
  ```tsx
  export function ProductList(props: ProductListProps) { ... }
  ```
- **Props ve State:** Her zaman interface ile tiplenmeli.

---

## 5. Söz Dizimi ve Biçimlendirme

- **Fonksiyonlar:** Saf fonksiyonlar için `function` anahtar kelimesi.
- **Kısa Koşullar:** Gereksiz süslü parantezlerden kaçın.
- **JSX:** Deklaratif ve okunabilir olmalı.

---

## 6. UI ve Stil

- **Bileşenler:** Shadcn UI ve Radix UI ile oluştur.
- **Stil:** Tailwind CSS, mobile-first yaklaşım.
- **Responsive:** Her bileşen mobilde düzgün çalışmalı.

---

## 7. Performans ve Optimizasyon

- **use client:** Minimumda tut.
  - Sadece Web API erişimi gereken küçük bileşenlerde.
  - Veri çekme ve state yönetimi için kullanma.
- **React Server Components:** Tercih et.
- **Suspense:** Client bileşenleri için fallback ile kullan.
- **Dinamik Yükleme:** Kritik olmayan bileşenlerde.
- **Görseller:** WebP formatı, boyut bilgisi, lazy loading.
- **Web Vitals:** LCP, CLS, FID optimize edilmeli.

---

## 8. State ve URL Yönetimi

- **URL Parametreleri:** `nuqs` ile yönet.
- **State:** Mümkünse server component veya URL ile.

---

## 9. Next.js Standartları

- **Veri Çekme:** Next.js dokümantasyonuna uygun (getServerSideProps, fetch, cache).
- **Yönlendirme:** App Router kullan.
- **SSR:** Mümkün olduğunca kullan.

---

## 10. Örnek Bileşen

```tsx
// components/product-list/product-list.tsx
import { Card } from "@/components/ui/card";
import { Product } from "@/interfaces/product";

export interface ProductListProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductList({ products, isLoading }: ProductListProps) {
  if (isLoading) return <div>Yükleniyor...</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(product =>
        <Card key={product.id}>
          <img
            src={product.imageWebp}
            alt={product.name}
            width={300}
            height={300}
            loading="lazy"
            className="rounded"
          />
          <div>{product.name}</div>
          <div>{product.price}₺</div>
        </Card>
      )}
    </div>
  );
}
``` 