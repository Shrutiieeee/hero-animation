import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for GitHub Pages hosting
  output: "export",

  // GitHub Pages serves from /hero-animation/ — must match your repo name exactly
  basePath: "/hero-animation",

  // Required so _next/static/ assets resolve correctly under the sub-path
  assetPrefix: "/hero-animation",

  // Next.js image optimization is not supported in static export mode
  images: {
    unoptimized: true,
  },

  // Disable the dev indicator badge
  devIndicators: false,
};

export default nextConfig;
