/**
 * Pre/post-test — 10 scenario-based questions. The intuitive answer
 * is wrong. Options are kept SHORT and similar in length so the
 * correct one doesn't stand out by being more detailed.
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
            'A website shows a padlock and "https://". What does this guarantee?',
        options: [
            { label: "The site is legitimate and safe to use.", correct: false },
            { label: "Your connection is encrypted, but the site could still be fake.", correct: true },
            { label: "Your browser has verified the site as trustworthy.", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "An urgent email from your CEO asks you to wire funds. The address looks right. What's the most reliable check?",
        options: [
            { label: "Look for spelling and grammar mistakes in the email.", correct: false },
            { label: "Inspect the sender address closely for domain misspellings.", correct: false },
            { label: "Call the CEO on a number you already have, not one from the email.", correct: true },
        ],
    },
    {
        id: "pw-1",
        concept: "password",
        prompt:
            "Which password would take the longest to crack?",
        options: [
            { label: '"Tr0ub4d0r&3" — 11 characters, symbols and substitutions.', correct: false },
            { label: '"skyline toast bicycle river" — 26 characters, four plain words.', correct: true },
            { label: '"aX9$kL2!" — 8 characters, fully random.', correct: false },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            '"January2026!" meets your company\'s password policy. Is it secure?',
        options: [
            { label: "Yes, it satisfies every policy requirement.", correct: false },
            { label: "No, it follows a pattern cracking tools try first.", correct: true },
            { label: "Yes, 12 mixed characters is above average.", correct: false },
        ],
    },
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            "A caller reads your full name, address, and account number. Does this confirm they're legitimate?",
        options: [
            { label: "Yes, only your real provider would have those details.", correct: false },
            { label: "No, that information is widely available from breaches and public records.", correct: true },
            { label: "Probably, scammers wouldn't have that level of detail.", correct: false },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt:
            'A "tech support" caller reads your IP address to prove they\'re real. What does this prove?',
        options: [
            { label: "They can see your network, so they're likely genuine.", correct: false },
            { label: "Nothing, public IP addresses are trivial to look up.", correct: true },
            { label: "They have some access, but you should verify their employee ID.", correct: false },
        ],
    },
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            "You plug in a USB stick but don't open any files. Can it still infect your machine?",
        options: [
            { label: "No, malware needs you to open or run a file.", correct: false },
            { label: "Yes, some USB devices execute code the moment they're plugged in.", correct: true },
            { label: "No, antivirus would block anything before it runs.", correct: false },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            'A colleague wants to check a found USB stick on a spare laptop that\'s "not connected to anything." Is this safe?',
        options: [
            { label: "Yes, an isolated laptop can't spread anything.", correct: false },
            { label: "No, the payload runs locally regardless of network connection.", correct: true },
            { label: "Yes, personal files like photos can't carry malware.", correct: false },
        ],
    },
    {
        id: "wifi-1",
        concept: "wifi",
        prompt:
            "You're on a café's password-protected Wi-Fi. The password is on the wall. Is your traffic private from other customers?",
        options: [
            { label: "Yes, the password encrypts each person's connection separately.", correct: false },
            { label: "No, everyone using the same password shares the encryption key.", correct: true },
            { label: "Yes, each device gets its own encrypted channel.", correct: false },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "You open incognito mode before using airport Wi-Fi. What does this protect?",
        options: [
            { label: "It hides your browsing from others on the network.", correct: false },
            { label: "It only prevents your browser from saving local history.", correct: true },
            { label: "It gives roughly the same protection as a VPN.", correct: false },
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
