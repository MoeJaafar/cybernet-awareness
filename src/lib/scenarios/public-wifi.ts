import type { Scenario } from "@/lib/types";

/**
 * Scenario 5, Public Wi-Fi.
 *
 * Player is at a café with a deadline. Three networks in range:
 *   A, open "Cafe_Free_WiFi"  (breach, evil twin / rogue AP)
 *   B, the café's real guest network with captive portal  (partial,
 *       legit but shared, metadata sniff + targeted follow-up)
 *   C, tether from own phone  (contained)
 */
export const publicWiFi: Scenario = {
    id: "public-wifi",
    title: "Three Wi-Fi networks in range",
    concept:
        "Public Wi-Fi threats, evil twin access points, sniffing on shared networks, and why your own tether or a VPN is the defence.",
    setup: "",
    startSceneId: "choose-wifi",
    scenes: {
        "choose-wifi": {
            type: "decision",
            id: "choose-wifi",
            speaker: "3:12 PM, Café Brew",
            prompt:
                "You need to send the quarterly report before the meeting. Your laptop finds three networks. Five minutes.",
            choices: [],
        },

        "outcome-eviltwin": {
            type: "outcome",
            id: "outcome-eviltwin",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You connect to Cafe_Free_WiFi. Full bars, no password. You open your webmail and start composing. What you can't see: the access point isn't the café's. It's a laptop two booths over, broadcasting that exact name. Every request passes through it first. Your session cookie was exfiltrated before the page finished loading. Tomorrow someone logs into your email from a server abroad.",
            nextId: "debrief",
        },
        "outcome-cafe": {
            type: "outcome",
            id: "outcome-cafe",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You connect to Brew_Guest and get to work. The network is real, the café's own. But you share it with every other customer. HTTPS hides contents, but anyone on the network sees every domain you visit. Across a week of coffee breaks they profile you precisely enough to spear-phish from a vendor you use. Even real public Wi-Fi is untrusted infrastructure.",
            nextId: "debrief",
        },
        "outcome-tether": {
            type: "outcome",
            id: "outcome-tether",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You tether the laptop to your phone's hotspot. Slower, but yours, encrypted to your carrier, not shared with the café. You finish the report without exposing a packet to the local network. For sensitive work, your own tether is the simplest defence. A company VPN over café Wi-Fi is second-best.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "Open, unknown networks are untrusted infrastructure. Your own tether, or a VPN, is the cost of working on them.",
            lesson:
                "Two threats ride on public Wi-Fi. First, the evil twin, an attacker-run access point broadcasts a familiar name, captures your traffic, then hands you the Internet so nothing feels wrong. Second, the sniff on legitimate networks, even real café Wi-Fi is a shared medium where anyone can profile your traffic. HTTPS hides content, but metadata, which services, when, how long, still leaks. Don't send work traffic over any network you wouldn't trust. Tether off your phone, or run a VPN.",
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
            locked: false,
            note: "open · sign-in page on connect · café's own",
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
