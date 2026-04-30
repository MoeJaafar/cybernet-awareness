import { notFound } from "next/navigation";
import { ScenarioRunner } from "@/components/ScenarioRunner";
import { listScenarios, getScenario } from "@/lib/scenarios";
import { LOCALES, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
    const params: { locale: string; id: string }[] = [];
    for (const locale of LOCALES) {
        for (const s of listScenarios(locale)) {
            params.push({ locale, id: s.id });
        }
    }
    return params;
}

export default async function ScenarioPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const scenario = getScenario(locale, id);
    if (!scenario) notFound();
    const all = listScenarios(locale);
    const idx = all.findIndex((s) => s.id === id);
    const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    return (
        <ScenarioRunner
            scenario={scenario}
            locale={locale}
            nextScenarioId={next?.id}
        />
    );
}
