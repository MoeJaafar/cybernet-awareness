import type { Scenario } from "@/lib/types";

/**
 * Scenario 1 — Spear phishing email impersonating IT.
 *
 * Hook: an email arriving from "ICT Helpdesk" warns of an account
 * being suspended unless the user re-authenticates within 24 hours.
 * The link points at a typosquat domain. Three player choices:
 *   - click the link    -> credentials harvested, attacker wins
 *   - report to IT      -> defender wins, attack contained early
 *   - delete and ignore -> attack contained for this user, but the
 *                          campaign continues against colleagues
 *
 * Narration text is hard-coded for now. A later commit will replace
 * the longer narration strings with prompts to an LLM that uses the
 * player's choice plus the scenario context to write a fresh outcome
 * paragraph each session.
 */
export const phishing: Scenario = {
    id: "phishing-it-helpdesk",
    title: "Urgent: account verification required",
    concept: "Spear phishing — recognising urgency, mismatched senders, and look-alike domains.",
    setup:
        "It's a Tuesday morning at the university. You're a Faculty of Engineering staff member with five emails waiting. The third one looks important.",
    startSceneId: "open-inbox",
    scenes: {
        "open-inbox": {
            type: "stimulus",
            id: "open-inbox",
            content:
                "An email from ICT Helpdesk is at the top of your inbox. The subject line says **URGENT: account verification required within 24 hours**. You hover over the message.",
            nextId: "show-email",
        },
        "show-email": {
            type: "decision",
            id: "show-email",
            prompt: "What do you do?",
            mock: {
                fromName: "ICT Helpdesk",
                from: "helpdesk@uni-portal-secure.com",
                to: "you@university.edu",
                subject: "URGENT: account verification required within 24 hours",
                body:
                    "Dear staff member,\n\nOur records indicate your account has not been verified in line with the new Microsoft 365 security policy. Failure to verify within 24 hours will result in your account being suspended and all unsaved work being lost.\n\nPlease verify here: https://uni-portal-secure.com/verify\n\nKind regards,\nICT Helpdesk Team\nUniversity of [your institution]",
            },
            choices: [
                { label: "Click the verification link", nextId: "outcome-clicked" },
                { label: "Report to IT as suspicious", nextId: "outcome-reported" },
                { label: "Delete the email and move on", nextId: "outcome-deleted" },
            ],
        },
        "outcome-clicked": {
            type: "outcome",
            id: "outcome-clicked",
            attackerWon: true,
            narration:
                "You click. A login page that looks exactly like your university's Microsoft sign-in opens. You enter your username and password. The page spins, then redirects you to the real university homepage — so you assume everything worked. It didn't. The attacker now has your credentials and is already logging into your mailbox from a residential IP in another country. Within an hour they'll forward themselves your latest contracts and try the same password against the VPN.",
            nextId: "debrief",
        },
        "outcome-reported": {
            type: "outcome",
            id: "outcome-reported",
            attackerWon: false,
            narration:
                "You forward the email to IT as a phishing report. Within an hour ICT confirms that uni-portal-secure.com is a typosquat domain registered last week, blocks it at the gateway, and emails the rest of the faculty a warning. Three colleagues had already received the same message but hadn't clicked yet. The campaign is contained because you spoke up.",
            nextId: "debrief",
        },
        "outcome-deleted": {
            type: "outcome",
            id: "outcome-deleted",
            attackerWon: false,
            narration:
                "You delete the email. Your account is safe — for now. But you didn't tell IT, so the same campaign continues to land in colleagues' inboxes, and one of them is less cautious than you. Three days later, a payroll spreadsheet leaves the building.",
            nextId: "debrief",
        },
        "debrief": {
            type: "debrief",
            id: "debrief",
            takeaway:
                "Spear phishing relies on URGENCY, AUTHORITY, and LOOK-ALIKE DOMAINS to push you past your normal caution.",
            lesson:
                "Three signals were in plain sight: the sender domain (uni-portal-secure.com, not your university's actual domain), the artificial 24-hour deadline, and a request that ICT would never make (re-verifying an account via a one-off link). When two of those three signals are present, treat the email as malicious by default. Reporting matters too: deleting protects only you, but reporting protects everyone the campaign also targeted.",
        },
    },
};
