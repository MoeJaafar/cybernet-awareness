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
            note: "15 short multiple-choice questions about everyday cybersecurity. No trick questions, no right to prove — this is your baseline.",
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
            note: "Eight quick questions about how the experience felt, plus a handful of optional background questions at the end.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full flex flex-col gap-8"
            >
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                    <span className="type-mono text-[color:var(--color-amber)]">
                        how this works
                    </span>
                </div>

                <h1 className="type-display text-[color:var(--color-bone)] text-[36px] sm:text-[48px] leading-tight">
                    How this works.
                </h1>

                <div className="flex flex-col gap-5">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.n}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                            className="flex items-start gap-4 border-l-2 border-[color:var(--color-amber)]/40 pl-5 py-1"
                        >
                            <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums pt-0.5 shrink-0">
                                {s.n}
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="type-ui text-[color:var(--color-bone)] text-[18px] font-medium">
                                    {s.title}
                                </p>
                                <p className="type-ui text-[color:var(--color-bone-dim)] text-[15px] leading-relaxed">
                                    {s.note}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex items-center gap-3 type-mono text-[color:var(--color-bone-muted)]"
                >
                    <span>total time</span>
                    <span aria-hidden className="h-px w-6 bg-[color:var(--color-bone-ghost)]" />
                    <span>~20 minutes</span>
                    <span aria-hidden>·</span>
                    <span>headphones recommended</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="border-t border-[color:var(--color-edge-subtle)] pt-6 flex flex-col gap-4"
                >
                    <p className="type-display text-[color:var(--color-bone)] text-[28px] sm:text-[32px]">
                        Are you ready to start?
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/pretest")}
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        I&rsquo;m ready, begin
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
