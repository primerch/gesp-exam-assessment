"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedNumber({ value, duration = 1.5, suffix = "", prefix = "", className = "", decimals = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const spring = useSpring(0, { duration: reduceMotion ? 0 : duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => `${prefix}${current.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
