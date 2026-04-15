"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Full-bleed visual-novel stage. Lays a background image across the
 * viewport, then positions a portrait slot and a dialogue slot on top.
 * Optional hotspot slot for point-and-click scenes.
 *
 * The entire stage cross-fades when `sceneKey` changes (driven by the
 * runner). We deliberately use a short fade rather than a slide —
 * slides imply physical movement through a 3D world; the game is
 * discrete scenes, and cross-fade respects that.
 */
export function Stage({
    sceneKey,
    background,
    portrait,
    hotspots,
    children,
}: {
    sceneKey: string;
    /** Path relative to /public, e.g. "/art/backgrounds/office-desk.svg" */
    background: string;
    portrait?: ReactNode;
    hotspots?: ReactNode;
    /** Dialogue / decision UI, docked at the bottom. */
    children: ReactNode;
}) {
    return (
        <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[color:var(--color-bg-base)]">
            <motion.img
                key={sceneKey}
                src={background}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            />

            {/* Vignette for focus. */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 40%, rgba(6, 8, 20, 0.55) 100%)",
                }}
            />

            {portrait && (
                <motion.div
                    key={`${sceneKey}-portrait`}
                    className="absolute bottom-[28%] left-8 sm:left-16 w-[180px] sm:w-[240px] pointer-events-none"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
                >
                    {portrait}
                </motion.div>
            )}

            {hotspots}

            <motion.div
                key={`${sceneKey}-dialogue`}
                className="absolute inset-x-0 bottom-0 px-4 sm:px-10 pb-6 pt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            >
                <div className="max-w-3xl mx-auto">{children}</div>
            </motion.div>
        </div>
    );
}
