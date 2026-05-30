import localFont from "next/font/local";

export const yekanBakh = localFont({
  src: [
    { path: "./fonts/YekanBakh-Thin.woff", weight: "100", style: "normal" },
    { path: "./fonts/YekanBakh-Light.woff", weight: "300", style: "normal" },
    { path: "./fonts/YekanBakh-Regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/YekanBakh-SemiBold.woff", weight: "600", style: "normal" },
    { path: "./fonts/YekanBakh-Bold.woff", weight: "700", style: "normal" },
    { path: "./fonts/YekanBakh-Black.woff", weight: "900", style: "normal" },

    // اگر ExtraBold / ExtraBlack هم داری:
    // { path: "../../public/fonts/YekanBakh-ExtraBold.woff", weight: "800", style: "normal" },
    // { path: "../../public/fonts/YekanBakh-ExtraBlack.woff", weight: "950", style: "normal" },
  ],
  variable: "--font-yekanbakh",
  display: "swap",
});
