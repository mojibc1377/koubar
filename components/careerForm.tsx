"use client";

import { useState, useRef } from "react";

const DEPARTMENTS = [
  { value: "CAFE", label: "کافه — بار، سالن، صندوق" },
  { value: "ROASTERY", label: "رستری — رست، بسته‌بندی، انبار" },
  { value: "GENERAL", label: "عمومی — اداری، سایر" },
];

const MARRIAGE_STATUSES = [
  { value: "SINGLE", label: "مجرد" },
  { value: "MARRIED", label: "متأهل" },
];

const MILITARY_STATUSES = [
  { value: "NOT_APPLICABLE", label: "شامل نمی‌شود" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "انجام شده" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function CareerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [fileName, setFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "مشکلی پیش اومد.");
      }

      setApplicationNumber(data.applicationNumber);
      setStatus("success");

      form.reset();
      setFileName("");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "مشکلی پیش اومد.",
      );

      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="relative border border-[#575B49]/20 bg-white/70 rounded-sm px-8 py-12 text-center">
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[#8B5A2B] mb-3">
          تیکت ثبت شد
        </p>

        <h3
          className="font-[family-name:var(--font-mono)] text-3xl text-[#343434] mb-3"
          dir="ltr"
        >
          #{applicationNumber}
        </h3>

        <p className="text-[#343434]/70 max-w-sm mx-auto leading-relaxed">
          درخواستت ثبت شد. همه‌ی درخواست‌ها رو می‌خونیم — حداکثر تا دو هفته
          دیگه، در هر صورت، بهت خبر می‌دیم.
        </p>

        <button
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm text-[#575B49] underline underline-offset-4 hover:text-[#343434] transition-colors"
        >
          ارسال یک درخواست دیگه
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border border-[#575B49]/25 bg-white/70 rounded-sm"
    >
      {/* سربرگ تیکت */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-dashed border-[#575B49]/25">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#575B49]/70">
          تیکت پذیرش
        </span>

        <span
          className="font-[family-name:var(--font-mono)] text-[11px] text-[#8B5A2B]"
          dir="ltr"
        >
          Koubar Cafe Roastery
        </span>
      </div>

      <div className="px-6 sm:px-8 py-8 grid sm:grid-cols-2 gap-x-6 gap-y-6">
        {/* نام */}
        <Field label="نام و نام خانوادگی" required>
          <input
            name="fullName"
            required
            type="text"
            placeholder="اسمت رو بنویس"
            className="input-base"
          />
        </Field>

        {/* شماره تماس */}
        <Field label="شماره تماس" required>
          <input
            name="phone"
            required
            type="tel"
            placeholder="۰۹xx xxx xxxx"
            className="input-base"
            dir="ltr"
          />
        </Field>

        {/* ایمیل */}
        <Field label="ایمیل">
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="input-base"
            dir="ltr"
          />
        </Field>

        {/* سن */}
        <Field label="سن" required>
          <input
            name="age"
            required
            type="number"
            min={15}
            max={100}
            placeholder="مثلاً ۲۵"
            className="input-base"
          />
        </Field>

        {/* وضعیت تأهل */}
        <Field label="وضعیت تأهل" required>
          <select
            name="marriageStatus"
            required
            defaultValue=""
            className="input-base"
          >
            <option value="" disabled>
              انتخاب کن
            </option>

            {MARRIAGE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>

        {/* وضعیت نظام وظیفه */}
        <Field label="وضعیت نظام وظیفه" required>
          <select
            name="militaryStatus"
            required
            defaultValue=""
            className="input-base"
          >
            <option value="" disabled>
              انتخاب کن
            </option>

            {MILITARY_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>

        {/* آدرس */}
        <Field label="آدرس محل سکونت" required className="sm:col-span-2">
          <textarea
            name="address"
            required
            rows={3}
            placeholder="آدرس محل سکونت"
            className="input-base resize-none"
          />
        </Field>

        {/* بخش */}
        <Field label="بخش" required>
          <select
            name="department"
            required
            defaultValue=""
            className="input-base"
          >
            <option value="" disabled>
              انتخاب کن
            </option>

            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        {/* عنوان شغلی */}
        <Field label="عنوان شغلی" required>
          <input
            name="positionTitle"
            required
            type="text"
            placeholder="مثلاً باریستا، سر-رست‌گر، راننده پخش"
            className="input-base"
          />
        </Field>

        {/* پیام */}
        <Field
          label="چیزی هست که بخوای بهمون بگی؟"
          className="sm:col-span-2"
        >
          <textarea
            name="message"
            rows={4}
            placeholder="سابقه کار، ساعات در دسترس، چرا کوبار..."
            className="input-base resize-none"
          />
        </Field>

        {/* رزومه */}
        <Field label="رزومه" required className="sm:col-span-2">
          <label
            htmlFor="resume"
            className="flex items-center justify-between gap-4 border border-[#575B49]/30 border-dashed rounded-sm px-4 py-3 cursor-pointer hover:border-[#8B5A2B]/60 transition-colors"
          >
            <span className="text-sm text-[#343434]/70 truncate">
              {fileName || "PDF یا Word · حداکثر ۵ مگابایت"}
            </span>

            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#8B5A2B] shrink-0">
              {fileName ? "تغییر" : "پیوست کن"}
            </span>
          </label>

          <input
            ref={fileInputRef}
            id="resume"
            name="resume"
            type="file"
            required
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={(e) =>
              setFileName(e.target.files?.[0]?.name || "")
            }
          />
        </Field>
      </div>

      <div className="px-6 sm:px-8 py-5 border-t border-dashed border-[#575B49]/25 flex items-center justify-between gap-4">
        {status === "error" ? (
          <p className="text-sm text-[#8B5A2B]">
            {errorMsg}
          </p>
        ) : (
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[#343434]/40">
            از این اطلاعات فقط برای تماس درباره‌ی این فرصت شغلی استفاده می‌کنیم.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 bg-[#343434] text-[#FFFBF5] px-6 py-2.5 rounded-sm text-sm hover:bg-[#575B49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting"
            ? "در حال ثبت تیکت…"
            : "ارسال درخواست"}
        </button>
      </div>

      <style jsx global>{`
        .input-base {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(87, 91, 73, 0.3);
          padding: 8px 2px;
          font-size: 0.95rem;
          color: #343434;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-base::placeholder {
          color: rgba(52, 52, 52, 0.35);
        }

        .input-base:focus {
          border-bottom-color: #8b5a2b;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[12px] text-[#575B49]/70 mb-1.5">
        {label}
        {required && (
          <span className="text-[#8B5A2B]"> *</span>
        )}
      </label>

      {children}
    </div>
  );
}