"use client";

import { AdminInput } from "@/components/admin/AdminField";
import { getImageUrl } from "@/lib/storage";

export function AdminImageField({
  label = "تصویر (مسیر یا URL)",
  value,
  onChange,
  placeholder = "/images/hero.png",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const previewSrc = value.trim() || placeholder;

  return (
    <div className="space-y-3">
      <AdminInput
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        placeholder={placeholder}
      />
      <div className="overflow-hidden rounded-xl border border-[#fffbf51a] bg-[#343434]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(previewSrc)}
          alt=""
          className="h-36 w-full object-cover"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src.endsWith(placeholder)) return;
            el.src = placeholder;
          }}
        />
      </div>
    </div>
  );
}
