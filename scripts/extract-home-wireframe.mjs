#!/usr/bin/env node
// Build-time tool, not part of the Next.js runtime. Run once (`node
// scripts/extract-home-wireframe.mjs`) and re-run only if design/project/piezas-wireframe.json
// changes. Unlike scripts/extract-slider-wireframe.mjs, this one has no character-edge extraction
// to do — piezas-wireframe.json was already exported as a wireframe (vertices + edge index
// pairs) during the design process. It just needs two things: (1) only the two pieces Home's
// hero actually uses (FC1a_mm, FC1O_mm — the file also carries now-unused FC1a/FC1O/FC1l keys
// from an earlier iteration), and (2) flattening from its nested-array shape (`v: [[x,y,z], …]`,
// `e: [[a,b], …]`) into the flat-typed-array-ready shape lib/wireframe.ts's loadWireframeSet()
// expects (`v: [x,y,z,…]`, `e: [a,b,…]`) — the same shape scripts/extract-slider-wireframe.mjs
// produces, so both heroes' data goes through the exact same loader unmodified.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "design", "project", "piezas-wireframe.json");
const OUT = path.join(__dirname, "..", "public", "models", "home-wireframe.json");
const PIECES = ["FC1a_mm", "FC1O_mm"];

function flatten(piece) {
  return {
    v: piece.v.flat(),
    e: piece.e.flat(),
  };
}

const raw = JSON.parse(await readFile(SRC, "utf-8"));
const out = {};
for (const key of PIECES) {
  if (!raw[key]) throw new Error(`Missing piece "${key}" in ${SRC}`);
  out[key] = flatten(raw[key]);
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out));

const sizeKB = (JSON.stringify(out).length / 1024).toFixed(1);
console.log(`Wrote ${OUT}`);
for (const key of PIECES) {
  console.log(`${key}: ${out[key].v.length / 3} verts, ${out[key].e.length / 2} edges`);
}
console.log(`Output size: ${sizeKB} KB`);
