import type { Scenario } from "@/lib/types";

/**
 * Scenario 4 — Dropped USB.
 *
 * Player finds an unattended USB stick with a tempting label. The
 * classic baiting attack: the attacker drops it, curiosity does the
 * rest. Three choices:
 *   A — plug it in to find the owner    (breach)
 *   B — leave it somewhere public       (partially contained — someone else plugs it in)
 *   C — hand it to IT, unopened         (contained)
 */
export const usbDrop: Scenario = {
    id: "usb-drop",
    title: "A USB stick on the floor",
    concept:
        "Physical baiting — dropped-USB attacks exploit curiosity, not network defences.",
    setup: "",
    startSceneId: "found-usb",
    scenes: {
        "found-usb": {
            type: "decision",
            id: "found-usb",
            speaker: "8:47 AM",
            prompt:
                "There's a USB stick on the carpet near the printer. No one around. The label is handwritten.",
            choices: [
                {
                    label: 'Plug it into your laptop — find out whose it is.',
                    nextId: "outcome-plugged",
                },
                {
                    label: "Leave it on the break-room table for whoever lost it.",
                    nextId: "outcome-left",
                },
                {
                    label: "Hand it to IT security, still untouched.",
                    nextId: "outcome-given",
                },
            ],
        },

        "outcome-plugged": {
            type: "outcome",
            id: "outcome-plugged",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You plug it in. Windows mounts the drive — one folder, Bonuses_2026. You double-click. Nothing visible happens. Behind the scenes a payload has already run. It registered your laptop with a command-and-control server in another country, harvested your saved browser passwords, and planted a scheduled task that runs every time you log in. The label was bait. The attacker didn't need to breach the network remotely — you carried the breach in by hand.",
            nextId: "debrief",
        },
        "outcome-left": {
            type: "outcome",
            id: "outcome-left",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You leave it on the break-room table. By lunchtime a colleague notices it, reads the label, and plugs it into their laptop to find the owner. Same payload. Same breach. The only thing that changed is whose machine was compromised first. A dropped-USB attack is a numbers game — the attacker only needs one curious person. Leaving it in a public space guarantees that person eventually appears.",
            nextId: "debrief",
        },
        "outcome-given": {
            type: "outcome",
            id: "outcome-given",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You take the stick to IT security without opening it. They image it on an air-gapped machine and confirm it's a malicious drop — a preloaded payload designed to exfiltrate credentials within seconds of being plugged in. Two other sticks are found that morning in the building. IT sends a company-wide warning and locks USB ports on unattended machines by the end of the day. The attack failed because no one with a production machine plugged one in.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "An unknown USB stick isn't lost property — it's a delivery vehicle.",
            lesson:
                "Dropped-USB attacks are decades old and still work, because curiosity beats caution for most people. A University of Illinois study famously found that 48% of USB sticks dropped in a car park were plugged in — most within ten minutes of being found. The attacker doesn't need your network credentials or a software exploit. They need one person to plug one drive into one machine. The rule is simple: if it didn't come from a sealed package from a trusted source, it doesn't touch any computer you own. Hand it to IT.",
            nextId: "quiz",
        },

        "quiz": {
            type: "quiz",
            id: "quiz",
            speaker: "one last check",
            prompt:
                "You find a USB stick labelled Payroll – Q4 on the floor of the office car park. What's the right move?",
            options: [
                {
                    label: "Plug it into a spare laptop so you can identify the owner.",
                    correct: false,
                    feedback:
                        "This is exactly what the drop is designed for. A spare laptop is still a machine on your network — one plug-in is enough for the payload to run.",
                },
                {
                    label: "Drop it in the lost-and-found box at reception.",
                    correct: false,
                    feedback:
                        "Better than plugging it in yourself, but lost-and-found boxes aren't air-gapped. Someone will eventually plug it in to 'check whose it is' and the attack still lands.",
                },
                {
                    label: "Hand it to IT security without plugging it in anywhere.",
                    correct: true,
                    feedback:
                        "Right. The only safe path is to keep it out of every machine until a specialist handles it. IT has the tooling to analyse drives without running their payload.",
                },
            ],
            nextId: "done",
        },
    },
};

/**
 * Stick-mock config used by ScenarioRunner to render the UsbStick
 * component for the found-usb scene. Exported separately so the
 * runner can import it without pulling the full scenario.
 */
export const usbStickConfig = {
    label: "HR — Bonuses 2026 — CONFIDENTIAL",
    context: "on the carpet, halfway between the printer and the stairwell.",
    choices: [
        {
            label: "Plug it into your laptop — find out whose it is.",
            nextId: "outcome-plugged",
        },
        {
            label: "Leave it on the break-room table for whoever lost it.",
            nextId: "outcome-left",
        },
        {
            label: "Hand it to IT security, still untouched.",
            nextId: "outcome-given",
        },
    ],
};
