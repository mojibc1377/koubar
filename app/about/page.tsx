import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { logos } from "@/lib/icons";

export default function AboutPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <Image src={logos.english} alt="Koubar" width={140} height={40} />
        <h1 className="mt-8 text-4xl font-extrabold">درباره کوبار</h1>
        <div className="mt-10 space-y-6 leading-8 text-foreground/75">
          <p>
            کوبار رستری قهوه تخصصی در تهران است؛ دانه‌های منتخب را در دسته‌های کوچک
            رُست می‌کنیم و پروفایل طعمی شفاف برای اسپرسو و روش‌های دمی ارائه می‌دهیم.
          </p>
          <p>
            فضای کافه ما مکمل فروشگاه آنلاین است — همان بلندها را به‌صورت نوشیدنی
            آماده سرو تجربه کنید و با تیم ما درباره دم‌آوری گفتگو کنید.
          </p>
          <p>
            تعهد ما: تأمین مسئولانه، کیفیت کنترل‌شده و شفافیت در هر فنجان.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
