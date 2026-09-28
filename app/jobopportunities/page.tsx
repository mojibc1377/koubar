import CareerForm from "@/components/careerForm";
import RoastPipeline from "@/components/roastPipelines";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "فرصت‌های شغلی — کافه رستری کوبار",
  description:
    "به تیم کوبار بپیوند. رزومه‌ات رو برامون بفرست و برای همکاری با ما درخواست بده.",
};

export default function CareersPage() {
  return (
    <main
      lang="fa"
      className={` font-(family-name:--font-fa) bg-[#FFFBF5] min-h-screen`}
    >
      {/* بافت ظریف نقطه‌ای، یادآور دانه‌های قهوه */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #343434 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />

      <section className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-20 sm:pt-28 pb-16">
        <p className="font-mono text-[11px] text-[#8B5A2B] mb-5">
          کافه رستری کوبار — فرصت‌های شغلی
        </p>
        <h1
          className="text-[#343434] font-extrabold leading-tight"
          style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}
        >
          دانه‌ها رو خودمون رست می‌کنیم.
          <br />
          <span className="text-[#575B49]">بیا پشت بار وایسا.</span>
        </h1>
        <p className="text-[#343434]/70 text-lg max-w-xl mt-6 leading-loose">
          کوبار هم کافه‌ست، هم رستری قهوه. همیشه دنبال آدم‌هایی هستیم که به
          کیفیت فنجون قهوه همون‌قدر اهمیت می‌دن که ما می‌دیم — چه پشت بار،
          چه پشت دستگاه رست، چه هرجای بینشون.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
        <div className="border-t border-b border-[#575B49]/15 py-10">
          <RoastPipeline />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">
        <div className="mb-8">
          <p className="font-mono text-[11px] text-[#575B49]/70 mb-2">
            درخواست شغل
          </p>
          <h2 className="text-[#343434] font-bold text-3xl">
            فرم زیر رو پر کن
          </h2>
        </div>
        <CareerForm />
      </section>
    </main>
  );
}