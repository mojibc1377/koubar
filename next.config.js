/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.18.255"],

  images: {
    // Liara object storage often resolves to a private IP from the app container.
    // Next.js 16 blocks that by default; enable for same-network storage only.
    dangerouslyAllowLocalIP: true,
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "koubar.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.c2.liara.site",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;