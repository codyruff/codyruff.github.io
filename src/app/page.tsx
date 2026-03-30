"use client";

import { useState } from "react";
import LoadingGlobe from "@/components/sections/LoadingGlobe";
import Hero from "@/components/sections/Hero";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative bg-navy">
      {loading && (
        <LoadingGlobe onComplete={() => setLoading(false)} />
      )}
      {!loading && (
        <>
          <Hero />
          {/* About, Projects, Skills, Contact added next */}
        </>
      )}
    </main>
  );
}