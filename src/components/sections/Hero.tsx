"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedText from "@/components/ui/AnimatedText";
import HexPattern from "@/components/ui/HexPattern";
import { SmokeBackground } from "@/components/ui/SmokeBackground";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-start overflow-hidden bg-navy"
    >
      {/* ── WebGL Smoke Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <SmokeBackground smokeColor="#1E3A5F" />
      </div>

      {/* ── Hex pattern overlay ── */}
      <HexPattern opacity={0.06} />

      {/* ── Tunnel arch vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 55% 80% at 50% 110%,
            rgba(30, 58, 95, 0.6) 0%,
            rgba(20, 27, 45, 0.3) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* ── Edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 90% 90% at 50% 50%,
            transparent 55%,
            rgba(10, 14, 26, 0.85) 100%
          )`,
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 px-8 md:px-16 lg:px-24 pt-8"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-mono text-gold text-xs tracking-[0.35em] uppercase mb-6"
        >
          Security Engineer · Raytheon
        </motion.p>

        {/* CODY — solid fill */}
        <AnimatedText
          text="CODY"
          as="h1"
          className="font-display text-cream leading-none text-[clamp(72px,14vw,180px)]"
          stagger={0.08}
          delay={0.3}
        />

        {/* RUFF — outlined/ghost */}
        <AnimatedText
          text="RUFF"
          as="h1"
          className="font-display leading-none text-[clamp(72px,14vw,180px)]"
          letterClassName="[-webkit-text-stroke:1px_rgba(237,232,220,0.4)] text-transparent"
          stagger={0.08}
          delay={0.55}
        />

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-8 flex items-center gap-4"
        >
          <div className="w-8 h-px bg-gold opacity-60" />
          <p className="font-body text-cream text-base md:text-lg tracking-wide opacity-70">
            Builder · Stonehill &apos;26 · D1 Athlete
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex flex-col items-start gap-2"
        >
          <p className="font-mono text-xs text-cream opacity-30 tracking-[0.2em] uppercase">
            Scroll
          </p>
          <motion.div
            className="w-px h-12 bg-gold opacity-40 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* ── Bottom fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0A0E1A)",
        }}
      />
    </section>
  );
}