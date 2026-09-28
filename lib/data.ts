export const navLinks = [
  { href: "#products", label: "محصولات" },
  { href: "#accessories", label: "اکسسوری‌ها" },
  { href: "#knowledge", label: "دانش قهوه" },
  { href: "#contact", label: "تماس با ما" },
] as const;

export const features = [
  { label: "کیفیت دقیق و کنترل‌شده", icon: "cup" as const },
  { label: "تأمین مسئولانه و اخلاقی", icon: "branch" as const },
  { label: "رست در دسته‌های کوچک", icon: "beans" as const },
  { label: "اشتراک متناسب با سلیقه شما", icon: "bags" as const },
] as const;

export const limitedProducts = [
  {
    id: "african-8020",
    title: "دانه قهوه 80/20 آفریقایی ۱ کیلوگرمی",
    description: "پروفایل روشن با نت‌های میوه‌ای و اسیدیته دلنشین.",
    price: 4_950_000,
    badge: "پرفروش",
    variant: "african" as const,
  },
  {
    id: "kenya-washed",
    title: "دانه قهوه کنیا واشد ۱ کیلوگرمی",
    description: "اسیدیته روشن و عطر گلی-میوه‌ای از کنیا.",
    price: 6_500_000,
    badge: "پرفروش",
    variant: "kenya" as const,
  },
  {
    id: "street-line",
    title: "قهوه استریت لاین ۱ کیلوگرمی",
    description: "بلند اختصاصی با تعادل شیرینی و بادی مناسب.",
    price: 5_550_000,
    badge: "پرفروش",
    variant: "street" as const,
  },
  {
    id: "american-100",
    title: "دانه قهوه ۱۰۰ آمریکایی ۱ کیلوگرمی",
    description: "پروفایل متعادل با بادی غنی و نت‌های کاکائویی.",
    price: 5_200_000,
    badge: "پرفروش",
    variant: "street" as const,
  },
] as const;

export const testimonials = [
  {
    quote:
      "تازگی و کیفیت این قهوه واقعاً بی‌نظیر است؛ هر روز صبح بخشی از روتین من شده.",
    name: "سارا رضایی",
    role: "علاقه‌مند به قهوه",
  },
  {
    quote:
      "پروفایل طعمی شفاف و رُست یکدست؛ برای اسپرسوی خانگی عالی است.",
    name: "امیر حسینی",
    role: "باریستای خانگی",
  },
  {
    quote:
      "بسته‌بندی و ارسال سریع؛ هر بار دقیقاً همان طعمی که انتظار دارم.",
    name: "نیلوفر کاظمی",
    role: "مشتری اشتراک ماهانه",
  },
] as const;

export const footerProducts = [
  "اسپشیالتی",
  "آفریقایی",
  "آمریکایی",
  "ترکیبی",
  "دی کف",
] as const;

export const footerEcosystem = [
  "رستری قهوه تخصصی",
  "راهنمای خرید قهوه",
  "اکسسوری‌ها",
  "دانش قهوه",
] as const;

export const footerCompany = ["لیست قیمت", "درباره ما", "وبلاگ"] as const;
