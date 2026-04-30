"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

/**
 * Language picker. First screen any visitor sees at `/`. Always shown,
 * even on return visits — the user explicitly chose this UX over an
 * auto-redirect from cookie. Routing to /en or /ar passes through
 * middleware, which writes the cybernet_locale cookie.
 */
export default function LanguagePicker() {
    const router = useRouter();

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative">
            <div className="max-w-3xl w-full flex flex-col items-center gap-10 sm:gap-14">
                <motion.div
                    className="flex items-center gap-3 type-mono text-[color:var(--color-bone-muted)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                >
                    <span aria-hidden className="hidden sm:inline-block h-px w-10 bg-[color:var(--color-bone-ghost)]" />
                    <span className="text-center">choose your language · اختر لغتك</span>
                    <span aria-hidden className="hidden sm:inline-block h-px w-10 bg-[color:var(--color-bone-ghost)]" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="flex flex-col items-center gap-2 sm:gap-3"
                >
                    <h1
                        className="text-[56px] sm:text-[110px] lg:text-[140px] leading-[0.9] tracking-tight text-[color:var(--color-bone)] text-center"
                        style={{ fontFamily: "var(--font-instrument-serif)" }}
                    >
                        CyberNet
                    </h1>
                    <p
                        dir="rtl"
                        className="text-[40px] sm:text-[78px] lg:text-[100px] leading-[1] tracking-tight text-[color:var(--color-bone-dim)] text-center"
                        style={{ fontFamily: "var(--font-ibm-plex-arabic)" }}
                    >
                        سايبر​نت
                    </p>
                </motion.div>

                <motion.span
                    aria-hidden
                    className="block h-px w-24 bg-[color:var(--color-amber)]/60"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                />

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.8 }}
                >
                    <LangButton
                        label="English"
                        sublabel="Continue in English"
                        fontFamily="var(--font-instrument-serif)"
                        onClick={() => router.push("/en")}
                    />
                    <LangButton
                        label="العربية"
                        sublabel="المتابعة بالعربية"
                        dir="rtl"
                        fontFamily="var(--font-ibm-plex-arabic)"
                        onClick={() => router.push("/ar")}
                    />
                </motion.div>
            </div>
        </main>
    );
}

function LangButton({
    label,
    sublabel,
    dir,
    fontFamily,
    onClick,
}: {
    label: string;
    sublabel: string;
    dir?: "ltr" | "rtl";
    fontFamily: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            dir={dir}
            className="group flex-1 border border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)] bg-[color:var(--color-ink-raised)]/60 hover:bg-[color:var(--color-ink-higher)]/80 backdrop-blur-sm px-6 py-7 sm:py-8 transition-all duration-300 hover:shadow-[0_0_32px_var(--amber-glow)]"
        >
            <div className="flex flex-col items-center gap-2">
                <span
                    className="text-[40px] sm:text-[52px] leading-[1] text-[color:var(--color-bone)] group-hover:text-[color:var(--color-amber)] transition-colors"
                    style={{ fontFamily }}
                >
                    {label}
                </span>
                <span
                    className="text-[13px] sm:text-[14px] text-[color:var(--color-bone-muted)] type-mono"
                >
                    {sublabel}
                </span>
            </div>
        </button>
    );
}
