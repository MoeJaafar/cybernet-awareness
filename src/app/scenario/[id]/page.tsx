import { notFound } from "next/navigation";
import { ScenarioRunner } from "@/components/ScenarioRunner";
import { ALL_SCENARIOS, getScenario } from "@/lib/scenarios";

/**
 * Pre-render every scenario at build time. Cheap because the set is
 * tiny and entirely static.
 */
export function generateStaticParams() {
    return ALL_SCENARIOS.map((s) => ({ id: s.id }));
}

/**
 * In Next.js 16's App Router, `params` is a Promise that must be
 * awaited. The AGENTS.md note shipped with create-next-app warns this
 * is a recent breaking change; older docs show params as a plain
 * object.
 */
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
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <ScenarioRunner scenario={scenario} />
            </div>
        </div>
    );
}
