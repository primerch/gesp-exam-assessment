"use client";

import LearningExamScene from "./LearningExamScene";
import OrbitHero from "./OrbitHero";

export default function LandingPage() {
  return (
    <main id="main-content" className="overflow-hidden">
      <OrbitHero />
      <LearningExamScene />
    </main>
  );
}
