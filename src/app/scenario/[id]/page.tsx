import { notFound } from "next/navigation";
import { ScenarioRunner } from "@/components/ScenarioRunner";
import { ALL_SCENARIOS, getScenario } from "@/lib/scenarios";

export function generateStaticParams() {
    return ALL_SCENARIOS.map((s) => ({ id: s.id }));
}

export default async function ScenarioPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const scenario = getScenario(id);
    if (!scenario) {
        notFound();
    }
    const idx = ALL_SCENARIOS.findIndex((s) => s.id === id);
    const next = idx >= 0 && idx < ALL_SCENARIOS.length - 1
        ? ALL_SCENARIOS[idx + 1]
        : null;
    return (
        <ScenarioRunner
            scenario={scenario}
            nextScenarioId={next?.id}
        />
    );
}
