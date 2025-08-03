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
  title: "Jaxophone Music Shop - Türkiye'nin En Büyük Enstrüman Mağazası",
  description: "Gitarlar, piyanolar, davullar ve daha fazlası. Kaliteli müzik enstrümanları ve profesyonel hizmet.",
  keywords: ["müzik", "enstrüman", "gitar", "piyano", "davul", "müzik mağazası"],
  authors: [{ name: "Jaxophone" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
