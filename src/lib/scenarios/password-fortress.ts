import type { Scenario } from "@/lib/types";

/**
 * Scenario 2 — Password fortress.
 *
 * Framing: IT has forced a password change. The player picks one of
 * four options, each representing a different trade-off between
 * memorability and strength. The outcome simulates an attacker's
 * attempts to crack the chosen password, and the debrief names the
 * principle the choice reveals.
 *
 * Options cover the real decision space most users face:
 *   A - reuse of the current password        (weak, memorable, reused)
 *   B - current password + a small tweak     (weak, memorable, predictable)
 *   C - three unrelated words joined         (strong, memorable, unique)
 *   D - long random string                   (very strong, unmemorable)
 *
 * The professor-approved learning goal is "strong defences through
 * password construction and managing trade-offs" — option C is the
 * best in practice; D is strong but has a hidden failure mode
 * (written down / reused across sites because nobody memorises it).
 */
export const passwordFortress: Scenario = {
    id: "password-fortress",
    title: "Your password is expiring",
    concept:
        "Password strength — length, randomness, and the real-world trade-off with memorability.",
    setup: "", // unused; experience jumps straight in
    startSceneId: "pick",
    scenes: {
        "pick": {
            type: "decision",
            id: "pick",
            speaker: "your password expires today",
            prompt:
                "IT is forcing a reset. Pick a new password from the four options below. Hover an option to see the actual password.",
            choices: [],
            passwordForm: {
                header:
                    "Your password will expire in 2 hours. Set a new one to continue working.",
                caption:
                    "Your new password must be at least 8 characters and different from the previous one.",
                options: [
                    {
                        value: "Password1!",
                        label: "",
                        strength: 1,
                        nextId: "outcome-cracked-instantly",
                    },
                    {
                        value: "Summer25!",
                        label: "",
                        strength: 2,
                        nextId: "outcome-cracked-minutes",
                    },
                    {
                        value: "horseraincamerathursday",
                        label: "",
                        strength: 5,
                        nextId: "outcome-strong-memorable",
                    },
                    {
                        value: "xK9#mQ2$pL!7",
                        label: "",
                        strength: 5,
                        nextId: "outcome-strong-unmemorable",
                    },
                ],
            },
        },

        "outcome-cracked-instantly": {
            type: "outcome",
            id: "outcome-cracked-instantly",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You chose Password1! — one of the top ten most commonly used passwords in the world. Three weeks later a breach dumps your company's password database onto a forum. An attacker runs a list of common passwords against the dump. Yours falls on the first pass. They're in your mailbox within a minute. A better choice would have been horseraincamerathursday — four random words, twenty-three characters long, easy to remember but almost impossible to guess.",
            nextId: "debrief",
        },
        "outcome-cracked-minutes": {
            type: "outcome",
            id: "outcome-cracked-minutes",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You chose Summer25! — a season, a year, and an exclamation mark. Cracking tools try this pattern first: capitalised word, two digits, one symbol. Eight million variations in an hour. Yours falls in three minutes. It felt different from your last password but followed the exact same shape. A passphrase like horseraincamerathursday would have been just as easy to remember and dramatically harder to crack.",
            nextId: "debrief",
        },
        "outcome-strong-memorable": {
            type: "outcome",
            id: "outcome-strong-memorable",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You chose horseraincamerathursday — twenty-three characters of lowercase English words. A brute-force attacker would need decades of GPU time to crack this. A dictionary attacker would need to try every four-word combination in the language — that's an absurd search space. And you can still remember it by picturing a horse in the rain photographing a calendar. This is the right answer. Length and memorability, not symbols and tricks.",
            nextId: "debrief",
        },
        "outcome-strong-unmemorable": {
            type: "outcome",
            id: "outcome-strong-unmemorable",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You chose xK9#mQ2$pL!7 — mathematically very strong. But a week later you can't remember it. You write it on a sticky note under your keyboard. Two months later you reuse it on a shopping site that gets breached. The attacker tries the leaked password on your work account. What started strong ended weak because you couldn't live with it. A passphrase like horseraincamerathursday would have given you the same strength without the sticky note.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Length plus randomness beats special characters. Memorability matters as much as strength — because what you can't remember, you reuse or write down.",
            lesson:
                "A passphrase of three or four unrelated words is long enough to resist brute force and short enough for humans to remember. Short passwords with Capital/number/symbol tricks look compliant but are guessed first by real attackers. If you need truly random passwords, use a password manager so you only have to remember one.",
            nextId: "quiz",
        },
        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "Which matters more for resisting a real-world password attack?",
            options: [
                {
                    label:
                        "Having a capital letter, a number, and a special character.",
                    correct: false,
                    feedback:
                        "These policies make the password FEEL strong, but attackers account for them. Cracking tools try capitalised words with a digit and a symbol first — that's the most common human pattern.",
                },
                {
                    label:
                        "Length — more characters of any kind, especially if the password is words you can remember.",
                    correct: true,
                    feedback:
                        "Right. Each extra character roughly multiplies the search space. Long passphrases of common words outperform short passwords with tricks, and they don't get written on sticky notes.",
                },
                {
                    label:
                        "Replacing letters with look-alike symbols (p@ssw0rd).",
                    correct: false,
                    feedback:
                        "This is the oldest attacker-known substitution pattern. Cracking tools try it automatically as part of every dictionary pass.",
                },
            ],
            nextId: "done",
        },
    },
};
