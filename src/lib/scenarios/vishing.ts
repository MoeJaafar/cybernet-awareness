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
    title: "A call from Microsoft Support",
    concept:
        "Vishing — voice-based social engineering, pretexting, and why tech companies never call you to ask for your password.",
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
                'You gave your password. The caller thanked you warmly and hung up. Within ten minutes someone logged into your Microsoft account from an IP in another country. Your emails, your OneDrive, your Teams — all accessible. Microsoft will never call you to ask for your password. Not ever. If someone does, it\'s not Microsoft.',
            nextId: "debrief",
        },
        "outcome-asked-verify": {
            type: "outcome",
            id: "outcome-asked-verify",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                'You asked for their employee ID and said you\'d call Microsoft back on the number from their website. There was a pause. They stammered something about "system limitations" and hung up. Real support agents can always verify their identity. Scammers can\'t — that\'s how you know.',
            nextId: "debrief",
        },
        "outcome-hung-up": {
            type: "outcome",
            id: "outcome-hung-up",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You hung up and went to microsoft.com/support. The real Microsoft confirmed they never call customers to ask for passwords. The attack failed because you didn't trust an incoming call. Outbound verification — looking up the real number yourself — is the simplest defence against vishing.",
            nextId: "debrief",
        },
        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Microsoft, Apple, Google — none of them will ever call you to ask for your password. If someone does, it's a scam.",
            lesson:
                "Vishing works because the caller controls the narrative — they create urgency (your account is compromised), authority (I'm from Microsoft), and helpfulness (I'm here to fix it). Breaking out of the script — asking for verification, looking up the real number yourself — collapses the pretence. The scammer has no answer for that.",
            nextId: "quiz",
        },
        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "Someone calls claiming to be from Microsoft and asks for your password to fix an urgent issue. What should you do?",
            options: [
                {
                    label: "Give the password — they said it's urgent.",
                    correct: false,
                    feedback:
                        "Urgency is the attacker's tool, not a reason to comply. Real IT never needs your password.",
                },
                {
                    label:
                        "Hang up and check microsoft.com/support for the real contact number.",
                    correct: true,
                    feedback:
                        "Right. Looking up the real number yourself — outbound verification — is the one move a scammer can't survive.",
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
    callerName: "Microsoft Support",
    callerNumber: "+1 (800) 642-7676",
    lines: [
        {
            text: "Hello, this is David from Microsoft Support. We're calling because our system has detected suspicious activity on your Microsoft account.",
            speed: 32,
            hold: 900,
        },
        {
            text: "Someone may have accessed your account from an unrecognised device. We need to verify your identity to secure it before any data is compromised.",
            speed: 30,
            hold: 900,
        },
        {
            text: "Could you please confirm the email address and password associated with your Microsoft account so we can run a security check?",
            speed: 32,
            hold: 600,
        },
    ],
    choices: [
        {
            label: '"Sure, let me give you my password…"',
            nextId: "outcome-gave-password",
        },
        {
            label: '"What\'s your employee ID? I\'d like to verify this is really Microsoft."',
            nextId: "outcome-asked-verify",
        },
        {
            label: '"I\'ll check microsoft.com myself. Thanks."',
            nextId: "outcome-hung-up",
        },
    ],
};
