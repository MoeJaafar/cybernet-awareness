"use client";

import { useEffect, useRef, useState } from "react";
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
    const [submitting, setSubmitting] = useState(false);
    const answersRef = useRef(answers);
    const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    // Jumping to a specific question via the nav panel cancels any
    // pending auto-advance so we don't override the user's intent.
    const jumpTo = (i: number) => {
        if (autoAdvanceRef.current) {
            clearTimeout(autoAdvanceRef.current);
            autoAdvanceRef.current = null;
        }
        setIdx(i);
    };

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
        // Auto-advance to the next unanswered question after a short
        // delay so the user sees their selection register. The timer
        // is stored in a ref so manual nav can cancel it.
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = setTimeout(() => {
            autoAdvanceRef.current = null;
            const latest = answersRef.current;
            setIdx((currentIdx) => {
                for (let step = 1; step < total; step++) {
                    const candidate = (currentIdx + step) % total;
                    if (latest[candidate]?.key === undefined) {
                        return candidate;
                    }
                }
                return currentIdx;
            });
        }, 350);
    };

    const handleSubmit = () => {
        if (submitting || !allAnswered) return;
        setSubmitting(true);
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
        <div className="min-h-screen px-4 sm:px-6 pb-24 sm:pb-8">
            <div className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-6 pt-6 sm:pt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="type-mono text-[color:var(--color-amber)]">
                        {title}
                    </span>
                    <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                        {completedCount} / {total}
                    </span>
                </div>

                {/* Question */}
                <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4 sm:gap-6"
                >
                    <p className="type-ui text-[color:var(--color-bone)] text-[17px] sm:text-[20px] leading-relaxed">
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
                                    className={`group text-left border ${borderClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-3 py-3 sm:px-5 sm:py-4 transition-all`}
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <span className={`type-display text-lg sm:text-xl w-5 sm:w-6 shrink-0 transition-colors ${
                                            selected
                                                ? "text-[color:var(--color-amber)]"
                                                : "text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)]"
                                        }`}>
                                            {opt.key.toUpperCase()}
                                        </span>
                                        <span className="type-ui text-[14px] sm:text-[16px] text-[color:var(--color-bone)] leading-snug flex-1">
                                            {opt.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Optional confidence */}
                    <div className={`flex flex-col gap-2 sm:gap-3 transition-opacity ${hasAnswer ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <span className="type-mono text-[color:var(--color-bone-muted)]">
                            how confident? (optional)
                        </span>
                        <div className="flex gap-2 sm:gap-3">
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
                                        className={`flex-1 border ${borderClass} py-2.5 sm:py-3 type-ui text-sm sm:text-base font-medium text-[color:var(--color-bone)] transition-all`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Nav + submit, inline on the page, scrolls with it */}
                <div className="flex flex-col gap-3 pt-2">
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
                                    onClick={() => jumpTo(i)}
                                    className={`w-7 h-7 sm:w-9 sm:h-9 border ${border} ${bg} type-mono text-[10px] sm:text-[11px] tabular-nums transition-colors hover:border-[color:var(--color-amber)] ${
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
                                disabled={submitting}
                                className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                            >
                                {submitting ? "Saving…" : nextLabel}
                                <span aria-hidden className="text-xl">→</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
