"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    shuffleQuestions,
    CONFIDENCE_LABELS,
    type KnowledgeQuestion,
} from "@/lib/instruments/knowledge";
import { useSession } from "@/lib/session";

type Answer = { key: string; confidence: number };

export function KnowledgeTest({
    title,
    seed,
    eventType,
    nextRoute,
    nextLabel,
}: {
    title: string;
    seed: "pre" | "post";
    eventType: string;
    nextRoute: string;
    nextLabel: string;
}) {
    const router = useRouter();
    const { logEvent } = useSession();
    const [questions] = useState<KnowledgeQuestion[]>(() => shuffleQuestions(seed));
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});

    const q = questions[idx];
    const total = questions.length;
    const current = answers[idx];
    const completedCount = Object.keys(answers).filter(
        (k) => answers[Number(k)]?.key !== undefined,
    ).length;
    const allAnswered = completedCount === total;

    const pickOption = (key: string) => {
        setAnswers((prev) => ({
            ...prev,
            [idx]: { key, confidence: prev[idx]?.confidence ?? 0 },
        }));
    };

    const pickConfidence = (val: number) => {
        setAnswers((prev) => ({
            ...prev,
            [idx]: { ...prev[idx], confidence: val },
        }));
    };

    const handleSubmit = () => {
        let totalCorrect = 0;
        let totalConfidentCorrect = 0;
        let totalConfidentWrong = 0;
        for (let i = 0; i < total; i++) {
            const a = answers[i];
            const s = questions[i];
            if (!a || !s) continue;
            const correctKey = s.options.find((o) => o.correct)?.key;
            const correct = a.key === correctKey;
            const confident = a.confidence === 2;
            if (correct) totalCorrect++;
            if (correct && confident) totalConfidentCorrect++;
            if (!correct && confident) totalConfidentWrong++;
            logEvent(eventType, {
                questionId: s.id,
                concept: s.concept,
                userAnswer: a.key,
                correctAnswer: correctKey,
                correct,
                confidence: a.confidence || null,
            });
        }
        logEvent(`${eventType}_summary`, {
            totalQuestions: total,
            totalCorrect,
            totalWrong: total - totalCorrect,
            accuracy: Math.round((totalCorrect / total) * 100),
            totalConfidentCorrect,
            totalConfidentWrong,
        });
        router.push(nextRoute);
    };

    const hasAnswer = current?.key !== undefined;

    return (
        <div className="min-h-screen flex flex-col px-6">
            {/* Header */}
            <div className="max-w-2xl w-full mx-auto pt-10 pb-4 flex items-center justify-between">
                <span className="type-mono text-[color:var(--color-amber)]">
                    {title}
                </span>
                <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                    {completedCount} / {total}
                </span>
            </div>

            {/* Question area */}
            <div className="flex-1 flex items-center">
                <div className="max-w-2xl w-full mx-auto">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-6"
                    >
                        <p className="type-body text-[color:var(--color-bone)] text-[20px] leading-relaxed">
                            {q.prompt}
                        </p>

                        {/* 4 options */}
                        <div className="flex flex-col gap-2">
                            {q.options.map((opt) => {
                                const selected = current?.key === opt.key;
                                const borderClass = selected
                                    ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                    : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                                return (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => pickOption(opt.key)}
                                        className={`group text-left border ${borderClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-5 py-4 transition-all`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className={`type-display text-xl w-6 shrink-0 transition-colors ${
                                                selected
                                                    ? "text-[color:var(--color-amber)]"
                                                    : "text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)]"
                                            }`}>
                                                {opt.key.toUpperCase()}
                                            </span>
                                            <span className="type-body text-[16px] text-[color:var(--color-bone)] leading-snug flex-1">
                                                {opt.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Optional confidence */}
                        <div className={`flex flex-col gap-3 transition-opacity ${hasAnswer ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                            <span className="type-mono text-[color:var(--color-bone-muted)]">
                                how confident? (optional)
                            </span>
                            <div className="flex gap-3">
                                {CONFIDENCE_LABELS.map((label, i) => {
                                    const val = i + 1;
                                    const selected = current?.confidence === val;
                                    const borderClass = selected
                                        ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                        : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => pickConfidence(val)}
                                            className={`flex-1 border ${borderClass} py-3 type-body text-base font-medium text-[color:var(--color-bone)] transition-all`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom: nav + submit */}
            <div className="max-w-2xl w-full mx-auto pb-8 pt-4 flex flex-col gap-4">
                <div className="flex flex-wrap gap-1.5">
                    {questions.map((_, i) => {
                        const done = answers[i]?.key !== undefined;
                        const active = i === idx;
                        const bg = done
                            ? "bg-[color:var(--color-amber)]/20"
                            : "bg-transparent";
                        const border = active
                            ? "border-[color:var(--color-amber)]"
                            : done
                              ? "border-[color:var(--color-amber)]/40"
                              : "border-[color:var(--color-edge-subtle)]";
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIdx(i)}
                                className={`w-9 h-9 border ${border} ${bg} type-mono text-[11px] tabular-nums transition-colors hover:border-[color:var(--color-amber)] ${
                                    active
                                        ? "text-[color:var(--color-amber)]"
                                        : done
                                          ? "text-[color:var(--color-bone-dim)]"
                                          : "text-[color:var(--color-bone-ghost)]"
                                }`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>

                {!allAnswered && (
                    <p className="type-mono text-[color:var(--color-bone-muted)]">
                        answer all {total} questions to continue
                    </p>
                )}

                {allAnswered && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            {nextLabel}
                            <span aria-hidden className="text-xl">→</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
