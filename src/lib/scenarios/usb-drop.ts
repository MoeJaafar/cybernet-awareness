import type { Scenario } from "@/lib/types";

/**
 * Scenario 4 , Dropped USB.
 *
 * Player finds an unattended USB stick with a tempting label. The
 * classic baiting attack: the attacker drops it, curiosity does the
 * rest. Three choices:
 *   A , plug it in to find the owner    (breach)
 *   B , leave it somewhere public       (partially contained , someone else plugs it in)
 *   C , hand it to IT, unopened         (contained)
 */
export const usbDrop: Scenario = {
    id: "usb-drop",
    title: "A USB stick on the floor",
    concept:
        "Physical baiting , dropped-USB attacks exploit curiosity, not network defences.",
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
                    label: 'Plug it into your laptop , find out whose it is.',
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
                "You plug it in. Windows mounts the drive , one folder, Bonuses_2026. You double-click. Nothing visible happens. Behind the scenes a payload has already run. It registered your laptop with a server abroad, stole your saved passwords, and set itself to auto-run on every login. The label was bait. You carried the breach in by hand.",
            nextId: "debrief",
        },
        "outcome-left": {
            type: "outcome",
            id: "outcome-left",
            speaker: "what happened next",
            attackerWon: true,
            narration:
                "You leave it on the break-room table. By lunchtime a colleague reads the label and plugs it in to find the owner. Same payload. Same breach. A dropped-USB attack is a numbers game , the attacker only needs one curious person. Leaving it public guarantees that person appears.",
            nextId: "debrief",
        },
        "outcome-given": {
            type: "outcome",
            id: "outcome-given",
            speaker: "what happened next",
            attackerWon: false,
            narration:
                "You take the stick to IT security without opening it. They image it on an air-gapped machine and confirm it's a malicious drop , a payload designed to exfiltrate credentials within seconds. Two other sticks are found that morning. IT sends a company-wide warning. The attack failed because no production machine ever plugged one in.",
            nextId: "debrief",
        },

        "debrief": {
            type: "debrief",
            id: "debrief",
            speaker: "the takeaway",
            takeaway:
                "An unknown USB stick isn't lost property , it's a delivery vehicle.",
            lesson:
                "Dropped-USB attacks are decades old and still work, because curiosity beats caution. A University of Illinois study found 48% of USB sticks dropped in a car park were plugged in. The attacker doesn't need your credentials or a software exploit , just one person plugging one drive into one machine. The rule: if it didn't come from a sealed package from a trusted source, it doesn't touch any computer you own.",
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
                        "This is exactly what the drop is designed for. A spare laptop is still on your network , one plug-in is enough for the payload to run.",
                },
                {
                    label: "Drop it in the lost-and-found box at reception.",
                    correct: false,
                    feedback:
                        "Better than plugging it in yourself, but lost-and-found boxes aren't air-gapped. Someone will eventually plug it in, and the attack still lands.",
                },
                {
                    label: "Hand it to IT security without plugging it in anywhere.",
                    correct: true,
                    feedback:
                        "Right. Keep it out of every machine until a specialist handles it. IT can analyse drives without running their payload.",
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
    label: "HR - Bonuses 2026 - CONFIDENTIAL",
    context: "on the carpet, halfway between the printer and the stairwell.",
    choices: [
        {
            label: "Plug it into your laptop , find out whose it is.",
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
