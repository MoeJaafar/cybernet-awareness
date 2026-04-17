"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Workspace surface , used when the scene IS the screen: a Gmail
 * mock, a password form, a phone call. No character portraits, no
 * background image, no staged dialogue dock. Just a calm dark page
 * with a small narrator ribbon above the interactive content.
 */
export function Workspace({
    narrator,
    prompt,
    children,
}: {
    /** Small speaker label above the content ("your move", etc). */
    narrator?: string;
    /** Optional one-line narration above the content. */
    prompt?: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-[color:var(--color-ink-deep)] px-4 sm:px-8 py-8 sm:py-12">
            <motion.div
                className="max-w-3xl mx-auto flex flex-col gap-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {(narrator || prompt) && (
                    <header className="flex flex-col gap-2 px-1">
                        {narrator && (
                            <div className="flex items-center gap-3">
                                <span className="h-px w-6 bg-[color:var(--color-amber)]"></span>
                                <span className="type-mono text-[color:var(--color-amber)]">
                                    {narrator}
                                </span>
                            </div>
                        )}
                        {prompt && (
                            <p className="type-body text-lg sm:text-xl text-[color:var(--color-bone-dim)] leading-relaxed max-w-2xl">
                                {prompt}
                            </p>
                        )}
                    </header>
                )}
                {children}
            </motion.div>
        </div>
    );
}
