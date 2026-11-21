"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, ScanLine, Stamp } from "lucide-react";
import useHydratedReducedMotion from "@/app/components/motion/useHydratedReducedMotion";
import { AnimatedBeam } from "@/app/components/ui/animated-beam";
import { Particles } from "@/app/components/ui/particles";
import { Spotlight, Tilt } from "@/app/components/motion";

const stages = [
  { name: "读取题目", index: "01", label: "试卷原文", detail: "识别题干、代码与问题", accessible: "程序阅读示例：for (int i = 1; i <= 5; i++) { cout << i; }，输出 12345。" },
  { name: "对照考点", index: "02", label: "CCF 条款", detail: "单层循环 · GESP 一级", accessible: "CCF 条款：GESP 一级 · 第 5 页，循环结构程序中的单层循环。完成本题必须理解 for 循环。" },
  { name: "形成结论", index: "03", label: "判断结论", detail: "纲内 · 依据随结论保留", accessible: "判断结论：纲内。必要考点为 GESP 一级单层循环，CCF 原文第 5 页随结论保留。" },
];

export default function OrbitPaperScene({
  active,
  onActiveChange,
}: {
  active: number;
  onActiveChange: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const clauseRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useHydratedReducedMotion();

  function revealFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    onActiveChange(Math.max(0, Math.min(2, Math.floor(ratio * 3))));
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[460px] w-full select-none sm:min-h-[540px] lg:min-h-[620px]"
      onPointerMove={revealFromPointer}
    >
      {!reduceMotion && (
        <Particles
          className="absolute inset-0 opacity-45"
          quantity={34}
          staticity={72}
          ease={90}
          size={0.55}
          color="#d4ad66"
          aria-hidden
        />
      )}
      <Tilt rotationFactor={reduceMotion ? 0 : 4} springOptions={{ stiffness: 180, damping: 24 }} className="absolute inset-0">
        <div className="absolute inset-[7%_2%_8%_2%] [transform-style:preserve-3d]">
          <motion.div
            className="absolute left-[12%] top-[9%] h-[70%] w-[68%] rounded-[4px] border border-white/10 bg-[#17211c] shadow-[0_36px_90px_rgba(0,0,0,0.48)]"
            initial={reduceMotion ? false : { opacity: 0, rotate: -13, y: 56 }}
            animate={{ opacity: 1, rotate: -8, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-[11px] tracking-[0.16em] text-[#82968b]">
              <span>CCF / C++</span><span>P.05</span>
            </div>
            <div className="space-y-4 p-5 opacity-45">
              {[72, 92, 82, 64, 88, 54].map((width, index) => (
                <div key={index} className="h-px bg-[#789083]" style={{ width: `${width}%` }} />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute left-[19%] top-[13%] h-[72%] w-[70%] rounded-[4px] bg-[#e8e3d7] shadow-[0_28px_70px_rgba(0,0,0,0.42)]"
            initial={reduceMotion ? false : { opacity: 0, rotate: 11, y: 70 }}
            animate={{ opacity: 1, rotate: 5, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          />

          <motion.div
            ref={questionRef}
            className="absolute left-[10%] top-[7%] h-[74%] w-[76%] overflow-hidden rounded-[5px] border border-black/10 bg-[#f7f3e9] text-[#17231d] shadow-[0_32px_90px_rgba(0,0,0,0.5)]"
            initial={reduceMotion ? false : { opacity: 0, y: 90, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: reduceMotion ? 0 : 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 text-[11px] text-[#55665f] sm:px-7">
              <span className="inline-flex items-center gap-2"><FileText size={14} /> 一级示例题 · 程序阅读</span>
              <span className="font-mono">Q.12</span>
            </div>
            <div className="px-5 py-6 sm:px-7 sm:py-8">
              <p className="text-xs text-[#55665f]">阅读程序，写出输出结果</p>
              <pre className="mt-5 font-mono text-[12px] leading-7 sm:text-sm"><code>{`for (int i = 1; i <= 5; i++) {\n  cout << i;\n}`}</code></pre>
              <motion.div
                className="mt-5 inline-block border-l-2 border-[#a9762a] bg-[#e9dfca] px-3 py-2 font-mono text-xs text-[#6c4b19]"
                animate={{ opacity: active >= 1 ? 1 : 0.25, x: active >= 1 ? 0 : -8 }}
              >
                必要考点：单层循环
              </motion.div>
              <div className="mt-6 border-t border-black/10 pt-4 font-mono text-xs text-[#55665f]">输出：12345</div>
            </div>
            <motion.div
              className="absolute inset-x-0 h-16 bg-linear-to-b from-transparent via-[#d4ad66]/15 to-transparent"
              animate={reduceMotion ? { opacity: 0 } : { top: active === 0 ? ["0%", "75%"] : "32%", opacity: active === 0 ? 1 : 0 }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            >
              <ScanLine className="mx-auto mt-5 text-[#a9762a]" size={18} />
            </motion.div>
          </motion.div>

          <motion.div
            ref={clauseRef}
            className="absolute bottom-[2%] left-[2%] w-[46%] rounded-lg border border-white/12 bg-[#17231d]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.38)] backdrop-blur-sm"
            animate={{ opacity: active >= 1 ? 1 : 0.45, y: active >= 1 ? 0 : 12 }}
            aria-hidden
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#d4ad66]">CCF / EVIDENCE</p>
            <p className="mt-2 text-sm text-[#edf3ef]">循环结构程序</p>
            <p className="mt-1 text-[11px] leading-5 text-[#9fb2a7]">理解并使用 for 循环完成重复执行</p>
            <p className="mt-3 border-t border-white/10 pt-2 font-mono text-[11px] text-[#82968b]">GESP 一级 · 第 5 页</p>
          </motion.div>

          <motion.div
            ref={verdictRef}
            className="absolute bottom-[5%] right-[1%] grid size-24 place-items-center rounded-full border-[3px] border-[#d4ad66] bg-[#101713]/90 text-center text-[#d4ad66] shadow-[0_16px_50px_rgba(0,0,0,0.4)] sm:size-28"
            animate={{
              opacity: active >= 2 ? 1 : 0,
              rotate: active >= 2 ? -10 : -24,
              scale: active >= 2 ? 1 : 0.55,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            aria-hidden
          >
            <div>
              <Stamp className="mx-auto mb-1" size={18} />
              <span className="font-display text-2xl">纲内</span>
              <span className="mt-1 block font-mono text-[11px] tracking-[0.18em]">WITHIN</span>
            </div>
          </motion.div>

          {active >= 1 && (
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={questionRef}
              toRef={clauseRef}
              curvature={36}
              duration={3.2}
              repeat={reduceMotion ? 0 : Infinity}
              pathColor="#52685b"
              pathOpacity={0.35}
              gradientStartColor="#d4ad66"
              gradientStopColor="#77b69c"
            />
          )}
          {active >= 2 && (
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={clauseRef}
              toRef={verdictRef}
              curvature={-28}
              duration={2.8}
              repeat={reduceMotion ? 0 : Infinity}
              pathColor="#52685b"
              pathOpacity={0.35}
              gradientStartColor="#77b69c"
              gradientStopColor="#d4ad66"
            />
          )}
        </div>
      </Tilt>
      {!reduceMotion && <Spotlight className="from-[#d4ad66]/8 via-[#77b69c]/6 to-transparent opacity-40" size={320} />}

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-white/10 bg-[#0b120f]/75 backdrop-blur-sm">
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            type="button"
            aria-pressed={active === index}
            aria-controls="orbit-evidence-text"
            onClick={() => onActiveChange(index)}
            className={`group min-h-20 border-r border-white/10 px-3 py-3 text-left transition-colors last:border-r-0 sm:px-5 ${active === index ? "bg-white/[0.06] text-[#edf3ef]" : "text-[#82968b] hover:bg-white/[0.03] hover:text-[#c4d2c8]"}`}
          >
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em]">
              <span className={`grid size-4 place-items-center rounded-full border text-[11px] ${active > index ? "border-[#77b69c] bg-[#77b69c] text-[#101713]" : "border-current"}`}>
                {active > index ? <Check size={10} /> : stage.index}
              </span>
              {stage.label}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active === index ? stage.detail : stage.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 block text-[11px] leading-4 sm:text-xs"
              >
                {active === index ? stage.detail : stage.name}
              </motion.span>
            </AnimatePresence>
          </button>
        ))}
      </div>
      <p id="orbit-evidence-text" aria-live="polite" className="sr-only">{stages[active].accessible}</p>
    </div>
  );
}
