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
    return <ScenarioRunner scenario={scenario} />;
}
