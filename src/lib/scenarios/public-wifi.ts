import type { Scenario } from "@/lib/types";

/**
 * Scenario 5 — Public Wi-Fi.
 *
 * Player is at a café with a deadline. Three networks in range:
 *   A — open "Cafe_Free_WiFi"  (breach — evil twin / rogue AP)
 *   B — the café's real guest network with captive portal  (partial —
 *       legit but shared, metadata sniff + targeted follow-up)
 *   C — tether from own phone  (contained)
 */
export const publicWiFi: Scenario = {
    id: "public-wifi",
    title: "Three Wi-Fi networks in range",
    concept:
        "Public Wi-Fi threats — evil twin access points, sniffing on shared networks, and why your own tether or a VPN is the defence.",
    setup: "",
    startSceneId: "choose-wifi",
    scenes: {
        "choose-wifi": {
            type: "decision",
            id: "choose-wifi",
            speaker: "3:12 PM, Café Brew",
            prompt:
                "You need to send the quarterly report before the meeting. Your laptop finds three networks in range. You have five minutes.",
            choices: [],
        },

        "outcome-eviltwin": {
            type: "outcome",
            id: "outcome-eviltwin",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You connect to Cafe_Free_WiFi. Full bars, no password, no captive portal. You open your webmail, enter your credentials, and start composing the report. Nothing looks wrong. What you can't see: the access point isn't the café's. It's a laptop in the booth two tables over, running software that broadcasts that exact name. Every request you make passes through it first. Your session cookie was exfiltrated before the page finished loading. Tomorrow morning someone logs into your email from a server in another country.",
            nextId: "debrief",
        },
        "outcome-cafe": {
            type: "outcome",
            id: "outcome-cafe",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You connect to Brew_Guest, accept the terms, and get to work. The network is real — this is the café's own Wi-Fi. But you're on the same segment as every other customer. Most of your traffic is HTTPS, so the person in the corner can't read the contents of your email. They can see every domain you visit, every service you log into, and roughly when. Across a week of coffee breaks they build a map of your work habits precise enough to send you a convincing spear-phishing email from a vendor they know you use. Even legitimate public Wi-Fi is untrusted infrastructure.",
            nextId: "debrief",
        },
        "outcome-tether": {
            type: "outcome",
            id: "outcome-tether",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You turn on your phone's mobile hotspot and connect your laptop to it. The connection is slower but it's yours — encrypted to your carrier, not shared with anyone in the café. You finish the report without exposing a single packet to the local network. For anything more sensitive than casual browsing, your own tether is the simplest defence. A company VPN over café Wi-Fi is the second-best option. Not using public Wi-Fi at all for work is the best.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Open, unknown networks are untrusted infrastructure. Your own tether — or a VPN — is the cost of working on them.",
            lesson:
                "Two threats ride on public Wi-Fi. First, the evil twin — an attacker-run access point broadcasts a familiar name, captures your traffic, then hands you the Internet afterwards so nothing feels wrong. Second, the legitimate-network sniff — even a real café Wi-Fi is a shared medium where anyone on it can profile your traffic and target you later. Modern HTTPS hides the contents of most requests, but metadata — which services you use, when, for how long — still leaks. The defence in both cases is the same: don't send work traffic over any network you wouldn't trust. Tether off your phone, or run a company-approved VPN.",
            nextId: "quiz",
        },

        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "You're in an airport and need to send a confidential document. Which option is safest?",
            options: [
                {
                    label: 'Connect to "Airport_Free_WiFi" — it\'s free and available everywhere.',
                    correct: false,
                    feedback:
                        "An open network with a generic name is the classic evil-twin bait. Anyone can broadcast that SSID. You have no way to verify the access point is actually the airport's.",
                },
                {
                    label: "Connect to the airline's lounge Wi-Fi after showing your boarding pass.",
                    correct: false,
                    feedback:
                        "Lounge Wi-Fi is legitimate, but it's still shared public infrastructure. Your traffic sits on the same segment as every other customer in the lounge. Metadata leaks, and any non-HTTPS request is sniffable.",
                },
                {
                    label: "Tether from your phone's mobile data.",
                    correct: true,
                    feedback:
                        "Right. Tethering routes your traffic over the carrier's encrypted cellular network, not a shared wireless medium. It's the simplest way to isolate yourself from every threat that lives on public Wi-Fi.",
                },
            ],
            nextId: "done",
        },
    },
};

/**
 * Wi-Fi picker config used by ScenarioRunner to render the
 * WiFiPicker component for the choose-wifi scene.
 */
export const publicWiFiPickerConfig = {
    location: "Café Brew · 3:12 PM",
    networks: [
        {
            ssid: "Cafe_Free_WiFi",
            bars: 4 as const,
            locked: false,
            note: "open network · no password",
            kind: "wifi" as const,
            nextId: "outcome-eviltwin",
        },
        {
            ssid: "Brew_Guest",
            bars: 3 as const,
            locked: true,
            note: "requires sign-in · café's own network",
            kind: "wifi" as const,
            nextId: "outcome-cafe",
        },
        {
            ssid: "iPhone (Personal Hotspot)",
            bars: 4 as const,
            locked: true,
            note: "your phone · tethered",
            kind: "tether" as const,
            nextId: "outcome-tether",
        },
    ],
};
