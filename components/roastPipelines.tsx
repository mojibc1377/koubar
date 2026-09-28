const STAGES = [
  { roast: "دانه سبز", hire: "ثبت شد", desc: "تیکتت رو دریافت می‌کنیم." },
  { roast: "زرد", hire: "بررسی شد", desc: "همه‌ی درخواست‌ها رو می‌خونیم." },
  { roast: "کرک اول", hire: "مصاحبه", desc: "حضوری با هم صحبت می‌کنیم." },
  { roast: "توسعه", hire: "پیشنهاد", desc: "روی نقش توافق می‌کنیم." },
  { roast: "تخلیه", hire: "استخدام", desc: "به تیم می‌پیوندی." },
];

export default function RoastPipeline() {
  return (
    <div className="w-full">
      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[#575B49]/70 mb-4">
        مسیر بررسی درخواست — دقیقاً مثل مسیر رست
      </p>

      {/* منحنی — چون یک نمودار داده است نه متن، جهت آن ثابت می‌ماند */}
      <svg
        viewBox="0 0 560 160"
        className="w-full h-auto"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 10 140 C 120 138, 180 120, 230 90 C 270 66, 300 40, 340 26 C 400 6, 470 4, 550 4"
          fill="none"
          stroke="#575B49"
          strokeWidth="2"
          strokeOpacity="0.35"
        />
        {STAGES.map((_, i) => {
          const x = 10 + (i * 540) / (STAGES.length - 1);
          const t = i / (STAGES.length - 1);
          const y = 140 - t * 136 + Math.sin(t * Math.PI) * -6;
          return (
            <circle
              key={i}
              cx={x}
              cy={Math.max(6, y)}
              r={i === STAGES.length - 1 ? 6 : 4.5}
              fill={i === STAGES.length - 1 ? "#8B5A2B" : "#575B49"}
            />
          );
        })}
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-2">
        {STAGES.map((s, i) => (
          <div key={s.hire} className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#8B5A2B]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[11px] text-[#575B49]/60">
                {s.roast}
              </span>
            </div>
            <p className="font-medium text-[#343434] text-sm mt-0.5">
              {s.hire}
            </p>
            <p className="text-[#343434]/60 text-xs mt-0.5 leading-snug">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}