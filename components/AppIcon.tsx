import Image from "next/image";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

type IconName = keyof typeof icons;

export function AppIcon({
  name,
  size = 22,
  className = "",
  tone = "default",
}: {
  name: IconName;
  size?: number;
  className?: string;
  /** `olive` keeps brand PNG colors on roastery (no cream filter). */
  tone?: "default" | "olive";
}) {
  return (
    <Image
      src={icons[name]}
      alt=""
      width={size}
      height={size}
      className={cn(
        "object-contain",
        tone === "olive" && "app-icon-olive",
        className,
      )}
    />
  );
}
