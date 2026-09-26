import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist must load in Node (not bundled) for server-side PDF extraction.
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
