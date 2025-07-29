import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from '@/components/providers/redux-provider';
import { LoadingProvider } from '@/components/providers/loading-provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Jaxophone Music Shop - Türkiye'nin En Büyük Enstrüman Mağazası",
  description: "Gitarlar, piyanolar, davullar ve daha fazlası. Kaliteli müzik enstrümanları ve profesyonel hizmet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReduxProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
