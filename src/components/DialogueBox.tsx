"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Bottom-screen dialogue box styled like a SOC console readout.
 * Typewriter effect reveals the text one character at a time, with
 * a prominent skip/continue affordance. The text lives on the
 * Stage's dialogue slot; choices and primary buttons are children.
 */
export function DialogueBox({
    speaker,
    text,
    instant = false,
    children,
}: {
    speaker?: string;
    text: string;
    /** Skip the typewriter and show the text in full. */
    instant?: boolean;
    /** Buttons / choices / continue CTA rendered below the body text. */
    children?: ReactNode;
}) {
    const revealed = useTypewriter(text, instant ? 0 : 18);

    return (
        <motion.section
            className="rounded-xl border border-[color:var(--color-border-hard)] bg-[color:var(--color-bg-panel)]/92 backdrop-blur-md shadow-[0_12px_48px_-16px_rgba(0,0,0,0.75)] px-5 sm:px-7 py-5 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {speaker && (
                <p className="mono-tag text-[color:var(--color-accent)] mb-2">
                    {speaker}
                </p>
            )}
            <div
                className="text-base sm:text-lg leading-relaxed text-[color:var(--color-text-primary)] min-h-[3.5em]"
                // Bold-text support — authored content uses **bold** as in Markdown.
                dangerouslySetInnerHTML={{
                    __html: revealed.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-[color:var(--color-accent)]">$1</strong>',
                    ),
                }}
            />
            {children && (
                <div className="mt-5 flex flex-col gap-3">{children}</div>
            )}
        </motion.section>
    );
}

/**
 * Reveals `text` one character at a time. Returns the growing
 * substring. `speedMs = 0` returns the full string immediately.
 */
function useTypewriter(text: string, speedMs: number): string {
    const [n, setN] = useState(speedMs === 0 ? text.length : 0);
    useEffect(() => {
        setN(speedMs === 0 ? text.length : 0);
    }, [text, speedMs]);
    useEffect(() => {
        if (speedMs === 0) return;
        if (n >= text.length) return;
        const id = window.setTimeout(() => setN((k) => k + 1), speedMs);
        return () => window.clearTimeout(id);
    }, [n, text, speedMs]);
    return text.slice(0, n);
}
