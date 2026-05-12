import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import PWAIntegration from "@/components/shared/PWAIntegration";
import { SecurityGuard } from "@/components/security/SecurityGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SFL Stream | A Melhor Experiência de Streaming",
  description: "Assista a filmes, séries e esportes ao vivo com a melhor qualidade.",
  openGraph: {
    title: "SFL Stream | A Melhor Experiência de Streaming",
    description: "Assista a filmes, séries e esportes ao vivo com a melhor qualidade.",
    images: [
      {
        url: "https://i.imgur.com/2ex0N3R.png",
        width: 1200,
        height: 630,
        alt: "SFL Grupo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SFL Stream | A Melhor Experiência de Streaming",
    description: "Assista a filmes, séries e esportes ao vivo com a melhor qualidade.",
    images: ["https://i.imgur.com/2ex0N3R.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SFL Stream",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00a651",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden" suppressHydrationWarning>
        <SessionProvider>
          <PWAIntegration />
          <SecurityGuard>
            {children}
          </SecurityGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
