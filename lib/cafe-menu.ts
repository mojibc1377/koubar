import type { CafeCategory } from "./types";

export const cafeMenu: CafeCategory[] = [
  {
    id: "espresso",
    name: "اسپرسو",
    items: [
      {
        id: "espresso-single",
        name: "اسپرسو سینگل",
        description: "شات ۳۰ میلی‌لیتر از بلند روز",
        longDescription:
          "استخراج کوتاه، عطر بالا و اسیدیته کنترل‌شده. مناسب کسانی که طعم خالص دانه را می‌خواهند.",
        image: "/images/hero.png",
        notes: ["شکلات تلخ", "کارامل", "پایان تمیز"],
        price: 120_000,
      },
      {
        id: "espresso-double",
        name: "اسپرسو دوبل",
        description: "دو شات متعادل با کرمای غلیظ",
        longDescription:
          "گزینه محبوب کافه. دوبل استاندارد با بادی بیشتر و تعادل شیرینی/تلخی برای شروع روز.",
        image: "/images/seasonal.png",
        notes: ["بادی متوسط", "کرمای غلیظ", "اسیدیته متعادل"],
        price: 150_000,
        badge: "پرفروش",
      },
      {
        id: "americano",
        name: "آمریکانو",
        description: "اسپرسو + آب داغ",
        longDescription:
          "شفاف و سبک‌تر از اسپرسو، با حفظ عطر اصلی. انتخاب عالی برای نوشیدن طولانی‌تر.",
        image: "/images/gifting-art.png",
        notes: ["شفاف", "تلخی ملایم", "پایان نرم"],
        price: 145_000,
      },
      {
        id: "macchiato",
        name: "ماکیاتو",
        description: "اسپرسو با لکه فوم شیر",
        longDescription:
          "تعادل دلچسب بین شدت اسپرسو و لطافت شیر. بافت خامه‌ای در جرعه اول.",
        image: "/images/gifts.png",
        notes: ["مخملی", "کاراملی", "فوم سبک"],
        price: 155_000,
      },
    ],
  },
  {
    id: "milk",
    name: "نوشیدنی‌های شیردار",
    items: [
      {
        id: "cortado",
        name: "کورتادو",
        description: "اسپرسو با شیر بخار داده شده — نسبت ۱:۱",
        longDescription:
          "نسبت یک‌به‌یک شیر و اسپرسو، برای حفظ شخصیت دانه و کاهش تیزی اسیدیته.",
        image: "/images/gifts.png",
        notes: ["متعادل", "شیرین", "بافت نرم"],
        price: 175_000,
      },
      {
        id: "latte",
        name: "لاته",
        description: "اسپرسو با شیر نرم و فوم کم",
        longDescription:
          "لاته کلاسیک با میکروفوم ابریشمی. مناسب طعم‌های نرم و قابل شخصی‌سازی با شربت.",
        image: "/images/gifting-art.png",
        notes: ["ابریشمی", "شیرین ملایم", "آروماتیک"],
        price: 195_000,
        badge: "پرفروش",
      },
      {
        id: "cappuccino",
        name: "کاپوچینو",
        description: "فوم غلیظ و بادی متعادل",
        longDescription:
          "فوم بیشتر نسبت به لاته و طعم قهوه برجسته‌تر؛ کلاسیک همیشگی برای طرفداران قهوه شیردار.",
        image: "/images/seasonal.png",
        notes: ["فوم زیاد", "کاکائویی", "پایان خشک‌تر"],
        price: 190_000,
      },
      {
        id: "flat-white",
        name: "فلت وایت",
        description: "دوبل اسپرسو با میکروفوم ابریشمی",
        longDescription:
          "غلظت قهوه بیشتر با شیر کمتر از لاته. مناسب دوستداران طعم پررنگ‌تر در نوشیدنی شیردار.",
        image: "/images/hero.png",
        notes: ["غلیظ", "شیر کمتر", "بادی بالا"],
        price: 205_000,
      },
    ],
  },
  {
    id: "brew",
    name: "دم‌آوری",
    items: [
      {
        id: "v60",
        name: "V60",
        description: "تک‌خاستگاه روز — پروفایل روشن",
        longDescription:
          "دم‌آوری دستی با تمرکز بر شفافیت طعمی. هر روز با دانه منتخب و رُست مناسب سرو می‌شود.",
        image: "/images/seasonal.png",
        notes: ["شفاف", "گلی", "اسیدیته روشن"],
        price: 220_000,
      },
      {
        id: "chemex",
        name: "کمکس",
        description: "فنجان تمیز با بادی سبک",
        longDescription:
          "فیلتر ضخیم‌تر کمکس روغن‌های بیشتر را حذف می‌کند و فنجانی سبک و تمیز می‌دهد.",
        image: "/images/gifts.png",
        notes: ["سبک", "تمیز", "نت میوه‌ای"],
        price: 240_000,
      },
      {
        id: "cold-brew",
        name: "کلد برو",
        description: "دم‌آوری سرد ۱۶ ساعته",
        longDescription:
          "استخراج سرد طولانی برای بافت نرم و تلخی پایین. سرو روی یخ یا به‌صورت خالص.",
        image: "/images/gifting-art.png",
        notes: ["خنک", "تلخی پایین", "شیرینی طبیعی"],
        price: 200_000,
        badge: "فصلی",
      },
    ],
  },
  {
    id: "non-coffee",
    name: "غیرقهوه‌ای",
    items: [
      {
        id: "matcha",
        name: "ماچا لته",
        description: "ماچای سیرامونت با شیر بخار",
        longDescription:
          "ماچای باکیفیت با بافت خامه‌ای و انرژی ملایم. گزینه عالی برای بدون قهوه‌ها.",
        image: "/images/gifts.png",
        notes: ["علفی ملایم", "کرم‌دار", "متعادل"],
        price: 210_000,
      },
      {
        id: "hot-chocolate",
        name: "هات چاکلت",
        description: "شکلات تلخ ۷۰٪ بلژیکی",
        longDescription:
          "ترکیب شکلات اصیل و شیر بخار داده‌شده برای تجربه‌ای غلیظ و گرم.",
        image: "/images/hero.png",
        notes: ["شکلاتی", "غلیظ", "گرم"],
        price: 185_000,
      },
      {
        id: "tea",
        name: "چای ماسالا",
        description: "ادویه‌جات تازه و شیر",
        longDescription:
          "ترکیب دارچین، هل و زنجبیل تازه با شیر برای نوشیدنی معطر و آرامش‌بخش.",
        image: "/images/seasonal.png",
        notes: ["ادویه‌ای", "گرم", "معطر"],
        price: 175_000,
      },
    ],
  },
];
