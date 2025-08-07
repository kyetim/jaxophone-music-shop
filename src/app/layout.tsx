import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from '@/components/providers/redux-provider';
import { LoadingProvider } from '@/components/providers/loading-provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Jaxophone Music Shop - Türkiye'nin En Büyük Müzik Enstrümanları Mağazası",
    template: "%s | Jaxophone Music Shop"
  },
  description: "Gitar, piyano, davul, üflemeli ve yaylı çalgılar. Türkiye'nin en büyük müzik enstrümanları mağazasından güvenle alışveriş yapın. Ücretsiz kargo, 2 yıl garanti.",
  keywords: [
    "müzik enstrümanları",
    "gitar",
    "piyano",
    "davul",
    "saksafon",
    "keman",
    "müzik mağazası",
    "enstrüman satış",
    "Türkiye"
  ],
  authors: [{ name: "Jaxophone Music Shop" }],
  creator: "Jaxophone Music Shop",
  publisher: "Jaxophone Music Shop",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jaxophone.com'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    title: "Jaxophone Music Shop - Türkiye'nin En Büyük Müzik Enstrümanları Mağazası",
    description: "Gitar, piyano, davul, üflemeli ve yaylı çalgılar. Türkiye'nin en büyük müzik enstrümanları mağazasından güvenle alışveriş yapın.",
    siteName: 'Jaxophone Music Shop',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-simple.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ReduxProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
