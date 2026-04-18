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
    primaryLanguage?: string;
    training?: string;
    passwordManager?: string;
    twoFactor?: string;
    phishingVictim?: string;
    publicWifi?: string;
    riskTolerance?: number;
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
const PRIMARY_LANGUAGE = [
    "English",
    "Russian",
    "Arabic",
    "Italian",
    "Spanish",
    "Other",
    "Prefer not to say",
] as const;
const TRAINING = [
    "None",
    "Informal (articles, videos, work emails)",
    "Formal course or module",
    "Certification (CompTIA, CEH, CISSP, etc.)",
    "Prefer not to say",
] as const;
const PASSWORD_MANAGER = [
    "Yes",
    "No",
    "Not sure what that means",
    "Prefer not to say",
] as const;
const TWO_FACTOR = [
    "None",
    "Some accounts",
    "Most or all accounts",
    "Not sure what that means",
    "Prefer not to say",
] as const;
const PHISHING_VICTIM = [
    "Yes",
    "No",
    "Not sure",
    "Prefer not to say",
] as const;
const PUBLIC_WIFI = [
    "Never",
    "Occasionally",
    "Regularly",
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
        answers.primaryLanguage !== undefined ||
        answers.training !== undefined ||
        answers.passwordManager !== undefined ||
        answers.twoFactor !== undefined ||
        answers.phishingVictim !== undefined ||
        answers.publicWifi !== undefined ||
        answers.riskTolerance !== undefined ||
        answers.selfRating !== undefined;

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
                        a little about you
                    </span>
                </div>

                <h1 className="type-display text-[color:var(--color-bone)] text-[26px] sm:text-[40px] leading-tight">
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
                    label="What language do you use day-to-day on your devices?"
                    options={PRIMARY_LANGUAGE}
                    value={answers.primaryLanguage}
                    onChange={(v) => set("primaryLanguage", v)}
                />
                <Section
                    label="Prior cybersecurity training"
                    options={TRAINING}
                    value={answers.training}
                    onChange={(v) => set("training", v)}
                />
                <Section
                    label="Do you use a password manager (1Password, Bitwarden, the one built into your browser, etc.)?"
                    options={PASSWORD_MANAGER}
                    value={answers.passwordManager}
                    onChange={(v) => set("passwordManager", v)}
                />
                <Section
                    label="Do you use two-factor authentication (codes from an app or SMS) on your accounts?"
                    options={TWO_FACTOR}
                    value={answers.twoFactor}
                    onChange={(v) => set("twoFactor", v)}
                />
                <Section
                    label="Have you ever been the target of a phishing or scam message that almost worked, or that did?"
                    options={PHISHING_VICTIM}
                    value={answers.phishingVictim}
                    onChange={(v) => set("phishingVictim", v)}
                />
                <Section
                    label="How often do you connect to public Wi-Fi in cafés, airports, or hotels?"
                    options={PUBLIC_WIFI}
                    value={answers.publicWifi}
                    onChange={(v) => set("publicWifi", v)}
                />

                {/* Risk tolerance — 1–5 scale. */}
                <div className="flex flex-col gap-3">
                    <span
                        id="risktolerance-label"
                        className="type-mono text-[color:var(--color-bone-muted)]"
                    >
                        In everyday choices, how cautious or open-to-risk
                        would you say you are?
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
                                            ? "very cautious"
                                            : n === 5
                                              ? "open to risk"
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
                        <span>very cautious</span>
                        <span>open to risk</span>
                    </div>
                </div>

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
                        {submitting ? "Finishing…" : anyAnswered ? "Finish" : "Skip and finish"}
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                    {!anyAnswered && (
                        <p className="type-mono text-[color:var(--color-bone-ghost)] text-[11px] sm:text-xs">
                            leave everything blank to skip
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
