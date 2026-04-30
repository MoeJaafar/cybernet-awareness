"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
    shuffleQuestions,
    type KnowledgeQuestionShape,
} from "@/lib/instruments/knowledge";
import { useSession } from "@/lib/session";
import { useMessages } from "@/lib/i18n/use-locale";
import type { KnowledgeQuestionMessage } from "@/lib/i18n/types";

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
    const m = useMessages();
    const kt = m.knowledgeTest;
    const { logEvent } = useSession();
    const [shapes] = useState<KnowledgeQuestionShape[]>(() =>
        shuffleQuestions(seed),
    );
    const localisedById = useMemo(() => {
        const map: Record<string, KnowledgeQuestionMessage> = {};
        for (const q of m.knowledgeQuestions) map[q.id] = q;
        return map;
    }, [m.knowledgeQuestions]);

    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [submitting, setSubmitting] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const answersRef = useRef(answers);
    const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    useEffect(() => {
        if (!navOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setNavOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [navOpen]);

    const jumpTo = (i: number) => {
        if (autoAdvanceRef.current) {
            clearTimeout(autoAdvanceRef.current);
            autoAdvanceRef.current = null;
        }
        setIdx(i);
        setNavOpen(false);
    };

    const shape = shapes[idx];
    const localised = localisedById[shape.id];
    const total = shapes.length;
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
            const s = shapes[i];
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
        <div className="min-h-[100dvh] flex flex-col">
            <div className="flex-1 px-4 sm:px-6">
                <div className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-6 pt-5 sm:pt-10 pb-6">
                    <div className="flex items-center justify-between gap-3">
                        <span className="type-mono text-[color:var(--color-amber)]">
                            {title}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                                {kt.unitOf(completedCount, total)}
                            </span>
                            <button
                                type="button"
                                onClick={() => setNavOpen(true)}
                                aria-label={kt.navOpenLabel}
                                aria-expanded={navOpen}
                                className="inline-flex items-center justify-center h-9 w-9 border border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] text-[color:var(--color-bone-dim)] hover:text-[color:var(--color-amber)] transition-colors"
                            >
                                <BurgerIcon />
                            </button>
                        </div>
                    </div>

                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4 sm:gap-6"
                    >
                        <p className="type-ui text-[color:var(--color-bone)] text-[17px] sm:text-[20px] leading-relaxed">
                            {localised?.prompt ?? ""}
                        </p>

                        <div
                            role="radiogroup"
                            aria-label="Answer options"
                            className="flex flex-col gap-2"
                        >
                            {shape.options.map((opt) => {
                                const optLabel =
                                    localised?.options.find((o) => o.key === opt.key)
                                        ?.label ?? "";
                                const selected = current?.key === opt.key;
                                const borderClass = selected
                                    ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                    : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                                return (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => pickOption(opt.key)}
                                        className={`group text-start border ${borderClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-3 py-3 sm:px-5 sm:py-4 transition-all`}
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
                                                {optLabel}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className={`flex flex-col gap-2 sm:gap-3 transition-opacity ${hasAnswer ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                            <span id="confidence-label" className="type-mono text-[color:var(--color-bone-muted)]">
                                {kt.confidencePrompt}
                            </span>
                            <div
                                role="radiogroup"
                                aria-labelledby="confidence-label"
                                className="flex gap-2 sm:gap-3"
                            >
                                {kt.confidenceLabels.map((label, i) => {
                                    const val = i + 1;
                                    const selected = current?.confidence === val;
                                    const borderClass = selected
                                        ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                        : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
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
                </div>
            </div>

            <div className="sticky bottom-0 z-30 px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-t from-[color:var(--color-ink-base)] via-[color:var(--color-ink-base)]/95 to-transparent">
                <div className="max-w-2xl w-full mx-auto flex items-center gap-3">
                    {!allAnswered && (
                        <p className="type-mono text-[color:var(--color-bone-muted)] text-[12px] sm:text-sm">
                            {kt.unfinishedHint(total)}
                        </p>
                    )}
                    {allAnswered && (
                        <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                        >
                            {submitting ? kt.savingLabel : nextLabel}
                            <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                        </motion.button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {navOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-[color:var(--color-ink-deeper)]/85 backdrop-blur-sm flex items-center justify-center px-4"
                        onClick={() => setNavOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[color:var(--color-ink-raised)] border border-[color:var(--color-edge-subtle)] p-5 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label={kt.navHeading}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="type-mono text-[color:var(--color-amber)]">
                                    {kt.navHeading}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setNavOpen(false)}
                                    aria-label={kt.navCloseLabel}
                                    className="type-mono text-[color:var(--color-bone-muted)] hover:text-[color:var(--color-amber)] text-xl leading-none h-8 w-8 inline-flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                            <nav
                                aria-label={kt.navHeading}
                                className="grid grid-cols-5 gap-2"
                            >
                                {shapes.map((_, i) => {
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
                                            aria-label={kt.questionLabel(i, done)}
                                            aria-current={active ? "true" : undefined}
                                            className={`aspect-square border ${border} ${bg} type-mono tabular-nums transition-colors hover:border-[color:var(--color-amber)] ${
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
                            </nav>
                            <p className="type-mono text-[color:var(--color-bone-ghost)] mt-4 text-[11px]">
                                {kt.navHint}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function BurgerIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
        >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
    );
}
