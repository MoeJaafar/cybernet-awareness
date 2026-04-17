/**
 * Pre-test and post-test knowledge questions. 10 questions, 2 per
 * scenario concept. Same questions in both tests — the post-test
 * shuffles the order to reduce position-memory effects.
 *
 * Each question has a stable `id` so pre/post answers can be paired
 * per-participant for delta analysis.
 */

export interface KnowledgeQuestion {
    id: string;
    concept: string;
    prompt: string;
    options: { label: string; correct: boolean }[];
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
    {
        id: "phish-1",
        concept: "phishing",
        prompt:
            "What is the most reliable indicator of a phishing email before you even open it?",
        options: [
            { label: "Urgent language in the subject line.", correct: false },
            {
                label: "A sender domain that doesn't match the organisation it claims to be from.",
                correct: true,
            },
            { label: "The email was sent outside business hours.", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "You receive a suspicious email at work. Which action best protects your organisation?",
        options: [
            { label: "Delete it and move on.", correct: false },
            {
                label: "Report it to IT so they can block the campaign for everyone.",
                correct: true,
            },
            { label: "Forward it to colleagues to warn them.", correct: false },
        ],
    },
    {
        id: "pw-1",
        concept: "password",
        prompt: "Which type of password is hardest for attackers to crack?",
        options: [
            {
                label: "A short password with uppercase, numbers, and symbols.",
                correct: false,
            },
            {
                label: "A long passphrase of random, unrelated words.",
                correct: true,
            },
            {
                label: "Your name with numbers and symbols appended.",
                correct: false,
            },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            "Why do attackers try dictionary lists before brute force?",
        options: [
            { label: "Dictionary attacks are cheaper to run.", correct: false },
            {
                label: "Most people use common words and patterns that appear in those lists.",
                correct: true,
            },
            {
                label: "Brute force doesn't work on modern systems.",
                correct: false,
            },
        ],
    },
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            "A caller claims to be from Microsoft and asks for your password to fix an issue. What should you do?",
        options: [
            { label: "Give it — they said they're from Microsoft.", correct: false },
            {
                label: "Hang up and call the official number from Microsoft's website yourself.",
                correct: true,
            },
            { label: "Ask them to send you an email instead.", correct: false },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt: "What makes vishing (voice phishing) effective?",
        options: [
            {
                label: "The attacker has deep technical knowledge of your systems.",
                correct: false,
            },
            {
                label: "The caller manufactures urgency and authority in real time.",
                correct: true,
            },
            { label: "Phone lines are not encrypted.", correct: false },
        ],
    },
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            'You find a USB stick labelled "Salaries 2026" in the office car park. What is the safest action?',
        options: [
            { label: "Plug it into an isolated laptop to check.", correct: false },
            {
                label: "Hand it to IT security without plugging it in anywhere.",
                correct: true,
            },
            { label: "Put it in the lost-and-found box.", correct: false },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt: "Why do dropped-USB attacks still work decades after they were first documented?",
        options: [
            { label: "USB ports cannot be physically secured.", correct: false },
            {
                label: "Curiosity leads people to plug in unknown drives.",
                correct: true,
            },
            {
                label: "Antivirus software cannot detect USB-based malware.",
                correct: false,
            },
        ],
    },
    {
        id: "wifi-1",
        concept: "wifi",
        prompt: 'What is an "evil twin" attack?',
        options: [
            { label: "A virus that clones your device.", correct: false },
            {
                label: "A fake Wi-Fi access point that mimics a legitimate network name.",
                correct: true,
            },
            {
                label: "Two attackers working together on the same network.",
                correct: false,
            },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "Which is the safest way to send confidential work documents while away from the office?",
        options: [
            {
                label: "Use the venue's official Wi-Fi with a VPN.",
                correct: false,
            },
            {
                label: "Tether from your phone's mobile data.",
                correct: true,
            },
            {
                label: "Connect to any open Wi-Fi that has full signal strength.",
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
