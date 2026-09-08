"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { useTheme } from "next-themes";

import { loadWireframeSet, type WireframePiece, type WireframeSet } from "@/lib/wireframe";

const WIREFRAME_URL = "/models/home-wireframe.json";

/**
 * Pose read from the real FC1.stl assembly (design/project/Home BWS.dc.html, mateStage(),
 * ~line 750-754) — not reinvented here. Hembra (FC1O_mm) sits static at the origin; macho
 * (FC1a_mm) rotates -90° about Z and translates into the corner, then rises/falls along Z in a
 * continuous loop (unlike Slider System's hero, which only moves on user interaction).
 */
const HEMBRA_KEY = "FC1O_mm";
const MACHO_KEY = "FC1a_mm";
const MACHO_RZ = -Math.PI / 2;
const MACHO_T: [number, number, number] = [5.08, -5.08, 0];
const CENTER: [number, number, number] = [40, -30, 81.28];
const RISE_MM = 46;
const CYCLE_MS = 7600;

const ACCENT_DARK = "#4ade80";
const ACCENT_LIGHT = "#17a354";

/** Fraction of the canvas the whole model nudges down/right within the hero, requested after
 *  the first pass looked slightly too high and too far left. */
const FRAME_SHIFT_X = 0.08;
const FRAME_SHIFT_Y = 0.11;

/** Base camera offset from CENTER (mm), scaled up to move the camera proportionally farther
 *  away — for a fixed FOV, apparent size scales ~1/distance, so dividing by 0.85 here shrinks
 *  the model on screen by ~15%, as requested, without changing the viewing angle. */
const CAMERA_BASE_OFFSET: [number, number, number] = [210, -260, 60];
const CAMERA_DISTANCE_SCALE = 1 / 0.85;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Ambient background piece for the Home hero — ports the real dovetail-join animation from the
 * mockup (mateStage) to real Three.js, same as Slider System's hero, but built as its own
 * component: different pieces (FC1a_mm/FC1O_mm vs FD2pA_mm/FD2pB_mm), and a genuinely different
 * interaction closed in the source design — a continuous join/separate loop with mouse parallax,
 * no drag, no manual control, vs. Slider System's static-until-touched viewer. See lib/wireframe.ts
 * for the shared data loader both heroes use unmodified.
 */
export function HomeHero() {
  const [data, setData] = useState<WireframeSet | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadWireframeSet(WIREFRAME_URL).then((set) => {
      if (!cancelled) setData(set);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const strokeColor = mounted && resolvedTheme === "light" ? ACCENT_LIGHT : ACCENT_DARK;

  if (!data) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        position: [
          CENTER[0] + CAMERA_BASE_OFFSET[0] * CAMERA_DISTANCE_SCALE,
          CENTER[1] + CAMERA_BASE_OFFSET[1] * CAMERA_DISTANCE_SCALE,
          CENTER[2] + CAMERA_BASE_OFFSET[2] * CAMERA_DISTANCE_SCALE,
        ],
        up: [0, 0, 1],
        fov: 30,
      }}
    >
      <ambientLight intensity={1.4} />
      <FrameShift />
      <Rig>
        <WireframePieceMesh piece={data[HEMBRA_KEY]} color={strokeColor} position={[0, 0, 0]} />
        <MachoPiece piece={data[MACHO_KEY]} color={strokeColor} />
      </Rig>
    </Canvas>
  );
}

/**
 * Nudges the rendered frame down/right within the canvas via `setViewOffset` — a pure
 * screen-space shift of the perspective frustum's principal point, not a change to camera
 * position/angle or the model's own transform. Keeps the same "look at the joint" framing, just
 * repositions where that framing lands inside the fixed hero canvas.
 */
function FrameShift() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera;
    if (!("isPerspectiveCamera" in cam) || !cam.isPerspectiveCamera) return;
    const w = size.width;
    const h = size.height;
    cam.setViewOffset(w, h, -FRAME_SHIFT_X * w, -FRAME_SHIFT_Y * h, w, h);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
    };
  }, [camera, size]);

  return null;
}

/**
 * Continuous ambient rotation + mouse parallax, orbiting the joint's CENTER. Nested groups
 * translate CENTER to the origin, rotate there (so the pivot is the joint, not the STL files'
 * arbitrary coordinate origin), then translate back — the standard "rotate around an off-origin
 * pivot while keeping it fixed in world space" composition, matching where the camera looks.
 *
 * Yaw-only (rotation about the vertical Z axis) — no tilt/rotation.x. A tilt away from vertical
 * reads as the model leaning/toppling, which undercuts the product's whole pitch ("ángulos de
 * 90º estables"); staying upright and just turning in place reads as stable instead.
 */
function Rig({ children }: { children: React.ReactNode }) {
  const rotator = useRef<Group>(null);
  const reducedMotion = useRef(false);
  const st = useRef({ yaw: 0, active: 0 });

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state, delta) => {
    const g = rotator.current;
    if (!g) return;
    const t = state.clock.elapsedTime * 1000;
    const targetActive = state.pointer.x !== 0 || state.pointer.y !== 0 ? 1 : 0;
    st.current.active += (targetActive - st.current.active) * Math.min(1, delta * 3);

    const driftSpeed = reducedMotion.current ? 0 : 1;
    const mx = state.pointer.x * st.current.active;
    st.current.yaw += ((0.55 + (t / 14000) * driftSpeed + mx * 0.3) - st.current.yaw) * Math.min(1, delta * 3);

    g.rotation.z = st.current.yaw;
  });

  return (
    <group position={CENTER}>
      <group ref={rotator}>
        <group position={[-CENTER[0], -CENTER[1], -CENTER[2]]}>{children}</group>
      </group>
    </group>
  );
}

function MachoPiece({ piece, color }: { piece: WireframePiece | undefined; color: string }) {
  const group = useRef<Group>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    if (reducedMotion.current) {
      g.position.z = MACHO_T[2] + RISE_MM * 0.5; // settled mid-way, no looping
      return;
    }
    const t = state.clock.elapsedTime * 1000;
    const ph = (t % CYCLE_MS) / CYCLE_MS;
    let lift: number;
    if (ph < 0.36) lift = 1 - ease(ph / 0.36);
    else if (ph < 0.68) lift = 0;
    else if (ph < 0.94) lift = ease((ph - 0.68) / 0.26);
    else lift = 1;
    g.position.z = MACHO_T[2] + lift * RISE_MM;
  });

  return (
    <group ref={group} position={[MACHO_T[0], MACHO_T[1], MACHO_T[2]]} rotation={[0, 0, MACHO_RZ]}>
      <WireframePieceMesh piece={piece} color={color} position={[0, 0, 0]} />
    </group>
  );
}

function WireframePieceMesh({
  piece,
  color,
  position,
}: {
  piece: WireframePiece | undefined;
  color: string;
  position: [number, number, number];
}) {
  if (!piece) return null;
  return (
    <group position={position}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[piece.v, 3]} />
          <bufferAttribute attach="index" args={[piece.e, 1]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}
