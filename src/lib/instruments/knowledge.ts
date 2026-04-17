/**
 * Pre/post-test, 15 scenario-based MCQ with 4 options each.
 * 10 concept-aligned (2 per game scenario) + 5 general controls.
 *
 * Design rules:
 *   - All 4 options similar length, no structural tells
 *   - Each wrong option = a real misconception, not a strawman
 *   - No absolute qualifiers (always, never, completely, guarantees)
 *   - Scenario-based framing where possible
 *   - Same questions pre and post, order randomised
 *   - Correct-answer distribution spread across A/B/C/D (no "always pick C" tell)
 */

export interface KnowledgeQuestion {
    id: string;
    concept: string;
    prompt: string;
    options: { key: string; label: string; correct: boolean }[];
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
    // ── Phishing (2) ──────────────────────────────────────────
    {
        id: "phish-1",
        concept: "phishing",
        prompt:
            "You receive an email asking you to verify your account. The page it links to shows a padlock icon and https://. What should you consider?",
        options: [
            { key: "a", label: "The padlock confirms the site is legitimate, so it's safe to proceed.", correct: false },
            { key: "b", label: "The padlock means encrypted, but phishing sites use https too, so check the actual domain.", correct: true },
            { key: "c", label: "Padlocks only appear on sites your browser has previously verified as safe.", correct: false },
            { key: "d", label: "The email is safe if the padlock is green rather than grey.", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "You get an urgent message that looks like it's from a close family member, asking you to send money right away because of an emergency. The name and sender details look correct. What's the best way to verify it?",
        options: [
            { key: "a", label: "Call or message the person on a number you already have saved, not one from the message.", correct: true },
            { key: "b", label: "Look for spelling and grammar mistakes in the message.", correct: false },
            { key: "c", label: "Check whether the message came from their usual email or phone.", correct: false },
            { key: "d", label: "Reply to the message and ask if they really sent it.", correct: false },
        ],
    },

    // ── Password (2) ──────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        prompt:
            "You need a new password. Which of these would be hardest for an attacker to crack?",
        options: [
            { key: "a", label: '"Tr0ub4d0r&3" (11 characters, symbol substitutions)', correct: false },
            { key: "b", label: '"sunset piano bicycle" (20 characters, three plain words)', correct: true },
            { key: "c", label: '"aX9$kL2!mN" (10 characters, fully random)', correct: false },
            { key: "d", label: '"Jessica1987!" (12 characters, name + year + symbol)', correct: false },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            'A friend sets "March2026!" as their password and says the website accepted it, so it must be safe. How would you assess it?',
        options: [
            { key: "a", label: "If the website accepts it, it must meet the strength requirements.", correct: false },
            { key: "b", label: "The length and mix of letters, numbers, and a symbol make it reasonably secure.", correct: false },
            { key: "c", label: "Adding another symbol at the end would make it strong enough.", correct: false },
            { key: "d", label: "Month-and-year patterns are among the first combinations attackers try.", correct: true },
        ],
    },

    // ── Vishing (2) ───────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            "Your phone rings. The caller knows your full name, address, and the last four digits of your account. They ask you to verify your password for security. What's the best response?",
        options: [
            { key: "a", label: "They know enough details that they're most likely legitimate.", correct: false },
            { key: "b", label: "Ask them for their employee ID and continue if they provide one.", correct: false },
            { key: "c", label: "Hang up and call the organisation back on a number from their official website.", correct: true },
            { key: "d", label: "Give only part of your password as a compromise.", correct: false },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt:
            'A caller says they\'re from Microsoft support and reads back details like your operating system and that "we\'ve detected errors on your computer." What does this actually demonstrate?',
        options: [
            { key: "a", label: "They must have access to your device, so they're likely genuine.", correct: false },
            { key: "b", label: "Details like your operating system can be guessed or gathered without seeing your computer, so this proves nothing.", correct: true },
            { key: "c", label: "Your computer has been compromised and they detected the issue.", correct: false },
            { key: "d", label: "Only Microsoft could detect errors from afar, so they're credible.", correct: false },
        ],
    },

    // ── USB (2) ───────────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            'You plug a USB stick into your laptop but don\'t open any files. A friend tells you "you\'re fine as long as you didn\'t open anything." Is that right?',
        options: [
            { key: "a", label: "Yes, a harmful program needs you to double-click a file before it can do anything.", correct: false },
            { key: "b", label: "Yes, the computer scans USB sticks the moment they're plugged in and blocks anything bad.", correct: false },
            { key: "c", label: "Yes, as long as autorun is switched off in your settings, nothing can happen on its own.", correct: false },
            { key: "d", label: "No, some USB devices can launch a hidden program the moment they're plugged in, before you open anything.", correct: true },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            'You find a USB stick labelled "Holiday photos 2026" in a shared area. A friend suggests checking it on an old spare laptop that\'s not connected to the internet. Is this a safe approach?',
        options: [
            { key: "a", label: "No, any hidden program on the stick would still run on that laptop whether it's online or not, and the label is likely bait.", correct: true },
            { key: "b", label: "Yes, without an internet connection anything harmful is trapped on that one machine.", correct: false },
            { key: "c", label: "Yes, a spare laptop has nothing valuable on it, so there's no real risk.", correct: false },
            { key: "d", label: "Yes, as long as the antivirus on the spare laptop is up to date.", correct: false },
        ],
    },

    // ── Public Wi-Fi (2) ──────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        prompt:
            "You're at a café and open an incognito window before connecting to the public Wi-Fi. What does incognito mode protect in this situation?",
        options: [
            { key: "a", label: "It encrypts your traffic so other people on the network can't see it.", correct: false },
            { key: "b", label: "It hides your browsing from the Wi-Fi provider and other users.", correct: false },
            { key: "c", label: "It only prevents your browser from saving local history; the network still sees your traffic.", correct: true },
            { key: "d", label: "It provides similar protection to a VPN for casual browsing.", correct: false },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "You're in a café and want to log into your bank account. You can connect to the café's password-protected Wi-Fi, or use your phone's mobile data. Which is more secure, and why?",
        options: [
            { key: "a", label: "The café Wi-Fi, because the password gives each person their own protected channel.", correct: false },
            { key: "b", label: "Either is fine, because banking sites are encrypted no matter which network you use.", correct: false },
            { key: "c", label: "The café Wi-Fi, because a familiar café is safer than a mobile connection.", correct: false },
            { key: "d", label: "Your phone's mobile data, because the connection is between your phone and your mobile network, not shared with other people in the café.", correct: true },
        ],
    },

    // ── General awareness controls (5) ────────────────────────
    {
        id: "gen-1",
        concept: "general",
        prompt:
            "You have the extra verification step turned on for your email (a code sent to your phone in addition to your password). A fake website captures both your password and the code in real time as you type them. What happens?",
        options: [
            { key: "a", label: "The attacker can use the code before it expires and get into your account.", correct: true },
            { key: "b", label: "The attacker is blocked because the code only works from your own device.", correct: false },
            { key: "c", label: "Your email provider spots the unusual login and blocks it automatically.", correct: false },
            { key: "d", label: "The code is tied to your browser, so it won't work for the attacker.", correct: false },
        ],
    },
    {
        id: "gen-2",
        concept: "general",
        prompt:
            'A software update pops up labelled "important security update." You\'re in the middle of something. What\'s the real risk of putting it off for a few days?',
        options: [
            { key: "a", label: "Minimal, because security updates mostly fix rare problems that never come up in real life.", correct: false },
            { key: "b", label: "The update likely fixes a flaw that attackers are already using to get into devices.", correct: true },
            { key: "c", label: "Low risk, because your antivirus covers the gap until you update.", correct: false },
            { key: "d", label: "No risk as long as you avoid suspicious websites until you update.", correct: false },
        ],
    },
    {
        id: "gen-3",
        concept: "general",
        prompt:
            'You keep getting spam from the same sender. You reply "STOP" without clicking any links. What\'s the likely result?',
        options: [
            { key: "a", label: "The sender removes you from their list within a few days.", correct: false },
            { key: "b", label: "Nothing changes, because the reply goes to an unmonitored inbox.", correct: false },
            { key: "c", label: "You've confirmed your address is active, which may increase the spam you receive.", correct: true },
            { key: "d", label: "Your email provider flags the thread and blocks future messages from that sender.", correct: false },
        ],
    },
    {
        id: "gen-4",
        concept: "general",
        prompt:
            "You download a file and your antivirus doesn't flag it. How confident should you be that it's safe?",
        options: [
            { key: "a", label: "Very, because if the antivirus cleared it the file has been thoroughly scanned.", correct: false },
            { key: "b", label: "It depends on whether the file came from a source you already trust.", correct: false },
            { key: "c", label: "If the download site uses HTTPS, the file is almost certainly clean.", correct: false },
            { key: "d", label: "Somewhat, because antivirus catches known threats but can miss new or targeted ones.", correct: true },
        ],
    },
    {
        id: "gen-5",
        concept: "general",
        prompt:
            "You post on social media about starting a new job, your team name, and a photo of your office badge (blurred). How could an attacker use this?",
        options: [
            { key: "a", label: "They could use the details to craft a convincing phishing email pretending to be from your company.", correct: true },
            { key: "b", label: "They couldn't, because the badge is blurred and the post doesn't contain passwords.", correct: false },
            { key: "c", label: "Only if your profile is public; a private account prevents this.", correct: false },
            { key: "d", label: "Social media platforms scan for sensitive info and would block the post.", correct: false },
        ],
    },
];

export const CONFIDENCE_LABELS = ["Not sure", "Sure"] as const;

export function shuffleQuestions(
    seed: "pre" | "post",
): KnowledgeQuestion[] {
    const copy = [...KNOWLEDGE_QUESTIONS];
    if (seed === "post") copy.reverse();
    return copy;
}
