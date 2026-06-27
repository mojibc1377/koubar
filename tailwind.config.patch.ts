// tailwind.config.ts  –– merge this into your existing config

import type { Config } from "tailwindcss";

const config: Config = {
  // ... your existing config ...
  theme: {
    extend: {
      keyframes: {
        draw: {
          to: { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        // used by the check/x icon stroke animation in ResultSheet
        // duration & delay are set inline via Tailwind arbitrary values
      },
    },
  },
};

export default config;