import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venture Pakistan — Curated Pakistan Travel Experiences",
  description:
    "Plan unforgettable journeys across Hunza, Skardu, Swat, Chitral, Neelum Valley and beyond with Venture Pakistan. Curated journeys. Local insight. No ordinary tours.",
  openGraph: {
    type: "website",
    title: "Venture Pakistan — See Pakistan Differently",
    description:
      "Curated journeys across Pakistan. Hunza, Skardu, Fairy Meadows, Swat, Chitral, Neelum Valley, Lahore & Gwadar — designed around you.",
    url: "https://venturepakistan.pk/",
    images: [
      {
        url: "https://images.pexels.com/photos/19442083/pexels-photo-19442083.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venture Pakistan — See Pakistan Differently",
    description: "Curated journeys. Local insight. No ordinary tours.",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%230B0E14' stroke='%23C9A86A' stroke-width='2.5'/%3E%3Cpath d='M14 40 L24 26 L30 34 L36 24 L42 34 L48 40' fill='none' stroke='%23F5F1E8' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M27 14 L37 14 L32 19 Z' fill='%23C9A86A'/%3E%3Ccircle cx='32' cy='32' r='2.2' fill='%23C9A86A'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('tariq_travel_theme');var t=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link
          rel="preload"
          as="image"
          href="https://images.pexels.com/photos/19442083/pexels-photo-19442083.jpeg?auto=compress&cs=tinysrgb&w=1920&fm=webp"
          type="image/webp"
          // @ts-expect-error Next.js supports fetchPriority
          fetchpriority="high"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
