import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for GitHub Pages hosting
  output: "export",

  // GitHub Pages serves from /<repo-name>/, so set this to your repo name.
  // Example: if your repo is "hero-animation", set basePath: "/hero-animation"
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Next.js image optimization is not supported in static export mode
  images: {
    unoptimized: true,
  },

  // Disable the dev indicator badge
  devIndicators: false,
};

export default nextConfig;
