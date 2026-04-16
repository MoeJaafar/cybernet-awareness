import type { Scenario, ScenarioId } from "@/lib/types";
import { phishing } from "./phishing";
import { passwordFortress } from "./password-fortress";
import { vishing } from "./vishing";

/** Master registry of all scenarios. Order is the play order. */
export const ALL_SCENARIOS: Scenario[] = [phishing, passwordFortress, vishing];

const BY_ID: Record<ScenarioId, Scenario> = Object.fromEntries(
    ALL_SCENARIOS.map((s) => [s.id, s]),
);

export function getScenario(id: ScenarioId): Scenario | undefined {
    return BY_ID[id];
}

export function listScenarios(): Scenario[] {
    return ALL_SCENARIOS;
}
