import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/pdf-assets/*": [
      "./node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
      "./node_modules/pdfjs-dist/{cmaps,standard_fonts,wasm,iccs}/**/*",
    ],
  },
};
export default nextConfig;
