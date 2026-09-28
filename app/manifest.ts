export default function manifest() {
  return {
    name: "کوبار | Koubar",
    short_name: "کوبار",
    description: "فروشگاه آنلاین قهوه تخصصی و منوی کافه کوبار",
    lang: "fa",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#343434",
    theme_color: "#575b49",
    icons: [
      { src: "/icons/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}