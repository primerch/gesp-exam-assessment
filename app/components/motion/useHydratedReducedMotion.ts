"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function useHydratedReducedMotion() {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return hydrated && reduceMotion;
}
