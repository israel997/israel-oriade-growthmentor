import { Db } from "mongodb";

/**
 * Checks if a user qualifies for the Growth Mentee badge and awards it if so.
 * Criteria:
 *   - At least MIN_TEST_IMPROVEMENTS distinct test types where the latest score
 *     is strictly higher than the first score recorded
 *   - OR at least MIN_CERTIFICATIONS certifications collected
 *
 * Called after each test result save.
 */

const MIN_TEST_IMPROVEMENTS = 3;

export async function checkAndAwardGrowthMenteeBadge(db: Db, userId: string): Promise<boolean> {
  // Already has badge?
  const badgeDoc = await db.collection("user_badges").findOne({ userId });
  if (badgeDoc?.badges?.includes("growth_mentee")) return false; // already awarded

  // Fetch all results for this user (excluding diagnostic)
  const results = await db
    .collection("user_results")
    .find({ userId, type: { $ne: "diagnostic" } })
    .sort({ date: 1 })
    .toArray();

  // Group by test type
  const byType: Record<string, number[]> = {};
  for (const r of results) {
    if (!byType[r.type]) byType[r.type] = [];
    byType[r.type].push(r.score);
  }

  // Count how many test types have improved (latest score > first score)
  let improvements = 0;
  for (const scores of Object.values(byType)) {
    if (scores.length >= 2 && scores[scores.length - 1] > scores[0]) {
      improvements++;
    }
  }

  // Check certifications (entries of type "certification")
  const certCount = await db.collection("user_results").countDocuments({
    userId,
    type: "certification",
  });

  const qualifies = improvements >= MIN_TEST_IMPROVEMENTS || certCount >= 1;

  if (qualifies) {
    await db.collection("user_badges").updateOne(
      { userId },
      {
        $addToSet: { badges: "growth_mentee" },
        $set: { updatedAt: new Date() },
        $setOnInsert: { userId, createdAt: new Date() },
      },
      { upsert: true }
    );
    return true; // newly awarded
  }

  return false;
}
