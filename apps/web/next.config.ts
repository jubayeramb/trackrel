import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@trackrel/ui"],
  turbopack: {
    root: resolve(import.meta.dirname, "../../"),
  },
};

export default nextConfig;

// Enable Cloudflare bindings during local development
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
