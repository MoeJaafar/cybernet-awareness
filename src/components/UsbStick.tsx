"use client";

import { motion } from "motion/react";

/**
 * USB-drop stimulus. A single focus object, a thumb drive on a
 * floor/desk surface, with a tantalising label printed on it.
 * Choices render below in the decision row pattern.
 *
 * No interactive states on the drive itself. The whole decision
 * happens in what the player does NEXT, not in clicking around the
 * stick. Matches the real-world moment: you see it, you decide.
 */

export interface UsbStickProps {
    label: string;
    /** One-line placement caption ("on the carpet, near the printer"). */
    context?: string;
    choices: { label: string; nextId: string }[];
    onChoice: (nextId: string) => void;
}

export function UsbStick({ label, context, choices, onChoice }: UsbStickProps) {
    return (
        <div className="flex flex-col items-center gap-10 w-full">
            {/* ========== STICK VISUAL ========== */}
            <div className="relative w-full max-w-[min(525px,90vw)] aspect-[5/3] flex items-center justify-center">
                {/* Floor / surface wash. */}
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 35% at 50% 62%, rgba(255,153,51,0.08), transparent 70%)",
                    }}
                />
                {/* Cast shadow under the stick. */}
                <div
                    aria-hidden
                    className="absolute left-1/2 top-[66%] -translate-x-1/2 w-[62%] h-3 rounded-[50%]"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 75%)",
                        filter: "blur(6px)",
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative origin-center scale-[0.85] sm:scale-100"
                >
                    {/* USB body, side view. */}
                    <div className="flex items-center drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                        {/* Connector shell. */}
                        <div className="relative h-11 w-16 flex items-center justify-center">
                            <div className="h-full w-full bg-gradient-to-b from-[#b0b4b8] via-[#6b6f74] to-[#3c4045] border border-[#2a2c30] rounded-[2px]" />
                            <div className="absolute inset-[5px] bg-[#1a1c1f] rounded-[1px] flex items-center justify-center">
                                <div className="h-[11px] w-[70%] bg-[#d8c48a] rounded-[1px]" />
                            </div>
                        </div>
                        {/* Narrow seam between connector and body. */}
                        <div className="h-6 w-1 bg-[#2a2c30]" />
                        {/* Plastic body with label. */}
                        <div className="relative h-14 w-56 bg-gradient-to-b from-[#1b1b1d] via-[#0f1012] to-[#060708] border border-[#2c2d30] rounded-[3px] overflow-hidden">
                            {/* Inner bezel highlight. */}
                            <div
                                aria-hidden
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 40%)",
                                }}
                            />
                            {/* Paper label. Font is px-fixed so the scaled-down
                             *  stick on mobile stays legible — it ends up ~11px
                             *  effective at scale-[0.85], safe to read. */}
                            <div className="absolute inset-y-2 left-2 right-5 bg-[#efe7d4] border border-[#c4b995] flex items-center justify-center px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                                <span
                                    className="text-center text-[#3a2f1a] tracking-wide leading-tight"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                            {/* LED activity dot (dim, not plugged in). */}
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-amber)]/30" />
                            {/* Lanyard hole. */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3 w-3 rounded-full bg-[color:var(--color-ink-deep)] border border-[#2c2d30]" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {context && (
                <motion.p
                    className="type-mono text-[color:var(--color-bone-muted)] text-center max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {context}
                </motion.p>
            )}

            {/* ========== CHOICES ========== */}
            <motion.div
                className="w-full max-w-xl flex flex-col gap-0 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-raised)]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
            >
                {choices.map((c, i) => (
                    <button
                        key={c.label}
                        type="button"
                        onClick={() => onChoice(c.nextId)}
                        className="group text-left border-b last:border-b-0 border-[color:var(--color-edge-subtle)] py-5 px-5 flex items-start gap-5 hover:bg-[color:var(--color-amber-wash,rgba(255,153,51,0.05))] transition-colors"
                    >
                        <span className="type-display text-2xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors w-6 shrink-0 tabular-nums">
                            {String.fromCharCode(65 + i)}
                        </span>
                        <span className="type-body text-[21px] text-[color:var(--color-bone)] leading-snug flex-1">
                            {c.label}
                        </span>
                        <span
                            aria-hidden
                            className="type-mono self-center text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors translate-x-[-4px] group-hover:translate-x-0 duration-300"
                        >
                            →
                        </span>
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
