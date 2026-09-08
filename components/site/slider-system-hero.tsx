"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useTheme } from "next-themes";

import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { loadWireframeSet, type WireframePiece, type WireframeSet } from "@/lib/wireframe";

const WIREFRAME_URL = "/models/slider-system-wireframe.json";

/**
 * Pose read from the real FD2.stl assembly (design/project/Slider System BWS.dc.html, mateStage(),
 * ~line 850-856) — not reinvented here. Hembra (FD2pA_mm) sits static at the origin; macho
 * (FD2pB_mm) rotates -90° about Z and translates into the corner, then rises/falls along Z with
 * the engage control. CENTER is the joint's rough centroid in the same coordinate space, used only
 * to aim the camera/OrbitControls target — it isn't a transform applied to the geometry.
 */
const HEMBRA_KEY = "FD2pA_mm";
const MACHO_KEY = "FD2pB_mm";
const MACHO_RZ = -Math.PI / 2;
const MACHO_T: [number, number, number] = [5.08, 71.12, 0];
const CENTER: [number, number, number] = [25.4, -33, 28.5];
const RISE_MM = 46;

const ACCENT_DARK = "#4ade80";
const ACCENT_LIGHT = "#17a354";

/**
 * Interactive dovetail-join viewer — the same real STL geometry as the mockup (FD2pA + FD2pB),
 * ported to real Three.js/@react-three-fiber instead of the mockup's hand-rolled canvas 2D
 * projection (see lib/wireframe.ts and scripts/extract-slider-wireframe.mjs for why). No idle
 * animation loop: `frameloop="demand"` only (re)renders on drag, engage-slider input, resize or
 * theme change, matching the mockup's own on-demand redraw behavior.
 */
export function SliderSystemHero() {
  const [data, setData] = useState<WireframeSet | null>(null);
  const [failed, setFailed] = useState(false);
  const [engage, setEngage] = useState(100);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadWireframeSet(WIREFRAME_URL)
      .then((set) => {
        if (!cancelled) setData(set);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const strokeColor = mounted && resolvedTheme === "light" ? ACCENT_LIGHT : ACCENT_DARK;
  const rise = (1 - engage / 100) * RISE_MM;

  return (
    <div className="flex min-w-0 flex-1 flex-col self-stretch">
      <div className="bwsviewer relative min-h-[420px] min-w-0 flex-1 border border-border-hairline bg-surface-dropdown">
        {data ? (
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            camera={{
              position: [CENTER[0] + 210, CENTER[1] - 190, CENTER[2] + 150],
              up: [0, 0, 1],
              fov: 34,
            }}
          >
            <ambientLight intensity={1.4} />
            <WireframePieceMesh piece={data[HEMBRA_KEY]} color={strokeColor} position={[0, 0, 0]} />
            <WireframePieceMesh
              piece={data[MACHO_KEY]}
              color={strokeColor}
              position={[MACHO_T[0], MACHO_T[1], MACHO_T[2] + rise]}
              rotationZ={MACHO_RZ}
            />
            <OrbitControls
              target={CENTER}
              enablePan={false}
              enableZoom={false}
              enableDamping
              dampingFactor={0.08}
              rotateSpeed={0.6}
            />
          </Canvas>
        ) : (
          <PhotoPlaceholder
            aspect="4/3"
            className="h-full min-h-[420px] border-0"
            label={failed ? "GEOMETRÍA NO DISPONIBLE" : "CARGANDO GEOMETRÍA"}
            caption="FD2pA + FD2pB · UNIÓN DOVETAIL REAL"
          />
        )}
        <div className="pointer-events-none absolute top-4 left-[18px] hidden font-mono text-[10.5px] tracking-[0.14em] text-muted-3 lg:block">
          GEOMETRÍA REAL · FD2pA + FD2pB
        </div>
        <div className="pointer-events-none absolute top-4 right-[18px] hidden gap-2 lg:flex">
          <span className="border border-accent/34 px-2 py-1 font-mono text-[10.5px] tracking-[0.12em] text-accent">
            ARRASTRA · GIRA EL MODELO
          </span>
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-[74px_1fr_50px] items-center gap-3 border border-t-0 border-border-hairline px-4 py-[18px] sm:grid-cols-[150px_1fr_70px] sm:gap-5 sm:px-[22px]">
        <div className="font-mono text-[10.5px] tracking-[0.14em] text-muted-3">ACOPLE</div>
        <input
          type="range"
          min={0}
          max={100}
          value={engage}
          onChange={(e) => setEngage(Number(e.target.value))}
          aria-label="Acople de la unión"
          className="accent-accent"
        />
        <div className="text-right font-mono text-[13px] text-accent">{engage} %</div>
      </div>
    </div>
  );
}

function WireframePieceMesh({
  piece,
  color,
  position,
  rotationZ = 0,
}: {
  piece: WireframePiece | undefined;
  color: string;
  position: [number, number, number];
  rotationZ?: number;
}) {
  if (!piece) return null;
  return (
    <group position={position} rotation={[0, 0, rotationZ]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[piece.v, 3]} />
          <bufferAttribute attach="index" args={[piece.e, 1]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </lineSegments>
    </group>
  );
}
