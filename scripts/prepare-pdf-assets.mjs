import { access, cp, mkdir, mkdtemp, readFile, rename, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const manifest = require.resolve("pdfjs-dist/package.json");
const { version } = JSON.parse(await readFile(manifest, "utf8"));
const installed = dirname(manifest);
const root = fileURLToPath(new URL("../", import.meta.url));
const destination = join(root, "public", "pdf-assets", version);
const worker = "build/pdf.worker.min.mjs";

async function prepareAssets() {
  if (
    await access(join(destination, worker)).then(
      () => true,
      () => false,
    )
  )
    return;

  // Publish the whole version at once so simultaneous builds see complete assets.
  const staging = await mkdtemp(join(root, ".pdf-assets-"));
  try {
    await mkdir(join(staging, "build"));
    await Promise.all(
      [worker, "cmaps", "standard_fonts", "wasm", "iccs"].map((path) =>
        cp(join(installed, path), join(staging, path), { recursive: true }),
      ),
    );
    await mkdir(dirname(destination), { recursive: true });
    try {
      await rename(staging, destination);
    } catch (error) {
      if (!["EEXIST", "ENOTEMPTY"].includes(error.code)) throw error;
      await access(join(destination, worker));
    }
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

await prepareAssets();
