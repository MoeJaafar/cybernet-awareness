import type { Scenario } from "@/lib/types";

/**
 * Scenario 2, Password fortress.
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
        "Password strength, length, randomness, and the real-world trade-off with memorability.",
    setup: "",
    startSceneId: "build",
    scenes: {
        "build": {
            type: "decision",
            id: "build",
            speaker: "password change required",
            prompt:
                "A website is asking you to change your password. Which of these would you actually pick?",
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
                "Your password was fewer than eight characters. The system accepted it, but a brute-force attacker cycles through every combination of that length in seconds. Your account was compromised before your coffee went cold. Length is the biggest factor in password strength, three or four random words would have taken decades to crack.",
            nextId: "debrief",
        },
        "outcome-common-pattern": {
            type: "outcome",
            id: "outcome-common-pattern",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "The words and numbers you used are on every attacker's dictionary list. They don't brute-force these, they try the lists first. Your password fell on the first pass. Next time, string together unrelated random words. 'Horse', 'rain', 'camera', 'thursday' side by side would take decades, because the attacker can't predict the combination.",
            nextId: "debrief",
        },
        "outcome-medium": {
            type: "outcome",
            id: "outcome-medium",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "Your password had some strength but wasn't long enough for a sustained offline attack. Real cracking rigs try billions of combinations per second. At your length, it falls within hours. The fix: make it longer. Every extra character multiplies the time an attacker needs. Three or four random words is the sweet spot, long enough to resist cracking, short enough to remember.",
            nextId: "debrief",
        },
        "outcome-fortress": {
            type: "outcome",
            id: "outcome-fortress",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "Your wall held. Fourteen or more characters made of random words creates an enormous search space. A brute-force attacker would need years or decades of GPU time. The best part: you can probably still remember it, because unrelated words form a mental image. That's the fortress, long, memorable, and unique.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Length plus randomness beats special characters. A few unrelated words strung together is both strong and memorable, that's the fortress.",
            lesson:
                "Short passwords with capital/number/symbol tricks look compliant but are guessed first. A passphrase of three or four unrelated words resists brute force and stays memorable. If you need truly random passwords, use a password manager so you only remember one.",
        },
    },
};
