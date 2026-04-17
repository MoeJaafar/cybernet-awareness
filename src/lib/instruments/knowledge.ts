/**
 * Pre/post-test, 10 scenario-based MCQ with 4 options each.
 * Two items per scenario topic (phishing, password, vishing, USB, Wi-Fi).
 *
 * Design rules:
 *   - All 4 options similar length, no structural tells
 *   - Each wrong option = a plausible everyday choice, not a strawman
 *   - No absolute qualifiers (always, never, completely, guarantees)
 *   - "What do you do?" intention framing where it reads naturally,
 *     evaluative framing otherwise
 *   - Correct-answer distribution spread across A/B/C/D: a=3, b=3, c=2, d=2
 *   - Same items pre and post, order reversed at post-test
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
            "You're in the middle of work when an email from \"IT Helpdesk\" says your account password expires in two hours and links to a reset page. The sender name and the logo look right. What do you do?",
        options: [
            { key: "a", label: "Open a new browser tab, go to the company login page directly, and reset it from there.", correct: true },
            { key: "b", label: "Click the link in the email and reset through that page.", correct: false },
            { key: "c", label: "Reply to the email to ask if it's genuine.", correct: false },
            { key: "d", label: "Forward it to a colleague to see if they received one too.", correct: false },
        ],
    },
    {
        id: "phish-2",
        concept: "phishing",
        prompt:
            "You get an urgent message that looks like it's from a close family member, saying they're stranded and need you to send money right away. The name and photo are familiar. What do you do?",
        options: [
            { key: "a", label: "Send a smaller amount first to check it's really them.", correct: false },
            { key: "b", label: "Reply on the same app to ask if they really sent it.", correct: false },
            { key: "c", label: "Call or message them on a number you already have saved before doing anything.", correct: true },
            { key: "d", label: "Send the money; they can pay you back later.", correct: false },
        ],
    },

    // ── Password (2) ──────────────────────────────────────────
    {
        id: "pw-1",
        concept: "password",
        prompt:
            "You need a new password for an account you use every day. Which would you choose?",
        options: [
            { key: "a", label: "Tr0ub4d0r&3, because it's a familiar word with substitutions and a symbol.", correct: false },
            { key: "b", label: "sunset-piano-bicycle, because three unrelated words give length without being hard to remember.", correct: true },
            { key: "c", label: "Jessica1987!, because a personal name and year are easy to recall.", correct: false },
            { key: "d", label: "aX9$kL2!, because a short fully-random string feels secure.", correct: false },
        ],
    },
    {
        id: "pw-2",
        concept: "password",
        prompt:
            "A friend tells you her password is March2026!. She says it's easy to remember and the site accepted it, so it must be fine. What do you think?",
        options: [
            { key: "a", label: "If the site accepted it, it probably meets the strength rules.", correct: false },
            { key: "b", label: "The mix of letters, a number, and a symbol makes it reasonably secure.", correct: false },
            { key: "c", label: "Adding another symbol at the end would make it strong enough.", correct: false },
            { key: "d", label: "Month-and-year patterns are among the first combinations attackers try.", correct: true },
        ],
    },

    // ── Vishing (2) ───────────────────────────────────────────
    {
        id: "vish-1",
        concept: "vishing",
        prompt:
            "Your phone rings. The caller knows your full name, address, and the last four digits of your bank card. They say they're from your bank's fraud team and ask you to confirm your online-banking password \"for security.\" What do you do?",
        options: [
            { key: "a", label: "Give it to them; they clearly know who you are.", correct: false },
            { key: "b", label: "Ask them to prove it by telling you your current balance first.", correct: false },
            { key: "c", label: "Tell them you'll call the bank back on the number printed on your card.", correct: true },
            { key: "d", label: "Give a slightly wrong version of the password to see how they react.", correct: false },
        ],
    },
    {
        id: "vish-2",
        concept: "vishing",
        prompt:
            "A caller says he's from Microsoft Support, reads your operating system back to you, and claims \"we've detected errors on your computer.\" What do you do?",
        options: [
            { key: "a", label: "Hang up — Microsoft doesn't cold-call users about errors.", correct: true },
            { key: "b", label: "Let him connect remotely; the errors could be serious.", correct: false },
            { key: "c", label: "Ask which department he's from and call Microsoft back to verify.", correct: false },
            { key: "d", label: "Tell him you're not the account owner and end the call.", correct: false },
        ],
    },

    // ── USB (2) ───────────────────────────────────────────────
    {
        id: "usb-1",
        concept: "usb",
        prompt:
            "You find a USB stick on your desk labelled \"HR — Bonuses\" with no note. What do you do?",
        options: [
            { key: "a", label: "Plug it in to find out whose it is.", correct: false },
            { key: "b", label: "Hand it to IT with a short note about where you found it.", correct: true },
            { key: "c", label: "Leave it on a colleague's desk in case it's theirs.", correct: false },
            { key: "d", label: "Take it home and check it on your personal laptop first.", correct: false },
        ],
    },
    {
        id: "usb-2",
        concept: "usb",
        prompt:
            "A colleague finds a labelled USB stick in the car park and wants to check it on a spare laptop that isn't connected to the internet. What do you think?",
        options: [
            { key: "a", label: "Fine — being offline means nothing bad can happen.", correct: false },
            { key: "b", label: "Fine as long as the spare laptop has antivirus up to date.", correct: false },
            { key: "c", label: "Fine as long as he only looks at the file list without opening anything.", correct: false },
            { key: "d", label: "Any hidden program on the stick could still run on that laptop, online or not.", correct: true },
        ],
    },

    // ── Public Wi-Fi (2) ──────────────────────────────────────
    {
        id: "wifi-1",
        concept: "wifi",
        prompt:
            "You open an incognito window before connecting to a café's Wi-Fi, because you want your browsing to stay private. What does incognito actually do for you here?",
        options: [
            { key: "a", label: "It encrypts your traffic so other people on the Wi-Fi can't read it.", correct: false },
            { key: "b", label: "It only stops your browser saving your history; the network still sees your traffic.", correct: true },
            { key: "c", label: "It hides your browsing from the café's Wi-Fi provider.", correct: false },
            { key: "d", label: "It gives you similar protection to a VPN for casual browsing.", correct: false },
        ],
    },
    {
        id: "wifi-2",
        concept: "wifi",
        prompt:
            "You're in a café and want to log into your bank account. You can use the café's password-protected Wi-Fi, or tether to your phone's mobile data. Which is safer, and why?",
        options: [
            { key: "a", label: "Mobile data — the connection is between your phone and your mobile network, not shared with other café users.", correct: true },
            { key: "b", label: "The café's Wi-Fi — the password gives each person their own protected channel.", correct: false },
            { key: "c", label: "Either is fine — banking sites are encrypted regardless of the network.", correct: false },
            { key: "d", label: "The café's Wi-Fi — a familiar café is safer than a mobile connection.", correct: false },
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
