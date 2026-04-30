"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";
import { useRequireSession } from "@/lib/require-session";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";

/**
 * Demographics — collected AFTER the game and survey so the
 * questions don't prime pretest responses (stereotype threat,
 * confidence effects). One background event with all fields in its
 * payload; each field has a "prefer not to say" option.
 */

type Answers = {
    age?: string;
    gender?: string;
    role?: string;
    field?: string;
    primaryLanguage?: string;
    training?: string;
    passwordManager?: string;
    twoFactor?: string;
    phishingVictim?: string;
    publicWifi?: string;
    riskTolerance?: number;
    selfRating?: number;
};

export default function DemographicsPage() {
    useRequireSession();
    const router = useRouter();
    const locale = useLocale();
    const m = useMessages();
    const { logEvent } = useSession();
    const [answers, setAnswers] = useState<Answers>({});
    const [submitting, setSubmitting] = useState(false);
    const navigatingRef = useRef(false);

    const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
        setAnswers((prev) => ({ ...prev, [k]: v }));

    const handleSubmit = () => {
        if (submitting) return;
        if (navigatingRef.current) return;
        navigatingRef.current = true;
        setSubmitting(true);
        logEvent("demographics", { ...answers });
        logEvent("session_end");
        router.push(`/${locale}/done`);
    };

    const anyAnswered = Object.values(answers).some((v) => v !== undefined);

    const labels = m.demographics.labels;
    const opts = m.demographics.options;

    return (
        <div className="min-h-[100dvh] flex flex-col">
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-8"
            >
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                    <span className="type-mono text-[color:var(--color-amber)]">
                        {m.demographics.eyebrow}
                    </span>
                </div>

                <h1 className="type-display text-[color:var(--color-bone)] text-[26px] sm:text-[40px] leading-tight">
                    {m.demographics.heading}
                </h1>

                <p className="type-ui text-[color:var(--color-bone-dim)] text-[17px] leading-relaxed">
                    {m.demographics.intro}
                </p>

                <Section
                    label={labels.age}
                    options={opts.age}
                    value={answers.age}
                    onChange={(v) => set("age", v)}
                />
                <Section
                    label={labels.gender}
                    options={opts.gender}
                    value={answers.gender}
                    onChange={(v) => set("gender", v)}
                />
                <Section
                    label={labels.role}
                    options={opts.role}
                    value={answers.role}
                    onChange={(v) => set("role", v)}
                />
                <Section
                    label={labels.field}
                    options={opts.field}
                    value={answers.field}
                    onChange={(v) => set("field", v)}
                />
                <Section
                    label={labels.primaryLanguage}
                    options={opts.primaryLanguage}
                    value={answers.primaryLanguage}
                    onChange={(v) => set("primaryLanguage", v)}
                />
                <Section
                    label={labels.training}
                    options={opts.training}
                    value={answers.training}
                    onChange={(v) => set("training", v)}
                />
                <Section
                    label={labels.passwordManager}
                    options={opts.passwordManager}
                    value={answers.passwordManager}
                    onChange={(v) => set("passwordManager", v)}
                />
                <Section
                    label={labels.twoFactor}
                    options={opts.twoFactor}
                    value={answers.twoFactor}
                    onChange={(v) => set("twoFactor", v)}
                />
                <Section
                    label={labels.phishingVictim}
                    options={opts.phishingVictim}
                    value={answers.phishingVictim}
                    onChange={(v) => set("phishingVictim", v)}
                />
                <Section
                    label={labels.publicWifi}
                    options={opts.publicWifi}
                    value={answers.publicWifi}
                    onChange={(v) => set("publicWifi", v)}
                />

                {/* Risk tolerance — 1–5 scale. */}
                <div className="flex flex-col gap-3">
                    <span
                        id="risktolerance-label"
                        className="type-mono text-[color:var(--color-bone-muted)]"
                    >
                        {labels.riskTolerance}
                    </span>
                    <div
                        role="radiogroup"
                        aria-labelledby="risktolerance-label"
                        className="flex gap-2"
                    >
                        {[1, 2, 3, 4, 5].map((n) => {
                            const selected = answers.riskTolerance === n;
                            const base = selected
                                ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                            return (
                                <button
                                    key={n}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    aria-label={`${n} — ${
                                        n === 1
                                            ? labels.riskMin
                                            : n === 5
                                              ? labels.riskMax
                                              : ""
                                    }`}
                                    onClick={() => set("riskTolerance", n)}
                                    className={`flex-1 border ${base} py-4 type-display text-xl text-[color:var(--color-bone)] transition-all`}
                                >
                                    {n}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-between type-mono text-[color:var(--color-bone-muted)]">
                        <span>{labels.riskMin}</span>
                        <span>{labels.riskMax}</span>
                    </div>
                </div>

                {/* Self-rated awareness — 1–5 scale. */}
                <div className="flex flex-col gap-3">
                    <span
                        id="selfrating-label"
                        className="type-mono text-[color:var(--color-bone-muted)]"
                    >
                        {labels.selfRating}
                    </span>
                    <div
                        role="radiogroup"
                        aria-labelledby="selfrating-label"
                        className="flex gap-2"
                    >
                        {[1, 2, 3, 4, 5].map((n) => {
                            const selected = answers.selfRating === n;
                            const base = selected
                                ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                                : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                            return (
                                <button
                                    key={n}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    aria-label={`${n} — ${
                                        n === 1
                                            ? labels.selfRatingMin
                                            : n === 5
                                              ? labels.selfRatingMax
                                              : ""
                                    }`}
                                    onClick={() => set("selfRating", n)}
                                    className={`flex-1 border ${base} py-4 type-display text-xl text-[color:var(--color-bone)] transition-all`}
                                >
                                    {n}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex justify-between type-mono text-[color:var(--color-bone-muted)]">
                        <span>{labels.selfRatingMin}</span>
                        <span>{labels.selfRatingMax}</span>
                    </div>
                </div>

            </motion.div>
            </div>

            {/* Sticky bottom CTA */}
            <div className="sticky bottom-0 z-30 px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-t from-[color:var(--color-ink-base)] via-[color:var(--color-ink-base)]/95 to-transparent">
                <div className="max-w-2xl w-full mx-auto flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                    >
                        {submitting
                            ? m.demographics.finishingLabel
                            : anyAnswered
                              ? m.demographics.finishLabel
                              : m.demographics.skipFinishLabel}
                        <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                    </button>
                    {!anyAnswered && (
                        <p className="type-mono text-[color:var(--color-bone-ghost)] text-[11px] sm:text-xs">
                            {m.demographics.skipHint}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: readonly string[];
    value: string | undefined;
    onChange: (v: string) => void;
}) {
    const id = `sec-${label.replace(/\W+/g, "-").toLowerCase()}`;
    return (
        <div className="flex flex-col gap-3">
            <span id={id} className="type-mono text-[color:var(--color-bone-muted)]">
                {label}
            </span>
            <div
                role="radiogroup"
                aria-labelledby={id}
                className="flex flex-wrap gap-2"
            >
                {options.map((opt) => {
                    const selected = value === opt;
                    const base = selected
                        ? "border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/10"
                        : "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]";
                    return (
                        <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(opt)}
                            className={`border ${base} px-4 py-2 type-ui text-[15px] text-[color:var(--color-bone)] transition-all`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
