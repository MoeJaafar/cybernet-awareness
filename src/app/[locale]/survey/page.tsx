"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SURVEY_QUESTIONS } from "@/lib/instruments/survey";
import { useSession } from "@/lib/session";
import { useRequireSession } from "@/lib/require-session";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";

export default function SurveyPage() {
    useRequireSession();
    const router = useRouter();
    const locale = useLocale();
    const m = useMessages();
    const { logEvent } = useSession();
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const loggedRef = useRef<Set<number>>(new Set());
    const navigatingRef = useRef(false);

    const q = SURVEY_QUESTIONS[idx];
    // The translated statement for this question, looked up by id so
    // structure stays decoupled from copy.
    const statement = m.survey.questions.find((x) => x.id === q.id)?.statement
        ?? "";
    const total = SURVEY_QUESTIONS.length;
    const isLast = idx === total - 1;

    const handleNext = () => {
        if (selected === null) return;
        if (submitting) return;
        if (navigatingRef.current) return;
        navigatingRef.current = true;
        if (isLast) setSubmitting(true);
        if (!loggedRef.current.has(idx)) {
            loggedRef.current.add(idx);
            logEvent("survey", {
                questionId: q.id,
                construct: q.construct,
                value: selected,
            });
        }
        if (isLast) {
            router.push(`/${locale}/demographics`);
            return;
        }
        setSelected(null);
        setIdx((i) => i + 1);
        setTimeout(() => {
            navigatingRef.current = false;
        }, 0);
    };

    return (
        <div className="min-h-[100dvh] flex flex-col">
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-8"
                >
                    <div className="flex items-center justify-between">
                        <span className="type-mono text-[color:var(--color-amber)]">
                            {m.survey.eyebrow}
                        </span>
                        <span className="type-mono text-[color:var(--color-bone-muted)] tabular-nums">
                            {idx + 1} / {total}
                        </span>
                    </div>

                    <p className="type-ui text-[color:var(--color-bone)] text-[18px] sm:text-[22px] leading-relaxed">
                        {statement}
                    </p>

                    <div
                        role="radiogroup"
                        aria-label={m.survey.agreementLabel}
                        className="flex gap-1.5 sm:gap-2"
                    >
                        {m.survey.likertLabels.map((label, i) => {
                            const value = i + 1;
                            const isSelected = selected === value;
                            const baseClass = isSelected
                                ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] hover:bg-[color:var(--color-ink-higher)]";
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    aria-label={label}
                                    onClick={() => setSelected(value)}
                                    className={`flex-1 flex flex-col items-center gap-1 sm:gap-2 border ${baseClass} py-3 sm:py-4 px-1 sm:px-2 transition-all`}
                                >
                                    <span className="type-display text-xl sm:text-2xl text-[color:var(--color-bone)]">
                                        {value}
                                    </span>
                                    <span className="type-mono text-[color:var(--color-bone-muted)] text-center leading-tight" style={{ fontSize: "9px" }}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-full h-0.5 bg-[color:var(--color-bone-ghost)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[color:var(--color-amber)] transition-all duration-300"
                            style={{ width: `${((idx + (selected !== null ? 1 : 0)) / total) * 100}%` }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Sticky bottom CTA */}
            <div className="sticky bottom-0 z-30 px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-t from-[color:var(--color-ink-base)] via-[color:var(--color-ink-base)]/95 to-transparent">
                <div className="max-w-2xl w-full mx-auto min-h-[56px] flex items-center">
                    {selected !== null ? (
                        <motion.button
                            type="button"
                            onClick={handleNext}
                            disabled={submitting}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                        >
                            {isLast
                                ? submitting
                                    ? m.survey.finishingLabel
                                    : m.survey.finishLabel
                                : m.survey.nextLabel}
                            <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                        </motion.button>
                    ) : (
                        <p className="type-mono text-[color:var(--color-bone-muted)] text-[12px] sm:text-sm">
                            {m.survey.chooseHint}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
