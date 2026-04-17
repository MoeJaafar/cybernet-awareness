/**
 * Pre/post-test — 15 True/False statements with optional confidence.
 * 10 concept-aligned (2 per game scenario) + 5 general awareness
 * (untaught controls for contrast analysis).
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
            "A padlock icon in the browser address bar guarantees the website is legitimate.",
        answer: false,
    },
    {
        id: "phish-2",
        concept: "phishing",
        statement:
            "Phishing emails can come from addresses that look nearly identical to a real company's domain.",
        answer: true,
    },

    // ── Password (2) ──────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        statement:
            "A long passphrase of random common words is harder to crack than a short password with special characters.",
        answer: true,
    },
    {
        id: "pw-2",
        concept: "password",
        statement:
            "A password that meets your company's complexity policy is always secure enough.",
        answer: false,
    },

    // ── Vishing (2) ───────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        statement:
            "If a caller already knows your personal details, they are most likely who they claim to be.",
        answer: false,
    },
    {
        id: "vish-2",
        concept: "vishing",
        statement:
            "Legitimate organisations may call you, but will never ask for your password over the phone.",
        answer: true,
    },

    // ── USB (2) ───────────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        statement:
            "A USB device can compromise your computer without you opening any files on it.",
        answer: true,
    },
    {
        id: "usb-2",
        concept: "usb",
        statement:
            "Plugging an unknown USB into a computer that isn't connected to the internet is a safe way to check its contents.",
        answer: false,
    },

    // ── Public Wi-Fi (2) ──────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        statement:
            "Using incognito mode on public Wi-Fi prevents other people on the network from seeing your traffic.",
        answer: false,
    },
    {
        id: "wifi-2",
        concept: "wifi",
        statement:
            "On public Wi-Fi, a VPN hides your traffic from other users on the same network.",
        answer: true,
    },

    // ── General awareness controls (5) ────────────────────────
    {
        id: "gen-1",
        concept: "general",
        statement:
            "Two-factor authentication makes your account completely immune to being compromised.",
        answer: false,
    },
    {
        id: "gen-2",
        concept: "general",
        statement:
            "Software updates often patch security vulnerabilities that attackers are already exploiting.",
        answer: true,
    },
    {
        id: "gen-3",
        concept: "general",
        statement:
            'Replying "unsubscribe" to a suspicious email is a safe way to stop receiving it.',
        answer: false,
    },
    {
        id: "gen-4",
        concept: "general",
        statement:
            "Opening a malicious email attachment can give an attacker full access to your computer.",
        answer: true,
    },
    {
        id: "gen-5",
        concept: "general",
        statement:
            "Antivirus software catches all types of malware before they can cause damage.",
        answer: false,
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
