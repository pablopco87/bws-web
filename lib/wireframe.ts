export interface WireframePiece {
  /** Flat vertex positions, 3 floats per vertex (mm). */
  v: Float32Array;
  /** Character-edge vertex index pairs — pass straight to a BufferGeometry index. */
  e: Uint32Array;
}

export type WireframeSet = Record<string, WireframePiece>;

const cache = new Map<string, Promise<WireframeSet>>();

/**
 * Fetches a precomputed wireframe JSON (see scripts/extract-slider-wireframe.mjs — vertices and
 * character edges already derived offline, no raw triangle mesh or client-side dihedral-angle
 * computation involved) and parses it into typed arrays ready for a Three.js BufferGeometry.
 * Cached per URL at module scope so remounting the consuming component (React Strict Mode's
 * double-invoke, client-side navigation back to the same page) doesn't refetch or reparse.
 * Generic across pages — not specific to any one hero — so a future consumer can reuse it as-is.
 */
export function loadWireframeSet(url: string): Promise<WireframeSet> {
  let promise = cache.get(url);
  if (!promise) {
    promise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Wireframe fetch failed: HTTP ${res.status}`);
        return res.json() as Promise<Record<string, { v: number[]; e: number[] }>>;
      })
      .then((raw) => {
        const set: WireframeSet = {};
        for (const [name, piece] of Object.entries(raw)) {
          set[name] = {
            v: Float32Array.from(piece.v),
            e: Uint32Array.from(piece.e),
          };
        }
        return set;
      })
      .catch((err) => {
        cache.delete(url); // let a later mount retry instead of caching a permanent failure
        throw err;
      });
    cache.set(url, promise);
  }
  return promise;
}
