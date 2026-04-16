"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { EmailMock, EmailHotspot, SceneId } from "@/lib/types";

/**
 * Evidence-tag email preview. If hotspots are present the player can
 * click sender / subject to surface red-flag captions. If `link.trapsTo`
 * is set, clicking the link is a real in-world action that advances
 * the scene — the player can inspect (hover / long-press on the
 * hotspot caption) or fall for it.
 */
export function EmailMockup({
    email,
    onTrap,
}: {
    email: EmailMock;
    /** Called when a trapped link is clicked. The runner routes to
     *  email.link.trapsTo. */
    onTrap?: (target: SceneId) => void;
}) {
    const senderName = email.fromName ?? email.from;
    const initial = senderName.charAt(0).toUpperCase();
    const hotspotsByTarget = Object.fromEntries(
        (email.hotspots ?? []).map((h) => [h.target, h]),
    ) as Record<EmailHotspot["target"], EmailHotspot | undefined>;

    const [open, setOpen] = useState<Record<string, boolean>>({});
    const toggle = (target: string) =>
        setOpen((o) => ({ ...o, [target]: !o[target] }));

    return (
        <article className="border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deeper)]/90 backdrop-blur-md">
            {/* Header strip. */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deep)]">
                <span className="type-mono text-[color:var(--color-amber)]">
                    inbox.eml
                </span>
                <span className="type-mono text-[color:var(--color-bone-ghost)]">
                    09:12 · today
                </span>
            </div>

            {/* Meta block. */}
            <header className="px-5 py-4 flex items-start gap-4 border-b border-[color:var(--color-edge-subtle)]">
                <div
                    aria-hidden
                    className="h-10 w-10 flex items-center justify-center type-display text-xl text-[color:var(--color-ink-deep)] bg-[color:var(--color-bone-dim)] shrink-0"
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <div className="flex items-baseline flex-wrap gap-x-3 gap-y-0.5">
                        <span className="type-display text-[17px] text-[color:var(--color-bone)] truncate">
                            {email.fromName ?? email.from}
                        </span>
                        {email.fromName && (
                            <InspectableText
                                hotspot={hotspotsByTarget.from}
                                isOpen={open.from}
                                onToggle={() => toggle("from")}
                                className="type-mono text-[color:var(--color-bone-ghost)]"
                            >
                                &lt;{email.from}&gt;
                            </InspectableText>
                        )}
                    </div>
                    <span className="type-mono text-[color:var(--color-bone-muted)]">
                        to {email.to}
                    </span>
                </div>
            </header>

            {/* Subject + body. */}
            <div className="px-5 py-5 flex flex-col gap-4">
                <InspectableText
                    hotspot={hotspotsByTarget.subject}
                    isOpen={open.subject}
                    onToggle={() => toggle("subject")}
                    className="type-display text-[color:var(--color-bone)] text-xl leading-snug block"
                    as="h3"
                >
                    {email.subject}
                </InspectableText>

                <div className="type-body text-[15px] leading-[1.7] text-[color:var(--color-bone-dim)] whitespace-pre-line">
                    {email.body}
                </div>

                {email.link && (
                    <div className="pt-2 flex flex-col gap-2">
                        <TrapLink
                            link={email.link}
                            hotspot={hotspotsByTarget.link}
                            isInspected={!!open.link}
                            onInspect={() => toggle("link")}
                            onTrap={onTrap}
                        />
                    </div>
                )}
            </div>

            {/* Inspection hint. */}
            {(email.hotspots ?? []).length > 0 && (
                <footer className="border-t border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deep)] px-5 py-3">
                    <p className="type-mono text-[color:var(--color-amber)] mb-1">
                        {(email.hotspots ?? []).length} suspicious elements
                    </p>
                    <p className="type-body text-[13px] text-[color:var(--color-bone-ghost)] leading-snug">
                        Hover the sender or the subject to inspect. The link in
                        the body is a real link — clicking it has consequences.
                    </p>
                </footer>
            )}
        </article>
    );
}

/**
 * The link chip. Two interactions:
 *   - A small "inspect" eye-icon on the side toggles the red-flag
 *     caption without firing the trap. Safe for cautious players.
 *   - Clicking the link itself is the real-world action and fires
 *     onTrap. If the scenario set trapsTo, the runner advances to
 *     that scene.
 */
function TrapLink({
    link,
    hotspot,
    isInspected,
    onInspect,
    onTrap,
}: {
    link: NonNullable<EmailMock["link"]>;
    hotspot?: EmailHotspot;
    isInspected: boolean;
    onInspect: () => void;
    onTrap?: (target: SceneId) => void;
}) {
    const trap = link.trapsTo;
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-stretch gap-0">
                <button
                    type="button"
                    onClick={() => {
                        if (trap && onTrap) onTrap(trap);
                    }}
                    className="flex-1 text-left inline-flex items-center gap-2 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deep)] hover:border-[color:var(--color-signal-ice)] hover:bg-[color:var(--color-ink-raised)] px-3 py-2 font-mono text-sm text-[color:var(--color-signal-ice)] underline underline-offset-2 transition-colors"
                >
                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                        link
                    </span>
                    <span className="truncate">{link.url}</span>
                </button>
                {hotspot && (
                    <button
                        type="button"
                        onClick={onInspect}
                        title="Inspect this link instead of clicking it"
                        className={`border border-l-0 ${
                            isInspected
                                ? "border-[color:var(--color-amber)] text-[color:var(--color-amber)]"
                                : "border-[color:var(--color-edge-subtle)] text-[color:var(--color-bone-ghost)] hover:border-[color:var(--color-amber)] hover:text-[color:var(--color-amber)]"
                        } bg-[color:var(--color-ink-deep)] px-3 text-sm transition-colors`}
                        aria-label="Inspect link"
                    >
                        {/* Eye icon — simple SVG. */}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                        >
                            <path d="M1 8 s3 -5 7 -5 s7 5 7 5 s-3 5 -7 5 s-7 -5 -7 -5 z" />
                            <circle cx="8" cy="8" r="2" />
                        </svg>
                    </button>
                )}
            </div>
            <AnimatePresence>
                {isInspected && hotspot && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="type-body text-[13px] text-[color:var(--color-amber)] leading-snug pl-3 border-l border-[color:var(--color-amber)] overflow-hidden"
                    >
                        {hotspot.caption}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function InspectableText({
    children,
    hotspot,
    isOpen,
    onToggle,
    className = "",
    as: As = "span",
}: {
    children: React.ReactNode;
    hotspot?: EmailHotspot;
    isOpen?: boolean;
    onToggle: () => void;
    className?: string;
    as?: "span" | "h3";
}) {
    if (!hotspot) {
        return <As className={className}>{children}</As>;
    }
    return (
        <>
            <button
                type="button"
                onClick={onToggle}
                className={`${className} text-left hover-sweep cursor-help ${
                    isOpen ? "text-[color:var(--color-amber)]" : ""
                }`}
            >
                {children}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="type-body text-[13px] text-[color:var(--color-amber)] leading-snug pl-3 border-l border-[color:var(--color-amber)] mt-2 overflow-hidden"
                    >
                        {hotspot.caption}
                    </motion.p>
                )}
            </AnimatePresence>
        </>
    );
}
