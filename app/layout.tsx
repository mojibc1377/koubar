import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "کوبار | Koubar — قهوه تخصصی",
  description:
    "فروشگاه آنلاین قهوه تخصصی و منوی کافه کوبار — دانه تازه‌رُست و نوشیدنی‌های دمی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var m=p==="/cafe"||p.indexOf("/cafe/")===0?"cafe":"shop";document.documentElement.dataset.platform=m;document.documentElement.style.colorScheme=m==="shop"?"dark":"light";}catch(e){document.documentElement.dataset.platform="shop";document.documentElement.style.colorScheme="dark";}})();`,
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
