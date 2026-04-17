/**
 * Pre-test and post-test knowledge questions. 10 scenario-based
 * vignettes, 2 per concept. Each presents a realistic situation and
 * tests applied judgment — not terminology recall.
 *
 * Design principles:
 *   - Wrong answers are PLAUSIBLE (not strawmen)
 *   - Right answer requires the same judgment the game teaches
 *   - Questions don't duplicate the in-game quizzes (different
 *     scenarios, different framing)
 *   - Pre/post use the same questions; post-test reverses the order
 *     to reduce position-memory effects
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
            'You get an email from "IT Department" with the subject "Immediate action required: verify your account." The sender address is support@portal-verify-secure.com. Your company\'s domain is @acmecorp.com. What\'s your first move?',
        options: [
            {
                label: "Click the verification link — IT said it's urgent.",
                correct: false,
            },
            {
                label: "Check whether the sender domain matches your company's before doing anything else.",
                correct: true,
            },
            {
                label: "Forward it to your colleagues so they're aware too.",
                correct: false,
            },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "You spot a suspicious email and delete it. A colleague asks if you reported it to IT. You didn't. Does it matter?",
        options: [
            {
                label: "No — deleting it solved the problem for you.",
                correct: false,
            },
            {
                label: "Yes — the same email may be targeting others, and IT can block the whole campaign.",
                correct: true,
            },
            {
                label: "No — IT probably already knows about it.",
                correct: false,
            },
        ],
    },

    // ── Password ──────────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        prompt:
            'Your company requires a new password. You\'re choosing between "Tr0ub4d0r!" (10 characters, mixed symbols) and "correct horse battery staple" (28 characters, plain words). Which is stronger against a real attacker?',
        options: [
            {
                label: "Tr0ub4d0r! — it has symbols and number substitutions.",
                correct: false,
            },
            {
                label: "correct horse battery staple — length matters more than symbol tricks.",
                correct: true,
            },
            {
                label: "They're about equally strong.",
                correct: false,
            },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            'A colleague\'s password is "Summer2026!". They say it meets policy — uppercase, number, symbol. Is it safe?',
        options: [
            {
                label: "Yes — it meets all the complexity requirements.",
                correct: false,
            },
            {
                label: "No — it's a common seasonal pattern that cracking tools try first.",
                correct: true,
            },
            {
                label: "Yes — adding the exclamation mark makes it unpredictable.",
                correct: false,
            },
        ],
    },

    // ── Vishing ───────────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            'Your phone rings. The caller says they\'re from your bank\'s fraud department and need your account number to "freeze suspicious activity." They sound professional and urgent. What do you do?',
        options: [
            {
                label: "Give the account number — they're trying to protect you.",
                correct: false,
            },
            {
                label: "Hang up, find your bank's real phone number, and call them yourself.",
                correct: true,
            },
            {
                label: "Ask the caller to prove they're from the bank by telling you your balance.",
                correct: false,
            },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt:
            'A caller claiming to be tech support asks you to install remote-access software so they can "fix a virus." They read you your IP address as proof they\'re legitimate. What does this prove?',
        options: [
            {
                label: "They're genuine — they know your IP address.",
                correct: false,
            },
            {
                label: "Nothing — IP addresses are easy to look up and don't verify identity.",
                correct: true,
            },
            {
                label: "They're probably genuine but you should ask for their employee ID first.",
                correct: false,
            },
        ],
    },

    // ── USB / Physical ────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            'You find a USB stick in the office kitchen labelled "Wedding Photos." A colleague suggests plugging it into an old spare laptop that\'s "not connected to anything important." Is this safe?',
        options: [
            {
                label: "Yes — a disconnected laptop can't infect the network.",
                correct: false,
            },
            {
                label: "No — the payload runs the moment it's plugged in, regardless of what the laptop is connected to.",
                correct: true,
            },
            {
                label: "Yes — if it's just photos, it can't contain malware.",
                correct: false,
            },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            "Three USB sticks are found around your office building in one morning. What does this pattern suggest?",
        options: [
            {
                label: "Someone had a bad day and lost their collection.",
                correct: false,
            },
            {
                label: "It's likely a deliberate drop — someone is targeting your building.",
                correct: true,
            },
            {
                label: "It's a coincidence — USB sticks are commonly lost.",
                correct: false,
            },
        ],
    },

    // ── Public Wi-Fi ──────────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        prompt:
            'You\'re working at a café and need to send a report. You see two networks: "CoffeeShop_Free" (open, no password) and "CoffeeShop_Guest" (password on the wall). Which is safer?',
        options: [
            {
                label: "CoffeeShop_Free — it has the café's name so it must be theirs.",
                correct: false,
            },
            {
                label: "CoffeeShop_Guest is better, but both are still shared public networks you shouldn't trust with sensitive work.",
                correct: true,
            },
            {
                label: "Either is fine — HTTPS protects everything anyway.",
                correct: false,
            },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "Your phone has 5G signal but you notice free airport Wi-Fi is available. You need to send a confidential file. Which connection should you use?",
        options: [
            {
                label: "The airport Wi-Fi — it's faster and free.",
                correct: false,
            },
            {
                label: "Your phone's 5G — it's encrypted to your carrier and not shared with strangers.",
                correct: true,
            },
            {
                label: "Either — modern encryption makes both equally safe.",
                correct: false,
            },
        ],
    },
];

/** Deterministic shuffle based on a seed string (pre vs post). */
export function shuffleQuestions(
    seed: "pre" | "post",
): KnowledgeQuestion[] {
    const copy = [...KNOWLEDGE_QUESTIONS];
    if (seed === "post") copy.reverse();
    return copy;
}
