/**
 * Pre/post-test , 15 scenario-based MCQ with 4 options each.
 * 10 concept-aligned (2 per game scenario) + 5 general controls.
 *
 * Design rules:
 *   - All 4 options similar length, no structural tells
 *   - Each wrong option = a real misconception, not a strawman
 *   - No absolute qualifiers (always, never, completely, guarantees)
 *   - Scenario-based framing where possible
 *   - Same questions pre and post, order randomized
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
            { key: "b", label: "The padlock means encrypted, but phishing sites use https too , check the actual domain.", correct: true },
            { key: "c", label: "Padlocks only appear on sites your browser has previously verified as safe.", correct: false },
            { key: "d", label: "The email is safe if the padlock is green rather than grey.", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "An urgent email from your CEO asks you to wire money to a new vendor. The sender address looks correct. What's the most effective way to verify it?",
        options: [
            { key: "a", label: "Look for spelling and grammar mistakes in the email body.", correct: false },
            { key: "b", label: "Check whether the email was sent from inside the company network.", correct: false },
            { key: "c", label: "Call the CEO on a phone number you already have, not one from the email.", correct: true },
            { key: "d", label: "Reply to the email and ask if they really sent it.", correct: false },
        ],
    },

    // ── Password (2) ──────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        prompt:
            'You need a new password. Which of these would be hardest for an attacker to crack?',
        options: [
            { key: "a", label: '"Tr0ub4d0r&3" , 11 characters with symbol substitutions.', correct: false },
            { key: "b", label: '"aX9$kL2!mN" , 10 characters, fully random.', correct: false },
            { key: "c", label: '"sunset piano bicycle frozen" , 27 characters, four plain words.', correct: true },
            { key: "d", label: '"Jessica1987!" , 12 characters, name plus year and symbol.', correct: false },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            'Your colleague sets "March2026!" as their password and says it meets company policy. How would you assess it?',
        options: [
            { key: "a", label: "It meets policy, so the system would block it if it were weak.", correct: false },
            { key: "b", label: "The length and mixed characters make it reasonably secure.", correct: false },
            { key: "c", label: "It's a seasonal pattern , cracking tools try month-year combinations early.", correct: true },
            { key: "d", label: "Adding another symbol at the end would make it strong enough.", correct: false },
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
            'A caller says they\'re from tech support and reads your IP address to prove they can "see your system." What does this demonstrate?',
        options: [
            { key: "a", label: "They have remote access to your device and are likely genuine.", correct: false },
            { key: "b", label: "Your public IP address is easy to look up , it proves nothing about their identity.", correct: true },
            { key: "c", label: "Your network has been compromised and they detected the issue.", correct: false },
            { key: "d", label: "Only your internet provider could know your IP, so they're credible.", correct: false },
        ],
    },

    // ── USB (2) ───────────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            'You plug a USB stick into your laptop but don\'t open any files. A colleague says "you\'re fine as long as you didn\'t run anything." Is that accurate?',
        options: [
            { key: "a", label: "Yes , malware needs you to double-click a file before it can execute.", correct: false },
            { key: "b", label: "Yes , the operating system scans USB devices on insert and blocks threats.", correct: false },
            { key: "c", label: "No , some USB devices execute code the moment they're plugged in, before any file is opened.", correct: true },
            { key: "d", label: "Yes , as long as autorun is disabled in your settings, nothing can execute.", correct: false },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            'You find a USB stick labelled "Bonuses 2026" near the printer. A colleague suggests checking it on a spare laptop that\'s offline. Is this a safe approach?',
        options: [
            { key: "a", label: "Yes , without a network connection, any malware is contained to that machine.", correct: false },
            { key: "b", label: "Yes , a spare laptop has nothing valuable on it, so there's no risk.", correct: false },
            { key: "c", label: "No , the payload runs locally regardless of network, and the label is likely bait.", correct: true },
            { key: "d", label: "Yes , as long as antivirus is up to date on the spare laptop.", correct: false },
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
            { key: "c", label: "It only prevents your browser from saving local history , the network still sees your traffic.", correct: true },
            { key: "d", label: "It provides similar protection to a VPN for casual browsing.", correct: false },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "You need to send a confidential report from a café. You can use the café's password-protected Wi-Fi or tether to your phone's 5G. Which is more secure, and why?",
        options: [
            { key: "a", label: "The café Wi-Fi , the password encrypts each user's connection separately.", correct: false },
            { key: "b", label: "Either is fine , HTTPS protects the file regardless of the network.", correct: false },
            { key: "c", label: "Your phone's 5G , it's encrypted to your carrier and not shared with the café.", correct: true },
            { key: "d", label: "The café Wi-Fi , a known network is safer than a cellular connection.", correct: false },
        ],
    },

    // ── General awareness controls (5) ────────────────────────
    {
        id: "gen-1",
        concept: "general",
        prompt:
            "You have two-factor authentication on your email. A phishing site captures your password and your 2FA code in real time. What happens?",
        options: [
            { key: "a", label: "The attacker is blocked , 2FA codes can only be used from your own device.", correct: false },
            { key: "b", label: "The attacker can use the code before it expires and access your account.", correct: true },
            { key: "c", label: "Your email provider detects the unusual login and blocks it automatically.", correct: false },
            { key: "d", label: "The code is tied to your browser session, so it won't work for the attacker.", correct: false },
        ],
    },
    {
        id: "gen-2",
        concept: "general",
        prompt:
            'A software update notification says "critical security patch." You\'re in the middle of a project. What\'s the practical risk of postponing it?',
        options: [
            { key: "a", label: "Minimal , security patches mostly address rare, theoretical vulnerabilities.", correct: false },
            { key: "b", label: "The patch likely fixes a known flaw that attackers may already be exploiting.", correct: true },
            { key: "c", label: "Low risk , your antivirus covers the gap until you get around to updating.", correct: false },
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
            { key: "b", label: "Nothing changes , the reply goes to an unmonitored inbox.", correct: false },
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
            { key: "a", label: "Very , if the antivirus cleared it, the file has been thoroughly scanned.", correct: false },
            { key: "b", label: "Somewhat , antivirus catches known threats but can miss new or targeted ones.", correct: true },
            { key: "c", label: "Completely , modern antivirus uses AI and catches virtually everything.", correct: false },
            { key: "d", label: "It depends only on whether the file came from a trusted website.", correct: false },
        ],
    },
    {
        id: "gen-5",
        concept: "general",
        prompt:
            "You post on social media about starting a new job, your team name, and a photo of your office badge (blurred). How could an attacker use this?",
        options: [
            { key: "a", label: "They can't , the badge is blurred and the post doesn't contain passwords.", correct: false },
            { key: "b", label: "They could use the details to craft a convincing phishing email pretending to be from your company.", correct: true },
            { key: "c", label: "Only if your profile is public , a private account prevents this.", correct: false },
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
