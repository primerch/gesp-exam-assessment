"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";

const steps = [
  {
    title: "确定要考哪一级",
    description: "先选目标等级，避免拿其他级别的要求来分析这套试卷。",
    href: "/syllabus",
    action: "先查看等级考纲",
  },
  {
    title: "看这一级考什么",
    description: "考点、题型和限制都列出来，CCF 原文页码也一并附上。",
    href: "/syllabus",
    action: "核对 CCF 条款",
  },
  {
    title: "逐题分析试卷",
    description: "看每道题需要什么知识、有哪些得分点，是否超出这一级范围。",
    href: "/analyze",
    action: "上传 PDF 分析",
  },
  {
    title: "决定接下来学什么",
    description: "结合课程进度，先补还没学过的内容，再考虑报考等级。",
    href: "/plan",
    action: "查看学习进度",
  },
];

export default function ProcessStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const reduceMotion = useReducedMotion();

  return (
    <div data-process-stepper>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#b8c9bf]">演示流程 · 点击步骤查看说明</p>
        <span className="font-mono text-xs text-[#d4ad66]">{String(currentStep).padStart(2, "0")} / 04</span>
      </div>
      <Stepper value={currentStep} onValueChange={setCurrentStep} orientation="vertical" className="space-y-8" aria-label="备考步骤">
        <StepperNav className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
          {steps.map((step, index) => (
            <StepperItem key={step.title} step={index + 1} className="relative sm:flex-1">
              <StepperTrigger className="group flex min-h-14 w-full items-start gap-3 rounded-lg text-left">
                <StepperIndicator className="grid size-8 place-items-center border border-[#6f8c7d] bg-[#1d302b] text-[#d4ad66]">
                  {currentStep > index + 1 ? <Check size={14} aria-hidden /> : index + 1}
                </StepperIndicator>
                <StepperTitle className="pt-1 text-sm font-medium text-[#edf3ef]">{step.title}</StepperTitle>
                <StepperDescription className="sr-only">{step.description}</StepperDescription>
              </StepperTrigger>
              {index < steps.length - 1 && <StepperSeparator className="bg-[#466054]" />}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="rounded-xl border border-[#466054] bg-[#233b33] p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <StepperContent key={currentStep} value={currentStep}>
              <motion.div
                initial={{ opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transform: "translateY(-8px)" }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="text-sm text-[#b8c9bf]">第 {currentStep} 步</p>
                <h3 className="mt-2 text-xl font-medium text-[#edf3ef]">{steps[currentStep - 1].title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#b8c9bf]">{steps[currentStep - 1].description}</p>
                <Link href={steps[currentStep - 1].href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#6f8c7d] px-4 text-sm font-medium text-[#edf3ef] transition-colors hover:bg-[#2d473d]">
                  {steps[currentStep - 1].action} <ArrowRight size={15} aria-hidden />
                </Link>
              </motion.div>
            </StepperContent>
          </AnimatePresence>
        </StepperPanel>
      </Stepper>
    </div>
  );
}
