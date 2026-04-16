"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Full-bleed scene stage. Background image with a slow pushed-in
 * reveal, left-side portrait that rises from the bottom edge, and a
 * glass dialogue dock that slides up from below. Cross-fades are
 * keyed on `sceneKey` so parent can simply remount.
 */
export function Stage({
    sceneKey,
    background,
    portrait,
    hotspots,
    children,
    tone = "default",
}: {
    sceneKey: string;
    background: string;
    portrait?: ReactNode;
    hotspots?: ReactNode;
    children: ReactNode;
    /** `breach` and `contained` layer an additional colour wash. */
    tone?: "default" | "breach" | "contained";
}) {
    return (
        <div className="relative w-full min-h-[calc(100vh-61px)] overflow-hidden bg-[color:var(--color-ink-deeper)]">
            {/* Background plate. Slow scale + fade so it breathes. */}
            <motion.img
                key={sceneKey}
                src={background}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.2, 0.6, 0.2, 1] }}
                draggable={false}
            />

            {/* Darkening veil + left-to-right lighting falloff for focus. */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(4,3,2,0.35) 0%, rgba(4,3,2,0.15) 40%, rgba(4,3,2,0.82) 100%)",
                }}
            />

            {/* Tone-specific overlays for outcome scenes. */}
            {tone === "breach" && (
                <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(214, 69, 69, 0.30) 0%, transparent 70%)",
                    }}
                />
            )}
            {tone === "contained" && (
                <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none mix-blend-multiply"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(122, 148, 100, 0.22) 0%, transparent 70%)",
                    }}
                />
            )}

            {/* Portrait — anchored bottom-left, feathered into the scene.
             *  Size is held modest (~18vw cap) so the dialogue dock can
             *  center without competing. */}
            {portrait && (
                <motion.div
                    key={`${sceneKey}-portrait`}
                    className="hidden lg:block absolute bottom-0 left-6 w-[18vw] max-w-[260px] pointer-events-none"
                    initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <div
                        style={{
                            maskImage:
                                "linear-gradient(to top, rgba(0,0,0,0.85), black 30%, black)",
                            WebkitMaskImage:
                                "linear-gradient(to top, rgba(0,0,0,0.85), black 30%, black)",
                        }}
                    >
                        {portrait}
                    </div>
                </motion.div>
            )}

            {hotspots}

            {/* Dialogue dock. Centered with consistent gutter; portraits
             *  overlap from the left so no ugly left-offset math needed. */}
            <motion.div
                key={`${sceneKey}-dock`}
                className="absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-6 sm:pb-8 pt-16"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <div className="max-w-3xl mx-auto">{children}</div>
            </motion.div>

            {/* Corner bracket marks — small editorial flourish. */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
                <CornerMark position="tl" />
                <CornerMark position="tr" />
                <CornerMark position="bl" />
                <CornerMark position="br" />
            </div>
        </div>
    );
}

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
    const pos = {
        tl: "top-4 left-4",
        tr: "top-4 right-4",
        bl: "bottom-4 left-4",
        br: "bottom-4 right-4",
    }[position];
    const rotate = {
        tl: "",
        tr: "rotate-90",
        bl: "-rotate-90",
        br: "rotate-180",
    }[position];
    return (
        <svg
            className={`absolute ${pos} ${rotate} w-4 h-4 text-[color:var(--color-amber)] opacity-40`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
        >
            <path d="M0 6 L0 0 L6 0" />
        </svg>
    );
}
