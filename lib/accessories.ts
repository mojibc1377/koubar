import type { AccessoryItem } from "./types";

export const accessories: AccessoryItem[] = [
  {
    id: "kinto-mug",
    title: "ماگ سرامیکی کینتو",
    description: "ماگ مینیمال با نگه‌داری دمای مناسب برای اسپرسو و لاته.",
    longDescription:
      "طراحی ژاپنی با دسته ارگونومیک و لعاب مات. مناسب سرو روزانه در خانه یا محل کار. ظرفیت ۳۰۰ میلی‌لیتر.",
    image: "/images/gifting-art.png",
    price: 1_200_000,
    badge: "محبوب",
    notes: ["سرامیک", "۳۰۰ml", "ماشین‌ظرفشویی"],
    category: "لیوان و سرو",
  },
  {
    id: "v60-filter",
    title: "فیلتر V60",
    description: "فیلتر کاغذی اورجینال برای دم‌آوری شفاف و تمیز.",
    longDescription:
      "بسته ۱۰۰ عددی — سازگار با dripper استاندارد V60. برای تک‌خاستگاه‌های روشن ایده‌آل است.",
    image: "/images/hero.png",
    price: 450_000,
    notes: ["۱۰۰ عدد", "Oxygen bleached"],
    category: "فیلتر و دم‌آوری",
  },
  {
    id: "gooseneck-kettle",
    title: "کتل برقی گوسنیک",
    description: "کتل با دهانه غازه‌ای برای کنترل دقیق ریختن آب.",
    longDescription:
      "کنترل دما تا ۹۲ درجه، نگه‌داری حرارت و جریان آب یکنواخت برای V60 و کمکس. انتخاب باریستاهای خانگی.",
    image: "/images/seasonal.png",
    price: 8_500_000,
    badge: "پرفروش",
    notes: ["۰.۸ لیتر", "کنترل دما", "استیل"],
    category: "تجهیزات دم",
  },
  {
    id: "comandante-grinder",
    title: "آسیاب دستی کامکس",
    description: "آسیاب دستی با تیغه باکیفیت برای اسپرسو و دمی.",
    longDescription:
      "پهنای آسیاب قابل تنظیم، بدنه آلومینیومی و آسیاب یکنواخت. همراه کیف حمل برای سفر و کمپینگ.",
    image: "/images/products-carousel.png",
    price: 3_200_000,
    notes: ["تیغه مخروطی", "قابل حمل"],
    category: "آسیاب",
  },
  {
    id: "scale-timer",
    title: "ترازو و تایمر دم‌آوری",
    description: "ترازوی دقیق با تایمر یکپارچه برای V60 و اسپرسو.",
    longDescription:
      "دقت ۰.۱ گرم، تایمر شمارش معکوس و سطح ضد‌لغزش. ابزار ضروری برای دیال-این خانگی.",
    image: "/images/gifts.png",
    price: 2_100_000,
    category: "ابزار",
  },
  {
    id: "tamper-kit",
    title: "تمپر و پد تمیزکاری",
    description: "ست تمپر ۵۸ میلی‌متری با پد ضد‌لغزش.",
    longDescription:
      "فشار یکنواخت برای بست اسپرسو. پد سیلیکونی برای تمیز نگه‌داشتن پیشخوان باریستا.",
    image: "/images/hero.png",
    price: 890_000,
    category: "اسپرسو",
  },
];
