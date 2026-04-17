/**
 * Pre/post-test — 10 scenario-based questions where the intuitive
 * answer is WRONG. Each exploits a real misconception that unaware
 * people hold, so the pre-test catches genuine gaps and the
 * post-test measures whether the game shifted understanding.
 *
 * Design: wrong answers represent COMMON BELIEFS, not strawmen.
 * An unaware person should gravitate to the wrong option. An aware
 * person recognises why the surface signal is misleading.
 */

export interface KnowledgeQuestion {
    id: string;
    concept: string;
    prompt: string;
    options: { label: string; correct: boolean }[];
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
    // ── Phishing ──────────────────────────────────────────────
    {
        id: "phish-1",
        concept: "phishing",
        prompt:
            'A website shows a padlock icon and "https://" in the address bar. What does this guarantee?',
        options: [
            {
                label: "The website is legitimate and safe to enter your credentials.",
                correct: false,
            },
            {
                label: "Your connection is encrypted, but the site itself could still be a phishing page.",
                correct: true,
            },
            {
                label: "The website has been verified as trustworthy by your browser.",
                correct: false,
            },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "You receive an urgent email from your CEO asking you to wire funds immediately. The sender address looks correct at a glance. What's the MOST reliable way to verify it?",
        options: [
            {
                label: "Check the email for spelling or grammar mistakes.",
                correct: false,
            },
            {
                label: "Look carefully at the full sender address for subtle domain misspellings.",
                correct: false,
            },
            {
                label: "Call the CEO on a phone number you already have — not one from the email.",
                correct: true,
            },
        ],
    },

    // ── Password ──────────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        prompt:
            "Which password would take the LONGEST to crack?",
        options: [
            {
                label: '"Tr0ub4d0r&3" — 11 characters with symbols and number substitutions.',
                correct: false,
            },
            {
                label: '"skyline toast bicycle river" — 26 characters, four plain words.',
                correct: true,
            },
            {
                label: '"aX9$kL2!" — 8 characters, fully random.',
                correct: false,
            },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            'Your company\'s password policy requires uppercase, a number, and a symbol. A colleague sets "January2026!" and says it\'s compliant. Is it secure?',
        options: [
            {
                label: "Yes — it meets every requirement in the policy.",
                correct: false,
            },
            {
                label: "No — it follows a month-year-symbol pattern that cracking tools try within seconds.",
                correct: true,
            },
            {
                label: "Yes — 12 characters with mixed types is above average.",
                correct: false,
            },
        ],
    },

    // ── Vishing ───────────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            "A caller claiming to be from your internet provider reads your full name, address, and account number. Does this confirm they're legitimate?",
        options: [
            {
                label: "Yes — only your real provider would have those details.",
                correct: false,
            },
            {
                label: "No — personal details are widely available from data breaches and public records.",
                correct: true,
            },
            {
                label: "Probably — scammers wouldn't have that level of detail.",
                correct: false,
            },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt:
            'A "tech support" caller asks you to install remote-access software to "fix a virus." They read your IP address to prove they\'re real. What does this prove?',
        options: [
            {
                label: "They have access to your network, so they're likely genuine.",
                correct: false,
            },
            {
                label: "Nothing — your public IP address is trivial to look up.",
                correct: true,
            },
            {
                label: "They're probably real, but you should confirm their employee ID.",
                correct: false,
            },
        ],
    },

    // ── USB / Physical ────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            "You plug a USB stick into your computer but don't open any files on it. Can it still infect your machine?",
        options: [
            {
                label: "No — malware requires you to open or run an infected file.",
                correct: false,
            },
            {
                label: "Yes — some USB devices execute code automatically the moment they're plugged in.",
                correct: true,
            },
            {
                label: "No — your antivirus would block any threat before it could run.",
                correct: false,
            },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            'You find a USB stick labelled "Wedding Photos" in the office kitchen. A colleague suggests plugging it into a spare laptop that\'s "not connected to anything important." Is this safe?',
        options: [
            {
                label: "Yes — an isolated laptop can't spread infection to the network.",
                correct: false,
            },
            {
                label: "No — the payload captures data from that machine regardless of network connection, and the label is likely bait.",
                correct: true,
            },
            {
                label: "Yes — personal files like photos can't contain executable malware.",
                correct: false,
            },
        ],
    },

    // ── Public Wi-Fi ──────────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        prompt:
            "You're at a café using their official, password-protected Wi-Fi. The password is printed on the wall. Is your traffic private from other customers?",
        options: [
            {
                label: "Yes — the password encrypts your connection and keeps it private.",
                correct: false,
            },
            {
                label: "No — everyone using the same password shares the encryption key, so others can still intercept traffic.",
                correct: true,
            },
            {
                label: "Yes — each device gets its own encrypted channel once connected.",
                correct: false,
            },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            'You open an incognito / private browsing window before using airport Wi-Fi. What does this protect?',
        options: [
            {
                label: "It prevents other people on the network from seeing what you browse.",
                correct: false,
            },
            {
                label: "It only prevents your own browser from saving local history — the network can still see your traffic.",
                correct: true,
            },
            {
                label: "It provides roughly the same protection as a VPN.",
                correct: false,
            },
        ],
    },
];

export function shuffleQuestions(
    seed: "pre" | "post",
): KnowledgeQuestion[] {
    const copy = [...KNOWLEDGE_QUESTIONS];
    if (seed === "post") copy.reverse();
    return copy;
}
