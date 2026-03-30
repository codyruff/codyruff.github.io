"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";

type LoadingGlobeProps = {
  onComplete: () => void;
};

const MARKERS = [
  { location: [42.0195, -71.1022] as [number, number], size: 0.06 }, // Easton MA — home
  { location: [38.95,  -77.45]   as [number, number], size: 0.03 }, // Washington DC
  { location: [37.62, -122.38]   as [number, number], size: 0.03 }, // San Francisco
  { location: [49.01,   2.55]    as [number, number], size: 0.03 }, // Paris
  { location: [35.55, 139.78]    as [number, number], size: 0.03 }, // Tokyo
  { location: [-33.95, 151.18]   as [number, number], size: 0.03 }, // Sydney
  { location: [1.36,  103.99]    as [number, number], size: 0.03 }, // Singapore
];

const ARCS = [
  { from: [42.0195, -71.1022] as [number, number], to: [49.01, 2.55]    as [number, number] },
  { from: [42.0195, -71.1022] as [number, number], to: [35.55, 139.78]  as [number, number] },
  { from: [42.0195, -71.1022] as [number, number], to: [37.62, -122.38] as [number, number] },
  { from: [42.0195, -71.1022] as [number, number], to: [-33.95, 151.18] as [number, number] },
  { from: [42.0195, -71.1022] as [number, number], to: [1.36, 103.99]   as [number, number] },
  { from: [38.95,  -77.45]    as [number, number], to: [49.01, 2.55]    as [number, number] },
];

export default function LoadingGlobe({ onComplete }: LoadingGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [visible, setVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  // Timers — show text, hide text, dismiss globe
  useEffect(() => {
    const showText = setTimeout(() => setTextVisible(true), 600);
    const hideText = setTimeout(() => setTextVisible(false), 2800);
    const dismiss  = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800);
    }, 3200);
    return () => {
      clearTimeout(showText);
      clearTimeout(hideText);
      clearTimeout(dismiss);
    };
  }, [onComplete]);

  // Drag interaction
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi:   (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  // Globe init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas!.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas!, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor:   [0.12, 0.22, 0.37],  // steel #1E3A5F
        markerColor: [0.72, 0.59, 0.18],  // gold  #B8962E
        glowColor:   [0.07, 0.09, 0.10],  // dark navy glow
        markers: MARKERS,
        arcs: ARCS,
        arcColor:   ["rgba(184,150,46,0.9)", "rgba(184,150,46,0.1)"],
        arcWidth:    0.8,
        arcHeight:   0.3,
        opacity:     0.8,
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      function animate() {
        if (!isPausedRef.current) phi += 0.003;
        globe!.update({
          phi:   phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.3 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => { if (canvas) canvas.style.opacity = "1"; });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-globe"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px]"
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              style={{
                width: "100%",
                height: "100%",
                opacity: 0,
                transition: "opacity 1.2s ease",
                borderRadius: "50%",
                touchAction: "none",
              }}
            />
            {/* Edge fade */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, transparent 45%, #0A0E1A 78%)",
              }}
            />
          </motion.div>

          {/* Text */}
          <AnimatePresence>
            {textVisible && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <p className="font-mono text-gold text-sm tracking-[0.3em] uppercase">
                  Connecting to Cody&apos;s World...
                </p>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-gold"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}