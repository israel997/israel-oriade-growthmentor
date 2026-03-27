import { DIAGNOSTIC_SCENARIOS, DiagnosticScenario, BadgeLabel } from "./diagnostic-scenarios";
import { getFormationsByIds } from "./formations-catalog";
import { getResourcesByIds } from "./resources-catalog";

export type MatchedScenario = DiagnosticScenario & {
  formations: ReturnType<typeof getFormationsByIds>;
  resources: ReturnType<typeof getResourcesByIds>;
};

/**
 * Returns up to 3 matched scenarios sorted by priority.
 * Deduplicates formation/resource IDs across scenarios.
 */
export function matchScenarios(badge: BadgeLabel, answers: number[]): MatchedScenario[] {
  const matched = DIAGNOSTIC_SCENARIOS.filter((scenario) => {
    // Check badge constraint
    if (scenario.badges && scenario.badges.length > 0) {
      if (!scenario.badges.includes(badge)) return false;
    }
    // All conditions must be true
    return scenario.conditions.every((fn) => fn(answers));
  });

  // Sort by priority (lowest = most critical)
  matched.sort((a, b) => a.priority - b.priority);

  // Take top 3
  const top3 = matched.slice(0, 3);

  return top3.map((scenario) => ({
    ...scenario,
    formations: getFormationsByIds(scenario.formationIds),
    resources: getResourcesByIds(scenario.resourceIds),
  }));
}

/**
 * Deduplicated list of all formation IDs recommended across matched scenarios.
 */
export function getUniqueFormations(matched: MatchedScenario[]) {
  const seen = new Set<string>();
  return matched
    .flatMap((s) => s.formations)
    .filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
}

/**
 * Deduplicated list of all resource IDs recommended across matched scenarios.
 */
export function getUniqueResources(matched: MatchedScenario[]) {
  const seen = new Set<string>();
  return matched
    .flatMap((s) => s.resources)
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
}
