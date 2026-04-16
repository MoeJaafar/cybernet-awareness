import type { Scenario } from "@/lib/types";

/**
 * Scenario 3 — Vishing (voice phishing).
 *
 * A caller claiming to be from IT asks for the player's credentials
 * to "fix a VPN issue." The phone call plays out with subtitles and
 * optional AI-gen audio. After the caller's pitch, three choices:
 *   A — give the password (breach)
 *   B — ask the caller to verify their identity (contained)
 *   C — hang up and call IT back on the official number (contained)
 */
export const vishing: Scenario = {
    id: "vishing-helpdesk",
    title: "A call from IT support",
    concept:
        "Vishing — voice-based social engineering, pretexting, and why IT never asks for your password over the phone.",
    setup: "",
    startSceneId: "phone-ring",
    scenes: {
        "phone-ring": {
            type: "decision",
            id: "phone-ring",
            speaker: "3:42 PM",
            prompt: "Your phone is ringing.",
            choices: [],
            // PhoneCall component is activated by the `phoneCall` field
            // on the scene. ScenarioRunner detects this and renders the
            // PhoneCall mock instead of the standard decision UI.
        },

        "outcome-gave-password": {
            type: "outcome",
            id: "outcome-gave-password",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                'You gave your password. The caller thanked you warmly and hung up. Within ten minutes they logged into your VPN from an IP address in another country. By the time IT noticed the unusual login, two shared drives had been copied. Real IT support will never ask for your password over the phone. If someone calls and asks, hang up and call back on the official number from your company\'s website.',
            nextId: "debrief",
        },
        "outcome-asked-verify": {
            type: "outcome",
            id: "outcome-asked-verify",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                'You asked the caller for their employee ID and said you\'d call back through the official IT number. There was a pause. They stammered something about "system limitations" and hung up. Real IT can always verify their identity. Attackers can\'t — that\'s how you know.',
            nextId: "debrief",
        },
        "outcome-hung-up": {
            type: "outcome",
            id: "outcome-hung-up",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You hung up and called IT on the number listed on the company intranet. They confirmed no one from their team had called you. The attack was blocked because you didn't trust the incoming number. Outbound verification — calling back on a number you control — is the simplest defence against vishing.",
            nextId: "debrief",
        },
        "outcome-declined": {
            type: "outcome",
            id: "outcome-declined",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You declined the call. The attacker moved to the next name on their list. You're safe, but you also didn't flag the attempt to IT. Next time, let it ring or decline, then report the number to your security team so they can warn others.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "IT will never ask for your password over the phone. If someone does, hang up and call back on the official number you already know.",
            lesson:
                "Vishing works because the caller controls the narrative — they create urgency (your VPN will be disabled), authority (I'm from IT), and helpfulness (I'm here to fix it). Breaking out of the script — asking for verification, calling back on your own terms — collapses the pretence. The attacker has no answer for that.",
            nextId: "quiz",
        },
        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "Someone calls claiming to be from IT and asks for your password to fix an urgent issue. What should you do?",
            options: [
                {
                    label: "Give the password — they said it's urgent.",
                    correct: false,
                    feedback:
                        "Urgency is the attacker's tool, not a reason to comply. Real IT never needs your password.",
                },
                {
                    label:
                        "Hang up and call IT back on the official number from the company website.",
                    correct: true,
                    feedback:
                        "Right. Outbound verification on a number you control is the one move a pretexting attacker can't survive.",
                },
                {
                    label:
                        "Ask them to email you instead so you have a record.",
                    correct: false,
                    feedback:
                        "Better than giving the password, but the attacker can send a phishing email too. Calling back on a known number is safer because you initiate the contact.",
                },
            ],
            nextId: "done",
        },
    },
};

/**
 * Phone-call config used by ScenarioRunner to render the PhoneCall
 * component. Exported separately so the runner can import it without
 * pulling the full scenario.
 */
export const vishingCallConfig = {
    callerName: "IT Support",
    callerNumber: "+1 (555) 012-3456",
    declineNextId: "outcome-declined",
    lines: [
        {
            text: "Hi, this is Mike from IT support. I'm calling about your VPN account.",
            speed: 34,
            hold: 900,
        },
        {
            text: "We've detected some unusual login attempts and we need to verify your credentials to keep your access active.",
            speed: 30,
            hold: 900,
        },
        {
            text: "It'll only take a moment. Could you confirm your username and password so I can run a quick security check?",
            speed: 32,
            hold: 600,
        },
    ],
    choices: [
        {
            label: '"Sure, my password is…"',
            nextId: "outcome-gave-password",
        },
        {
            label: '"Can I get your employee ID? I\'d like to verify who I\'m speaking with."',
            nextId: "outcome-asked-verify",
        },
        {
            label: '"I\'ll call IT back on the official number. Thanks."',
            nextId: "outcome-hung-up",
        },
    ],
};
