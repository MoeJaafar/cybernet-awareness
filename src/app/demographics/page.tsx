"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";
import { useRequireSession } from "@/lib/require-session";

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
    training?: string;
    selfRating?: number;
};

const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+", "Prefer not to say"] as const;
const GENDERS = ["Female", "Male", "Prefer not to say"] as const;
const ROLES = [
    "Student",
    "IT professional",
    "Non-IT professional",
    "Other",
    "Prefer not to say",
] as const;
const FIELDS = [
    "STEM (science, tech, engineering, maths)",
    "Non-STEM",
    "No formal field",
    "Prefer not to say",
] as const;
const TRAINING = [
    "None",
    "Informal (articles, videos, work emails)",
    "Formal course or module",
    "Certification (CompTIA, CEH, CISSP, etc.)",
    "Prefer not to say",
] as const;

export default function DemographicsPage() {
    useRequireSession();
    const router = useRouter();
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
        router.push("/done");
    };

    // Entire form is skippable; nothing is required.
    const anyAnswered =
        answers.age !== undefined ||
        answers.gender !== undefined ||
        answers.role !== undefined ||
        answers.field !== undefined ||
        answers.training !== undefined ||
        answers.selfRating !== undefined;

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full flex flex-col gap-8"
            >
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                    <span className="type-mono text-[color:var(--color-amber)]">
                        a little about you
                    </span>
                </div>

                <h1 className="type-display text-[color:var(--color-bone)] text-[32px] sm:text-[40px] leading-tight">
                    One last step.
                </h1>

                <p className="type-ui text-[color:var(--color-bone-dim)] text-[17px] leading-relaxed">
                    This helps me describe who participated. Every question is
                    optional, and nothing here can be used to identify you.
                </p>

                <Section
                    label="Your age"
                    options={AGE_RANGES}
                    value={answers.age}
                    onChange={(v) => set("age", v)}
                />
                <Section
                    label="Gender"
                    options={GENDERS}
                    value={answers.gender}
                    onChange={(v) => set("gender", v)}
                />
                <Section
                    label="What best describes you right now?"
                    options={ROLES}
                    value={answers.role}
                    onChange={(v) => set("role", v)}
                />
                <Section
                    label="Your field of study or work"
                    options={FIELDS}
                    value={answers.field}
                    onChange={(v) => set("field", v)}
                />
                <Section
                    label="Prior cybersecurity training"
                    options={TRAINING}
                    value={answers.training}
                    onChange={(v) => set("training", v)}
                />

                {/* Self-rated awareness — 1–5 scale. */}
                <div className="flex flex-col gap-3">
                    <span
                        id="selfrating-label"
                        className="type-mono text-[color:var(--color-bone-muted)]"
                    >
                        Overall, how would you rate your cybersecurity
                        awareness?
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
                                            ? "beginner"
                                            : n === 5
                                              ? "expert"
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
                        <span>beginner</span>
                        <span>expert</span>
                    </div>
                </div>

                <div className="border-t border-[color:var(--color-edge-subtle)] pt-6 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                    >
                        {submitting ? "Finishing…" : anyAnswered ? "Finish" : "Skip and finish"}
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                    {!anyAnswered && (
                        <p className="type-mono text-[color:var(--color-bone-ghost)]">
                            leave everything blank to skip
                        </p>
                    )}
                </div>
            </motion.div>
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
