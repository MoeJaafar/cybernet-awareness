"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";

export default function ConsentPage() {
    const router = useRouter();
    const locale = useLocale();
    const m = useMessages();
    const { startSession, logEvent } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAgree = async () => {
        if (submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            await startSession(locale);
            logEvent("consent");
            router.push(`/${locale}/briefing`);
        } catch (err) {
            setSubmitting(false);
            setError(m.consent.errorMessage);
            console.error(err);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col">
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl w-full mx-auto flex flex-col gap-5 sm:gap-8"
                >
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                        <span className="type-mono text-[color:var(--color-amber)]">
                            {m.consent.eyebrow}
                        </span>
                    </div>

                    <h1 className="type-display text-[color:var(--color-bone)] text-[26px] sm:text-[48px] leading-tight">
                        {m.consent.heading}
                    </h1>

                    <div className="type-body text-[color:var(--color-bone-dim)] text-[15px] sm:text-[18px] leading-relaxed flex flex-col gap-3 sm:gap-4">
                        {m.consent.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                        <p>
                            {m.consent.questionsLine}
                            <a
                                href="mailto:m.jaafar@innopolis.university"
                                className="text-[color:var(--color-amber)] underline underline-offset-2 hover:brightness-110 break-all"
                            >
                                m.jaafar@innopolis.university
                            </a>
                            .
                        </p>
                    </div>

                    <p className="type-body text-[color:var(--color-bone)] text-[15px] sm:text-[18px] border-t border-[color:var(--color-edge-subtle)] pt-5 sm:pt-6">
                        {m.consent.agreeNote}
                    </p>
                </motion.div>
            </div>

            {/* Sticky bottom CTA */}
            <div className="sticky bottom-0 z-30 px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-t from-[color:var(--color-ink-base)] via-[color:var(--color-ink-base)]/95 to-transparent">
                <div className="max-w-2xl w-full mx-auto flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={handleAgree}
                        disabled={submitting}
                        aria-busy={submitting}
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                    >
                        {submitting ? m.consent.startingButton : m.consent.agreeButton}
                        <span aria-hidden className="text-xl rtl:rotate-180">→</span>
                    </button>
                    {error && (
                        <p className="type-mono text-[color:var(--color-signal-red)] text-sm">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
