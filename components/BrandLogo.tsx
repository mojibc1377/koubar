import Image from "next/image";
import Link from "next/link";
import { logos } from "@/lib/icons";

export function BrandLogo({
  variant = "farsi",
  className = "",
}: {
  variant?: "farsi" | "english";
  className?: string;
}) {
  const src = variant === "english" ? logos.english : logos.farsi;
  const width = variant === "english" ? 120 : 88;
  const height = variant === "english" ? 32 : 40;

  return (
    <Link href="/" className={`brand-logo inline-flex shrink-0 ${className}`} aria-label="کوبار">
      <Image
        src={src}
        alt="Koubar"
        width={width}
        height={height}
        className="h-auto w-auto object-contain"
        priority
      />
    </Link>
  );
}
