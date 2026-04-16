import type { Scenario } from "@/lib/types";

/**
 * Scenario 2 — Password fortress.
 *
 * The player BUILDS a password from ingredient bricks, then sees how
 * an attacker fares against it. The "fortress" metaphor is literal:
 * a visual wall grows as the password lengthens; the outcome reveals
 * whether the wall held.
 *
 * Four outcome tiers mapped by evaluatePassword() in PasswordBuilder:
 *   too-short     < 8 chars → instant fail
 *   common-pattern  all-common-word bricks → dictionary crack
 *   medium         8-13 chars, not all common → cracked in hours
 *   fortress       14+ chars with random words → holds
 */
export const passwordFortress: Scenario = {
    id: "password-fortress",
    title: "Your password is expiring",
    concept:
        "Password strength — length, randomness, and the real-world trade-off with memorability.",
    setup: "",
    startSceneId: "build",
    scenes: {
        "build": {
            type: "decision",
            id: "build",
            speaker: "your password expires today",
            prompt:
                "IT is forcing a reset. Use the bricks below to build a new password. Each brick adds to the wall.",
            choices: [],
            // The PasswordBuilder component is wired in ScenarioRunner
            // when the scene id matches. evaluatePassword() maps the
            // built password to one of the outcome scenes below.
        },

        "outcome-too-short": {
            type: "outcome",
            id: "outcome-too-short",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "Your password was fewer than eight characters. The system accepted it but a brute-force attacker cycles through every possible combination of that length in seconds. Your account was compromised before your coffee went cold. Try building a longer wall — pick more bricks, especially from the random-words category. Length is the single biggest factor in password strength.",
            nextId: "debrief",
        },
        "outcome-common-pattern": {
            type: "outcome",
            id: "outcome-common-pattern",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "Every brick you used was a common word or number. Attackers don't brute-force these — they try dictionary lists first. Your password fell on the first pass. Next time, mix in random words that have no connection to each other. The words 'horse', 'rain', 'camera', 'thursday' strung together would take decades to crack because the attacker can't predict the combination.",
            nextId: "debrief",
        },
        "outcome-medium": {
            type: "outcome",
            id: "outcome-medium",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "Your password had some strength but wasn't long enough to survive a sustained offline attack. Real password-cracking rigs try billions of combinations per second. At your length, it falls within hours. The fix is simple: add more bricks. Every extra character multiplies the time an attacker needs. Three or four random words is the sweet spot — long enough to resist cracking, short enough to remember.",
            nextId: "debrief",
        },
        "outcome-fortress": {
            type: "outcome",
            id: "outcome-fortress",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "Your wall held. Fourteen or more characters built from random words creates an enormous search space. A brute-force attacker would need years or decades of GPU time. The best part: you can probably still remember it, because unrelated words form a mental image. That's the fortress — long, memorable, and unique.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Length plus randomness beats special characters. A few unrelated words strung together is both strong and memorable — that's the fortress.",
            lesson:
                "Short passwords with Capital/number/symbol tricks look compliant but are guessed first by real attackers. A passphrase of three or four unrelated words is long enough to resist brute force and easy enough to remember. If you need truly random passwords, use a password manager so you only remember one.",
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
                        "These policies make the password FEEL strong, but attackers account for them. Cracking tools try capitalised words with a digit and a symbol first.",
                },
                {
                    label:
                        "Length — more characters of any kind, especially random words you can remember.",
                    correct: true,
                    feedback:
                        "Right. Each extra character roughly multiplies the search space. Long passphrases of random words outperform short passwords with tricks.",
                },
                {
                    label:
                        "Replacing letters with look-alike symbols (p@ssw0rd).",
                    correct: false,
                    feedback:
                        "This is the oldest attacker-known substitution pattern. Cracking tools try it automatically.",
                },
            ],
            nextId: "done",
        },
    },
};
