"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { shuffleStatements, CONFIDENCE_LABELS } from "@/lib/instruments/knowledge";
import { useSession } from "@/lib/session";

const statements = shuffleStatements("pre");

export default function PretestPage() {
    const router = useRouter();
    const { logEvent } = useSession();
    const [idx, setIdx] = useState(0);
    const [answer, setAnswer] = useState<boolean | null>(null);
    const [confidence, setConfidence] = useState<number | null>(null);

    const q = statements[idx];
    const total = statements.length;
    const isLast = idx === total - 1;
    const canAdvance = answer !== null && confidence !== null;

    const handleSubmit = () => {
        logEvent("pretest", {
            questionId: q.id,
            concept: q.concept,
            answer,
            correct: answer === q.answer,
            confidence,
        });
        if (isLast) {
            router.push("/play");
            return;
        }
        setAnswer(null);
        setConfidence(null);
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
                    &ldquo;{q.statement}&rdquo;
                </p>

                {/* True / False */}
                <div className="flex gap-3">
                    {([true, false] as const).map((val) => {
                        const selected = answer === val;
                        const borderClass = answer === null
                            ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]"
                            : selected
                              ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                              : "border-[color:var(--color-edge-subtle)] opacity-40";
                        return (
                            <button
                                key={String(val)}
                                type="button"
                                onClick={() => setAnswer(val)}
                                disabled={answer !== null}
                                className={`flex-1 border ${borderClass} py-4 type-display text-xl text-[color:var(--color-bone)] transition-all disabled:cursor-default`}
                            >
                                {val ? "True" : "False"}
                            </button>
                        );
                    })}
                </div>

                {/* Confidence — shows after picking True/False */}
                {answer !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3"
                    >
                        <span className="type-mono text-[color:var(--color-bone-muted)]">
                            how confident are you?
                        </span>
                        <div className="flex gap-2">
                            {CONFIDENCE_LABELS.map((label, i) => {
                                const val = i + 1;
                                const selected = confidence === val;
                                const borderClass = confidence === null
                                    ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]"
                                    : selected
                                      ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                      : "border-[color:var(--color-edge-subtle)] opacity-40";
                                return (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setConfidence(val)}
                                        disabled={confidence !== null}
                                        className={`flex-1 flex flex-col items-center gap-2 border ${borderClass} py-3 px-1 transition-all disabled:cursor-default`}
                                    >
                                        <span className="type-display text-xl text-[color:var(--color-bone)]">
                                            {val}
                                        </span>
                                        <span className="type-mono text-[color:var(--color-bone-muted)] text-center leading-tight" style={{ fontSize: "8px" }}>
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Next button — shows after both are picked */}
                {canAdvance && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            {isLast ? "Start the game" : "Next"}
                            <span aria-hidden className="text-xl">→</span>
                        </button>
                    </motion.div>
                )}

                {/* Progress bar */}
                <div className="w-full h-0.5 bg-[color:var(--color-bone-ghost)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[color:var(--color-amber)] transition-all duration-300"
                        style={{ width: `${((idx + (canAdvance ? 1 : 0)) / total) * 100}%` }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
