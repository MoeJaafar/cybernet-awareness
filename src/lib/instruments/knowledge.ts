/**
 * Pre/post-test — 15 True/False statements with optional confidence.
 * 10 concept-aligned + 5 general controls.
 *
 * No absolute qualifiers ("always," "never," "completely,"
 * "guarantees") — those telegraph the answer. Uses soft qualifiers
 * ("reliable," "reasonable," "meaningful") and action-based
 * scenarios that sound plausible either way.
 */

export interface KnowledgeStatement {
    id: string;
    concept: string;
    statement: string;
    answer: boolean;
}

export const KNOWLEDGE_STATEMENTS: KnowledgeStatement[] = [
    // ── Phishing (2) ──────────────────────────────────────────
    {
        id: "phish-1",
        concept: "phishing",
        statement:
            "Checking for a padlock icon in the address bar is a reliable way to tell if a website is legitimate.",
        answer: false,
    },
    {
        id: "phish-2",
        concept: "phishing",
        statement:
            "An email that contains your full name and company details is unlikely to be a phishing attempt.",
        answer: false,
    },

    // ── Password (2) ──────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        statement:
            "Four random common words typed together make a stronger password than a shorter mix of symbols and numbers.",
        answer: true,
    },
    {
        id: "pw-2",
        concept: "password",
        statement:
            "A password that meets your company's complexity requirements is strong enough to resist a targeted attack.",
        answer: false,
    },

    // ── Vishing (2) ───────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        statement:
            "If a caller can confirm your account number and address, it's reasonable to trust their identity.",
        answer: false,
    },
    {
        id: "vish-2",
        concept: "vishing",
        statement:
            "A real bank may ask you to confirm your name or date of birth over the phone, but should not ask for your password.",
        answer: true,
    },

    // ── USB (2) ───────────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        statement:
            "A USB device can run code on your computer the moment it's plugged in, without you opening any files.",
        answer: true,
    },
    {
        id: "usb-2",
        concept: "usb",
        statement:
            "Checking an unknown USB on a spare computer that isn't on the network is a reasonable precaution.",
        answer: false,
    },

    // ── Public Wi-Fi (2) ──────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        statement:
            "Switching to incognito mode before using public Wi-Fi adds meaningful protection to your browsing.",
        answer: false,
    },
    {
        id: "wifi-2",
        concept: "wifi",
        statement:
            "Connecting your laptop to your phone's mobile data instead of café Wi-Fi keeps your traffic off the local network.",
        answer: true,
    },

    // ── General awareness controls (5) ────────────────────────
    {
        id: "gen-1",
        concept: "general",
        statement:
            "Two-factor authentication stops an attacker from accessing your account even if they have your password.",
        answer: false,
    },
    {
        id: "gen-2",
        concept: "general",
        statement:
            "Installing software updates promptly is one of the most effective security practices available.",
        answer: true,
    },
    {
        id: "gen-3",
        concept: "general",
        statement:
            "Replying to a spam email to ask them to stop is harmless as long as you don't click any links.",
        answer: false,
    },
    {
        id: "gen-4",
        concept: "general",
        statement:
            "If your antivirus doesn't flag a downloaded file, it's safe to open.",
        answer: false,
    },
    {
        id: "gen-5",
        concept: "general",
        statement:
            "Information you post publicly on social media can be used to make phishing attacks against you more convincing.",
        answer: true,
    },
];

export const CONFIDENCE_LABELS = ["Not sure", "Sure"] as const;

export function shuffleStatements(
    seed: "pre" | "post",
): KnowledgeStatement[] {
    const copy = [...KNOWLEDGE_STATEMENTS];
    if (seed === "post") copy.reverse();
    return copy;
}
