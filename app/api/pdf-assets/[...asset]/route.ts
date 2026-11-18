import { version } from "pdfjs-dist/package.json";

export async function GET(request: Request, { params }: { params: Promise<{ asset: string[] }> }) {
  const path = (await params).asset.join("/");
  if (
    path !== "build/pdf.worker.min.mjs" &&
    !/^(?:cmaps\/[\w.-]+\.bcmap|standard_fonts\/[\w.-]+\.(?:ttf|pfb)|wasm\/[\w.-]+\.(?:wasm|js)|iccs\/[\w.-]+\.icc)$/.test(
      path,
    )
  ) {
    return new Response(null, { status: 404 });
  }

  return Response.redirect(new URL(`/pdf-assets/${version}/${path}`, request.url), 307);
}
