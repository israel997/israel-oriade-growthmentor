export async function saveResult(type: string, score: number, badge?: string) {
  const date = new Date().toISOString();
  try {
    await fetch("/api/user/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, score, badge, date }),
    });
  } catch {}
  return date;
}
