"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useRequireSession } from "@/lib/require-session";

/**
 * Briefing screen. Sits between consent and pretest so participants
 * know the full arc before the quiz begins: quiz → game → same quiz
 * → short survey. Reduces "wait, another quiz?" friction at posttest.
 */
export default function BriefingPage() {
    useRequireSession();
    const router = useRouter();

    const steps: { n: string; title: string; note: string }[] = [
        {
            n: "01",
            title: "A quick knowledge quiz",
            note: "10 short multiple-choice questions about everyday cybersecurity. No trick questions, no right to prove, this is your baseline.",
        },
        {
            n: "02",
            title: "Five interactive scenarios",
            note: "A phishing email, a suspicious call, a USB drop, and more. You make the decisions. Each outcome shows what an attacker would have done with your choice.",
        },
        {
            n: "03",
            title: "The same quiz again",
            note: "So we can see what, if anything, changed between your first attempt and your last.",
        },
        {
            n: "04",
            title: "A short feedback survey",
            note: "Eleven quick questions about how the experience felt, plus a handful of optional background questions at the end.",
        },
    ];

    return (
        <div className="min-h-[100dvh] flex flex-col">
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-8"
                >
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                        <span className="type-mono text-[color:var(--color-amber)]">
                            how this works
                        </span>
                    </div>

                    <h1 className="type-display text-[color:var(--color-bone)] text-[26px] sm:text-[48px] leading-tight">
                        How this works.
                    </h1>

                    <div className="flex flex-col gap-4 sm:gap-5">
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.n}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                                className="flex items-start gap-3 sm:gap-4 border-l-2 border-[color:var(--color-amber)]/40 pl-4 sm:pl-5 py-0.5"
                            >
                                <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums pt-0.5 shrink-0">
                                    {s.n}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <p className="type-ui text-[color:var(--color-bone)] text-[16px] sm:text-[18px] font-medium">
                                        {s.title}
                                    </p>
                                    <p className="type-ui text-[color:var(--color-bone-dim)] text-[13px] sm:text-[15px] leading-relaxed">
                                        {s.note}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="flex items-center flex-wrap gap-x-3 gap-y-1 type-mono text-[color:var(--color-bone-muted)] text-[11px] sm:text-xs"
                    >
                        <span>total time</span>
                        <span aria-hidden className="h-px w-6 bg-[color:var(--color-bone-ghost)]" />
                        <span>~20 minutes</span>
                        <span aria-hidden>·</span>
                        <span>headphones recommended</span>
                    </motion.div>

                    <p className="type-display text-[color:var(--color-bone)] text-[20px] sm:text-[32px] border-t border-[color:var(--color-edge-subtle)] pt-5 sm:pt-6">
                        Are you ready to start?
                    </p>
                </motion.div>
            </div>

            {/* Sticky bottom CTA */}
            <div className="sticky bottom-0 z-30 px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-t from-[color:var(--color-ink-base)] via-[color:var(--color-ink-base)]/95 to-transparent">
                <div className="max-w-2xl w-full mx-auto">
                    <button
                        type="button"
                        onClick={() => router.push("/pretest")}
                        className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        I&rsquo;m ready, begin
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
