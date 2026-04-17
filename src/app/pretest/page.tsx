"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { shuffleQuestions } from "@/lib/instruments/knowledge";
import { useSession } from "@/lib/session";

const questions = shuffleQuestions("pre");

export default function PretestPage() {
    const router = useRouter();
    const { logEvent } = useSession();
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);

    const q = questions[idx];
    const total = questions.length;
    const isLast = idx === total - 1;

    const handleSelect = (optIdx: number) => {
        if (selected !== null) return;
        setSelected(optIdx);
        logEvent("pretest", {
            questionId: q.id,
            answer: q.options[optIdx].label,
            correct: q.options[optIdx].correct,
        });
    };

    const handleNext = () => {
        if (isLast) {
            router.push("/");
            return;
        }
        setSelected(null);
        setIdx((i) => i + 1);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl w-full flex flex-col gap-8"
            >
                <div className="flex items-center justify-between">
                    <span className="type-mono text-[color:var(--color-amber)]">
                        pre-test
                    </span>
                    <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                        {idx + 1} / {total}
                    </span>
                </div>

                <p className="type-body text-[color:var(--color-bone)] text-[22px] leading-relaxed">
                    {q.prompt}
                </p>

                <div className="flex flex-col gap-2">
                    {q.options.map((opt, i) => {
                        const isSelected = selected === i;
                        const borderClass = selected === null
                            ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]"
                            : isSelected
                              ? "border-[color:var(--color-amber)]"
                              : "border-[color:var(--color-edge-subtle)] opacity-50";
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleSelect(i)}
                                disabled={selected !== null}
                                className={`group text-left border ${borderClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-5 py-4 transition-all disabled:cursor-default`}
                            >
                                <div className="flex items-start gap-4">
                                    <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="type-body text-[17px] text-[color:var(--color-bone)] leading-snug flex-1">
                                        {opt.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            {isLast ? "Start the game" : "Next"}
                            <span aria-hidden className="text-xl">→</span>
                        </button>
                    </motion.div>
                )}

                {/* Progress bar. */}
                <div className="w-full h-0.5 bg-[color:var(--color-bone-ghost)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[color:var(--color-amber)] transition-all duration-300"
                        style={{ width: `${((idx + (selected !== null ? 1 : 0)) / total) * 100}%` }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
