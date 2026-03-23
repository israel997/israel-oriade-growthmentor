/**
 * Syncs user data between localStorage (cache) and the backend API.
 * Keys stored: gm_profile, gm_diag_results, gm_test_contenu_results,
 *              gm_test_vente_results, gm_test_digital_results,
 *              gm_formation_favorites, gm_tool_favorites, gm_content_favorites,
 *              gm_notifications, gm_mentee_application
 */

const SYNCED_KEYS = [
  "gm_profile",
  "gm_diag_results",
  "gm_test_contenu_results",
  "gm_test_vente_results",
  "gm_test_digital_results",
  "gm_formation_favorites",
  "gm_tool_favorites",
  "gm_content_favorites",
  "gm_mentee_application",
];

/** Save a value to localStorage AND patch to the backend. */
export async function saveUserData(key: string, value: unknown): Promise<void> {
  localStorage.setItem(key, JSON.stringify(value));
  try {
    await fetch("/api/user/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
  } catch (e) {
    console.error("saveUserData: failed to sync to API", e);
  }
}

/**
 * Fetch all user data from the backend and hydrate localStorage.
 * Call this once per session on espace-membre mount.
 */
export async function hydrateFromAPI(): Promise<void> {
  try {
    const res = await fetch("/api/user/data");
    if (!res.ok) return;
    const data = await res.json();
    for (const key of SYNCED_KEYS) {
      if (data[key] !== undefined) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
    }
  } catch (e) {
    console.error("hydrateFromAPI: failed", e);
  }
}
