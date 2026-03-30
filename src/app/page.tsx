"use client";

import { useState } from "react";
import LoadingGlobe from "@/components/sections/LoadingGlobe";
import HexPattern from "@/components/ui/HexPattern";
import AnimatedText from "@/components/ui/AnimatedText";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative bg-navy min-h-screen">

      {/* Loading Globe — dismisses itself after 3.2s */}
      {loading && (
        <LoadingGlobe onComplete={() => setLoading(false)} />
      )}

      {/* Temp hero preview — will be replaced by Hero.tsx in Step 10 */}
      {!loading && (
        <section className="flex flex-col justify-center px-12 py-24 min-h-screen">
          <HexPattern />
          <AnimatedText
            text="CODY RUFF"
            as="h1"
            className="font-display text-cream text-8xl relative z-10"
            stagger={0.06}
            delay={0.2}
          />
          <AnimatedText
            text="Security Engineer · Builder · Stonehill 26"
            as="p"
            className="font-body text-sage text-xl relative z-10 mt-4"
            stagger={0.02}
            delay={0.8}
          />
          
        </section>
      )}

    </main>
  );
}