import Image from "next/image";
import { icons } from "@/lib/icons";

type IconName = keyof typeof icons;

export function AppIcon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={icons[name]}
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}    />
  );
}
