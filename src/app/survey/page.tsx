"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SURVEY_QUESTIONS, LIKERT_LABELS } from "@/lib/instruments/survey";
import { useSession } from "@/lib/session";
import { useRequireSession } from "@/lib/require-session";

export default function SurveyPage() {
    useRequireSession();
    const router = useRouter();
    const { logEvent } = useSession();
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);

    const q = SURVEY_QUESTIONS[idx];
    const total = SURVEY_QUESTIONS.length;
    const isLast = idx === total - 1;

    const handleSelect = (value: number) => {
        if (selected !== null) return;
        setSelected(value);
        logEvent("survey", {
            questionId: q.id,
            construct: q.construct,
            value,
        });
    };

    const handleNext = () => {
        if (isLast) {
            logEvent("session_end");
            router.push("/done");
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
                        feedback survey
                    </span>
                    <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                        {idx + 1} / {total}
                    </span>
                </div>

                <p className="type-body text-[color:var(--color-bone)] text-[22px] leading-relaxed">
                    &ldquo;{q.statement}&rdquo;
                </p>

                <div className="flex gap-2">
                    {LIKERT_LABELS.map((label, i) => {
                        const value = i + 1;
                        const isSelected = selected === value;
                        const baseClass = selected === null
                            ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] hover:bg-[color:var(--color-ink-higher)]"
                            : isSelected
                              ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                              : "border-[color:var(--color-edge-subtle)] opacity-40";
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleSelect(value)}
                                disabled={selected !== null}
                                className={`flex-1 flex flex-col items-center gap-2 border ${baseClass} py-4 px-2 transition-all disabled:cursor-default`}
                            >
                                <span className="type-display text-2xl text-[color:var(--color-bone)]">
                                    {value}
                                </span>
                                <span className="type-mono text-[color:var(--color-bone-muted)] text-center leading-tight" style={{ fontSize: "9px" }}>
                                    {label}
                                </span>
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
                            {isLast ? "Finish" : "Next"}
                            <span aria-hidden className="text-xl">→</span>
                        </button>
                    </motion.div>
                )}

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
