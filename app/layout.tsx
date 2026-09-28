import type { Metadata, Viewport } from "next";

import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/providers/Providers";

import "./globals.css";
import { yekanBakh } from "./local-fonts";
import { AppleSplashLinks } from "./apple-splash-links";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "کوبار | Koubar — قهوه تخصصی",
  description:
    "فروشگاه آنلاین قهوه تخصصی و منوی کافه کوبار — دانه تازه‌رُست و نوشیدنی‌های دمی.",

  applicationName: "کوبار",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "کوبار",
  },

  icons: {
    icon: [
      {
        url: "/icons/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
    theme_color: "#575b49",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${yekanBakh.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
      <meta name="enamad" content="11499677" />
          <AppleSplashLinks />

        <link
    rel="apple-touch-startup-image"
    media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
    href="/splash_screens/iPhone_14_portrait.png"
  />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var p = location.pathname;
                var m =
                  p === "/cafe" || p.indexOf("/cafe/") === 0
                    ? "cafe"
                    : "shop";

                document.documentElement.dataset.platform = m;

                document.documentElement.style.colorScheme =
                  m === "shop" ? "dark" : "light";
              } catch(e) {
                document.documentElement.dataset.platform = "shop";
                document.documentElement.style.colorScheme = "dark";
              }
            })();`,
          }}
        />
      </head>

      <body className="min-h-full antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}