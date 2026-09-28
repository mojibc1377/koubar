"use client";

import { useMemo } from "react";
import {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
} from "jalaali-js";

const monthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export type ShamsiValue = {
  jy: number;
  jm: number; // 1-12
  jd: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
} | null;

function toEnDigits(str: string) {
  // convenience if you ever paste fa digits in; not required, kept for safety
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)));
}

// Converts a ShamsiValue into a real JS Date (Gregorian, local time)
export function shamsiValueToDate(v: ShamsiValue): Date | null {
  if (!v) return null;
  const { gy, gm, gd } = toGregorian(v.jy, v.jm, v.jd);
  return new Date(gy, gm - 1, gd, v.hour, v.minute, 0, 0);
}

// Converts a real JS Date into a ShamsiValue (for pre-filling a picker)
export function dateToShamsiValue(d: Date): ShamsiValue {
  const { jy, jm, jd } = toJalaali(d);
  return { jy, jm, jd, hour: d.getHours(), minute: d.getMinutes() };
}

const selectClass =
  "rounded-lg border border-[#fffbf51a] bg-[#00000020] px-2 py-2 text-sm text-[#fffbf5] outline-none";

export function ShamsiDateTimePicker({
  label,
  value,
  onChange,
  yearsBack = 3,
  yearsForward = 1,
}: {
  label: string;
  value: ShamsiValue;
  onChange: (v: ShamsiValue) => void;
  yearsBack?: number;
  yearsForward?: number;
}) {
  const now = useMemo(() => toJalaali(new Date()), []);
  const currentJy = now.jy;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = currentJy - yearsBack; y <= currentJy + yearsForward; y++) {
      arr.push(y);
    }
    return arr;
  }, [currentJy, yearsBack, yearsForward]);

  const dayCount = useMemo(() => {
    if (!value) return 31;
    return jalaaliMonthLength(value.jy, value.jm);
  }, [value]);

  function patch(partial: Partial<NonNullable<ShamsiValue>>) {
    const base: NonNullable<ShamsiValue> = value ?? {
      jy: currentJy,
      jm: now.jm,
      jd: now.jd,
      hour: 0,
      minute: 0,
    };
    const next = { ...base, ...partial };
    // clamp day if month changed to a shorter month
    const maxDay = jalaaliMonthLength(next.jy, next.jm);
    if (next.jd > maxDay) next.jd = maxDay;
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#fffbf5]/60">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        <select
          className={selectClass}
          value={value?.jy ?? ""}
          onChange={(e) =>
            e.target.value
              ? patch({ jy: Number(e.target.value) })
              : onChange(null)
          }
        >
          <option value="">سال</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value?.jm ?? ""}
          onChange={(e) =>
            patch({ jm: Number(e.target.value) || 1 })
          }
          disabled={!value}
        >
          <option value="">ماه</option>
          {monthNames.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value?.jd ?? ""}
          onChange={(e) => patch({ jd: Number(e.target.value) || 1 })}
          disabled={!value}
        >
          <option value="">روز</option>
          {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value?.hour ?? ""}
          onChange={(e) => patch({ hour: Number(e.target.value) || 0 })}
          disabled={!value}
        >
          <option value="">ساعت</option>
          {Array.from({ length: 24 }, (_, i) => i).map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, "0")}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value?.minute ?? ""}
          onChange={(e) => patch({ minute: Number(e.target.value) || 0 })}
          disabled={!value}
        >
          <option value="">دقیقه</option>
          {Array.from({ length: 60 }, (_, i) => i).map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}