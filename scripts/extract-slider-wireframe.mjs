#!/usr/bin/env node
// Build-time tool, not part of the Next.js runtime. Run once (`node
// scripts/extract-slider-wireframe.mjs`) and re-run only if design/project/dovetail-mesh-hd.json
// changes. Ports the dihedral-angle character-edge extraction from
// design/project/Slider System BWS.dc.html's prep() (mockup script, ~line 799) so the browser
// never downloads the full 117k-triangle solid mesh or repeats that computation on page load —
// only the resulting wireframe (vertices + character edges) ships to the client.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "design", "project", "dovetail-mesh-hd.json");
const OUT = path.join(__dirname, "..", "public", "models", "slider-system-wireframe.json");

function extractCharacterEdges(mesh) {
  const triangleCount = mesh.t.length / 3;
  const edgeFaces = new Map();
  for (let f = 0; f < triangleCount; f++) {
    for (let e = 0; e < 3; e++) {
      const a = mesh.t[f * 3 + e];
      const b = mesh.t[f * 3 + ((e + 1) % 3)];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const cur = edgeFaces.get(key);
      if (cur === undefined) edgeFaces.set(key, [f, -1]);
      else if (cur[1] === -1) cur[1] = f;
    }
  }

  const COS_THRESHOLD = Math.cos((30 * Math.PI) / 180);
  const rawEdges = [];
  for (const [key, [f1, f2]] of edgeFaces) {
    if (f2 === -1) continue; // boundary edge, no second face
    const dot =
      mesh.n[f1 * 3] * mesh.n[f2 * 3] +
      mesh.n[f1 * 3 + 1] * mesh.n[f2 * 3 + 1] +
      mesh.n[f1 * 3 + 2] * mesh.n[f2 * 3 + 2];
    if (dot >= COS_THRESHOLD) continue; // faces nearly coplanar, not a character edge
    const [aStr, bStr] = key.split("_");
    const a = Number(aStr);
    const b = Number(bStr);
    const length = Math.hypot(
      mesh.v[a * 3] - mesh.v[b * 3],
      mesh.v[a * 3 + 1] - mesh.v[b * 3 + 1],
      mesh.v[a * 3 + 2] - mesh.v[b * 3 + 2]
    );
    if (length < 0.2) continue; // degenerate sliver
    rawEdges.push(a, b);
  }

  // Most of the source mesh's vertices belong to smooth/coplanar regions that never survive the
  // dihedral filter above — compact the vertex buffer down to only the ones character edges
  // actually reference, instead of shipping every vertex of the original solid mesh.
  const remap = new Map();
  const v = [];
  const e = [];
  for (const oldIndex of rawEdges) {
    let newIndex = remap.get(oldIndex);
    if (newIndex === undefined) {
      newIndex = v.length / 3;
      remap.set(oldIndex, newIndex);
      v.push(mesh.v[oldIndex * 3], mesh.v[oldIndex * 3 + 1], mesh.v[oldIndex * 3 + 2]);
    }
    e.push(newIndex);
  }

  return { v, e };
}

const raw = JSON.parse(await readFile(SRC, "utf-8"));
const out = {
  FD2pA_mm: extractCharacterEdges(raw.FD2pA_mm),
  FD2pB_mm: extractCharacterEdges(raw.FD2pB_mm),
};

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out));

const sizeKB = (JSON.stringify(out).length / 1024).toFixed(1);
console.log(`Wrote ${OUT}`);
console.log(`FD2pA_mm: ${out.FD2pA_mm.v.length / 3} verts, ${out.FD2pA_mm.e.length / 2} edges`);
console.log(`FD2pB_mm: ${out.FD2pB_mm.v.length / 3} verts, ${out.FD2pB_mm.e.length / 2} edges`);
console.log(`Output size: ${sizeKB} KB`);
