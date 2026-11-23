// news-image-20261122 — one-day world news image for Sunday 22 November 2026.
//
// The entry image lives next to this file as entry.png. This program's only
// job is to place an exact copy of it in the grader's output directory.
// It uses nothing but the Node 22 standard library, touches no network,
// and always writes the same bytes, so two runs are byte-identical.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and the target is /output.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_NAME = "entry.png";
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const sourcePath = new URL(`./${OUTPUT_NAME}`, import.meta.url);
const image = readFileSync(sourcePath);

// The entry must be a whole PNG; refuse to emit anything else.
if (!image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file");
}

const targetPath = join(outDir, OUTPUT_NAME);
writeFileSync(targetPath, image);

// Confirm the file on disk is the PNG we intended to write, not a
// truncated or mistyped copy.
const onDisk = readFileSync(targetPath);
if (!onDisk.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error("output on disk is not a PNG file");
}

const written = statSync(targetPath).size;
if (written !== image.length) {
  throw new Error(`short write: ${written} of ${image.length} bytes`);
}
console.log(`wrote ${targetPath} (${written} bytes)`);
