// news-image-20261122 — Sunday 22 November 2026, summed up in one image.
//
// entry.png sits beside this file. This program copies it byte for byte
// into the grader's output directory. Node 22 standard library only,
// no network, no randomness — two runs always produce identical bytes.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and the target is /output.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_NAME = "entry.png";
const MAX_BYTES = 1_048_576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const image = readFileSync(new URL(`./${OUTPUT_NAME}`, import.meta.url));

// The entry must be a whole PNG within the 1 MiB cap; refuse anything else.
if (image.length > MAX_BYTES) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB cap`);
}
if (!image.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file");
}

const targetPath = join(outDir, OUTPUT_NAME);
writeFileSync(targetPath, image);

// Read back what landed on disk and confirm it is the PNG we meant to
// write — whole, and not a truncated or mistyped copy.
const onDisk = readFileSync(targetPath);
if (!onDisk.equals(image)) {
  throw new Error("output on disk differs from entry.png");
}

const written = statSync(targetPath).size;
console.log(`wrote ${targetPath} (${written} bytes)`);
