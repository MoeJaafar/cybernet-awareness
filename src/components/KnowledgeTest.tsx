"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    shuffleStatements,
    CONFIDENCE_LABELS,
    type KnowledgeStatement,
} from "@/lib/instruments/knowledge";
import { useSession } from "@/lib/session";

type Answer = { answer: boolean; confidence: number };

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
    const [statements] = useState<KnowledgeStatement[]>(() => shuffleStatements(seed));
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});

    const q = statements[idx];
    const total = statements.length;
    const current = answers[idx];
    const allAnswered = Object.keys(answers).length === total;

    const setAnswer = (val: boolean) => {
        setAnswers((prev) => ({
            ...prev,
            [idx]: { answer: val, confidence: prev[idx]?.confidence ?? 0 },
        }));
    };

    const setConfidence = (val: number) => {
        setAnswers((prev) => ({
            ...prev,
            [idx]: { ...prev[idx], confidence: val },
        }));
    };

    const handleSubmit = () => {
        for (let i = 0; i < total; i++) {
            const a = answers[i];
            const s = statements[i];
            if (!a || !s) continue;
            logEvent(eventType, {
                questionId: s.id,
                concept: s.concept,
                answer: a.answer,
                correct: a.answer === s.answer,
                confidence: a.confidence,
            });
        }
        router.push(nextRoute);
    };

    const isComplete = (i: number) => {
        const a = answers[i];
        return a !== undefined && a.confidence > 0;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="type-mono text-[color:var(--color-amber)]">
                        {title}
                    </span>
                    <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                        {Object.keys(answers).filter((k) => isComplete(Number(k))).length} / {total} answered
                    </span>
                </div>

                {/* Navigation panel */}
                <div className="flex flex-wrap gap-1.5">
                    {statements.map((_, i) => {
                        const done = isComplete(i);
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

                {/* Question */}
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                >
                    <p className="type-body text-[color:var(--color-bone)] text-[22px] leading-relaxed">
                        {q.statement}
                    </p>

                    {/* True / False — always changeable */}
                    <div className="flex gap-3">
                        {([true, false] as const).map((val) => {
                            const selected = current?.answer === val;
                            const borderClass = selected
                                ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                            return (
                                <button
                                    key={String(val)}
                                    type="button"
                                    onClick={() => setAnswer(val)}
                                    className={`flex-1 border ${borderClass} py-4 type-display text-xl text-[color:var(--color-bone)] transition-all`}
                                >
                                    {val ? "True" : "False"}
                                </button>
                            );
                        })}
                    </div>

                    {/* Confidence — always changeable */}
                    {current?.answer !== undefined && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-3"
                        >
                            <span className="type-mono text-[color:var(--color-bone-muted)]">
                                how confident are you?
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
                                            onClick={() => setConfidence(val)}
                                            className={`flex-1 border ${borderClass} py-4 type-display text-lg text-[color:var(--color-bone)] transition-all`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Submit — only when all 20 are fully answered */}
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
