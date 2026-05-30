import { StaticPage } from "@/components/StaticPage";

const faqs = [
  {
    q: "قهوه چند روز پس از رُست ارسال می‌شود؟",
    a: "معمولاً ۱ تا ۳ روز کاری پس از رُست؛ تاریخ روی بسته درج می‌شود.",
  },
  {
    q: "آیا ارسال به شهرستان دارید؟",
    a: "بله، با پست پیشتاز و پیک در تهران.",
  },
  {
    q: "منوی کافه با فروشگاه آنلاین چه تفاوتی دارد؟",
    a: "منوی کافه برای سفارش حضوری و نوشیدنی آماده است؛ فروشگاه برای خرید دانه و اکسسوری.",
  },
];

export default function FaqPage() {
  return (
    <StaticPage title="سوالات متداول">
      {faqs.map((f) => (
        <div key={f.q}>
          <h2 className="font-bold text-foreground">{f.q}</h2>
          <p className="mt-2">{f.a}</p>
        </div>
      ))}
    </StaticPage>
  );
}
