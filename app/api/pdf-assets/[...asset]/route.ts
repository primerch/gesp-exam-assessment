import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export async function GET(_request: Request, ctx: RouteContext<"/api/pdf-assets/[...asset]">) {
  const { asset } = await ctx.params;
  const path = asset.join("/");
  const isWorker = path === "build/pdf.worker.min.mjs";
  if (!isWorker && !/^(?:cmaps\/[\w.-]+\.bcmap|standard_fonts\/[\w.-]+\.(?:ttf|pfb)|wasm\/[\w.-]+\.(?:wasm|js)|iccs\/[\w.-]+\.icc)$/.test(path)) {
    return new Response(null, { status: 404 });
  }
  try {
    const data = await readFile(join(process.cwd(), "node_modules/pdfjs-dist", path));
    const type = isWorker || path.endsWith(".js") ? "text/javascript" : path.endsWith(".wasm") ? "application/wasm" : "application/octet-stream";
    return new Response(data, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
