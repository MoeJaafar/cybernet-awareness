"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type {
    EmailMock,
    EmailHotspot,
    SceneId,
    Choice,
} from "@/lib/types";

/**
 * Gmail-accurate email view (dark mode). Three in-world interactions:
 *
 *   1. Clicking the link in the body fires onTrap → outcome scene.
 *      A small eye-icon beside the link lets cautious players inspect
 *      the URL first without triggering the trap.
 *   2. Toolbar buttons (Report spam, Delete, Archive) fire onChoice
 *      when the current scenario has choices mapped to those actions.
 *   3. The sender line and subject are hover-inspectable if the
 *      scenario author set hotspots on them.
 *
 * The component is styled to match Gmail's dark mode, Roboto font,
 * #202124 background, blue #8ab4f8 links, the recognisable toolbar.
 * This is a deliberate aesthetic jump from the surrounding noir game
 * because the point of the scene is "this looks like your real inbox."
 */
export function EmailMockup({
    email,
    toolbarChoices,
    onTrap,
    onChoice,
}: {
    email: EmailMock;
    /** Choices whose `location` is a toolbar slot. */
    toolbarChoices?: Choice[];
    onTrap?: (target: SceneId) => void;
    onChoice?: (c: Choice) => void;
}) {
    const senderName = email.fromName ?? email.from;
    const initial = senderName.charAt(0).toUpperCase();
    const avatarHue = simpleHash(senderName) % 360;

    const hotspots = Object.fromEntries(
        (email.hotspots ?? []).map((h) => [h.target, h]),
    ) as Record<EmailHotspot["target"], EmailHotspot | undefined>;

    const [open, setOpen] = useState<Record<string, boolean>>({});
    const toggle = (target: string) =>
        setOpen((o) => ({ ...o, [target]: !o[target] }));

    const findChoice = (loc: Choice["location"]) =>
        toolbarChoices?.find((c) => c.location === loc);

    const report = findChoice("toolbar-report");
    const trash = findChoice("toolbar-delete");
    const archive = findChoice("toolbar-archive");

    return (
        <div
            className="rounded-lg overflow-hidden border border-[color:var(--gmail-border)] bg-[color:var(--gmail-bg)] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "var(--font-gmail)" }}
        >
            {/* Top toolbar. */}
            <div className="px-3 py-2 flex items-center gap-1 border-b border-[color:var(--gmail-border)] bg-[color:var(--gmail-toolbar)]">
                <ToolbarIcon title="Back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>
                </ToolbarIcon>
                <ToolbarDivider />
                <ToolbarIcon
                    title={archive?.label ?? "Archive"}
                    disabled={!archive}
                    onClick={archive && onChoice ? () => onChoice(archive) : undefined}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></svg>
                </ToolbarIcon>
                <ToolbarIcon
                    title={report?.label ?? "Report spam"}
                    highlight={!!report}
                    onClick={report && onChoice ? () => onChoice(report) : undefined}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 10h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>
                </ToolbarIcon>
                <ToolbarIcon
                    title={trash?.label ?? "Delete"}
                    onClick={trash && onChoice ? () => onChoice(trash) : undefined}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </ToolbarIcon>
                <ToolbarDivider />
                <ToolbarIcon title="Mark as unread">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </ToolbarIcon>
                <ToolbarIcon title="More">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </ToolbarIcon>
                <div className="flex-1"></div>
                <span
                    className="text-xs text-[color:var(--gmail-text-dim)] hidden sm:inline"
                    style={{ fontFamily: "var(--font-gmail)" }}
                >
                    1 of 127
                </span>
            </div>

            {/* Subject row. */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-4">
                <InspectableSubject
                    hotspot={hotspots.subject}
                    isOpen={!!open.subject}
                    onToggle={() => toggle("subject")}
                >
                    {email.subject}
                </InspectableSubject>
                <button
                    type="button"
                    title="Star"
                    className="shrink-0 text-[color:var(--gmail-text-dim)] hover:text-[color:var(--gmail-text)] transition-colors p-1"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
            </div>

            {/* Body label inside subject row: "Inbox" chip. */}
            <div className="px-5 pb-3">
                <span className="inline-block text-[14px] text-[color:var(--gmail-text-dim)] bg-[color:var(--gmail-panel)] border border-[color:var(--gmail-border)] rounded px-2 py-0.5">
                    Inbox
                </span>
            </div>

            {/* Sender row. */}
            <div className="px-5 pb-5 flex items-start gap-3 border-b border-[color:var(--gmail-border)]">
                <div
                    aria-hidden
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0"
                    style={{
                        backgroundImage: `linear-gradient(135deg, hsl(${avatarHue} 55% 45%), hsl(${(avatarHue + 30) % 360} 55% 35%))`,
                    }}
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                        <span className="text-sm font-medium text-[color:var(--gmail-text)]">
                            {email.fromName ?? email.from}
                        </span>
                        {email.fromName && (
                            <InspectableSender
                                hotspot={hotspots.from}
                                isOpen={!!open.from}
                                onToggle={() => toggle("from")}
                            >
                                &lt;{email.from}&gt;
                            </InspectableSender>
                        )}
                        <span className="ml-auto text-xs text-[color:var(--gmail-text-dim)]">
                            09:12 (0 min ago)
                        </span>
                    </div>
                    <div className="text-xs text-[color:var(--gmail-text-dim)] mt-0.5">
                        to me ▾
                    </div>
                    {/* Inspection hint, only when hotspots exist. */}
                    {(email.hotspots ?? []).length > 0 && (
                        <p className="mt-3 text-[14px] text-[color:var(--gmail-text-dim)] italic">
                            tip: click underlined parts to inspect without
                            clicking. the link in the body is a real link.
                        </p>
                    )}
                </div>
            </div>

            {/* Body + link. */}
            <div className="px-5 py-6">
                <div className="text-[18px] leading-[1.7] text-[color:var(--gmail-text)] whitespace-pre-line">
                    {renderBodyWithLink(email.body, email.link, hotspots.link, open.link, () => toggle("link"), onTrap)}
                </div>
            </div>

            {/* Reply row at bottom. */}
            <div className="px-5 pb-5 flex items-center gap-2">
                <div className="rounded-full border border-[color:var(--gmail-border)] px-4 py-2 flex items-center gap-2 text-sm text-[color:var(--gmail-text-dim)] hover:bg-[color:var(--gmail-hover)] cursor-default">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
                    Reply
                </div>
                <div className="rounded-full border border-[color:var(--gmail-border)] px-4 py-2 flex items-center gap-2 text-sm text-[color:var(--gmail-text-dim)] hover:bg-[color:var(--gmail-hover)] cursor-default">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"/></svg>
                    Forward
                </div>
            </div>
        </div>
    );
}

/** Subject, clickable hotspot if configured. */
function InspectableSubject({
    children,
    hotspot,
    isOpen,
    onToggle,
}: {
    children: React.ReactNode;
    hotspot?: EmailHotspot;
    isOpen: boolean;
    onToggle: () => void;
}) {
    if (!hotspot) {
        return (
            <h3
                className="text-[28px] leading-[1.25] text-[color:var(--gmail-text)] font-normal"
                style={{ fontFamily: "var(--font-gmail)" }}
            >
                {children}
            </h3>
        );
    }
    return (
        <div className="flex-1">
            <button
                type="button"
                onClick={onToggle}
                className={`text-left text-[28px] leading-[1.25] font-normal text-[color:var(--gmail-text)] border-b border-dotted ${
                    isOpen ? "border-[color:var(--color-amber)] text-[color:var(--color-amber)]" : "border-[color:var(--color-amber)]/60 hover:text-[color:var(--color-amber)]"
                } pb-0.5`}
                style={{ fontFamily: "var(--font-gmail)" }}
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
                        className="mt-2 text-[16px] leading-snug text-[color:var(--color-amber)] pl-3 border-l border-[color:var(--color-amber)] overflow-hidden"
                        style={{ fontFamily: "var(--font-gmail)" }}
                    >
                        {hotspot.caption}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function InspectableSender({
    children,
    hotspot,
    isOpen,
    onToggle,
}: {
    children: React.ReactNode;
    hotspot?: EmailHotspot;
    isOpen: boolean;
    onToggle: () => void;
}) {
    if (!hotspot) {
        return (
            <span className="text-xs text-[color:var(--gmail-text-dim)]">
                {children}
            </span>
        );
    }
    return (
        <>
            <button
                type="button"
                onClick={onToggle}
                className={`text-xs border-b border-dotted pb-0.5 transition-colors ${
                    isOpen
                        ? "border-[color:var(--color-amber)] text-[color:var(--color-amber)]"
                        : "border-[color:var(--color-amber)]/60 text-[color:var(--gmail-text-dim)] hover:text-[color:var(--color-amber)]"
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
                        className="w-full mt-2 text-[15px] leading-snug text-[color:var(--color-amber)] pl-3 border-l border-[color:var(--color-amber)] overflow-hidden"
                    >
                        {hotspot.caption}
                    </motion.p>
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * Render the email body and append the link at the bottom, styled as
 * a real Gmail link (blue, underlined, clickable). If the link is
 * trapped, clicking it fires onTrap; an eye-icon beside it opens the
 * red-flag caption without triggering the trap.
 */
function renderBodyWithLink(
    body: string,
    link: EmailMock["link"] | undefined,
    hotspot: EmailHotspot | undefined,
    isInspecting: boolean | undefined,
    toggleInspect: () => void,
    onTrap: ((id: SceneId) => void) | undefined,
) {
    return (
        <div className="flex flex-col gap-4">
            <div>{body}</div>
            {link && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (link.trapsTo && onTrap) onTrap(link.trapsTo);
                            }}
                            className="text-[color:var(--gmail-link)] underline underline-offset-2 hover:brightness-110 hover:text-white text-left text-[18px]"
                            style={{ fontFamily: "var(--font-gmail)" }}
                        >
                            {link.url}
                        </button>
                        {hotspot && (
                            <button
                                type="button"
                                onClick={toggleInspect}
                                title="Inspect link instead of clicking"
                                className={`h-6 w-6 flex items-center justify-center rounded border border-[color:var(--gmail-border)] ${
                                    isInspecting
                                        ? "text-[color:var(--color-amber)] border-[color:var(--color-amber)]"
                                        : "text-[color:var(--gmail-text-dim)] hover:text-[color:var(--color-amber)] hover:border-[color:var(--color-amber)]"
                                }`}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <AnimatePresence>
                        {isInspecting && hotspot && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="text-[15px] leading-snug text-[color:var(--color-amber)] pl-3 border-l border-[color:var(--color-amber)] overflow-hidden"
                                style={{ fontFamily: "var(--font-gmail)" }}
                            >
                                {hotspot.caption}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

/* ---------- Toolbar icon primitives ---------- */

function ToolbarIcon({
    children,
    title,
    onClick,
    highlight = false,
    disabled = false,
}: {
    children: React.ReactNode;
    title: string;
    onClick?: () => void;
    highlight?: boolean;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled || !onClick}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-full transition-colors ${
                disabled || !onClick
                    ? "text-[color:var(--gmail-text-dim)] opacity-40 cursor-default"
                    : highlight
                      ? "text-[color:var(--color-amber)] hover:bg-[color:var(--gmail-hover)]"
                      : "text-[color:var(--gmail-text-dim)] hover:bg-[color:var(--gmail-hover)] hover:text-[color:var(--gmail-text)]"
            }`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return (
        <span
            aria-hidden
            className="h-6 w-px bg-[color:var(--gmail-border)] mx-1"
        />
    );
}

function simpleHash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}
