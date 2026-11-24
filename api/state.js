import { hasDb, redis, ttl, cleanCode, readBody } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!hasDb) return res.status(503).json({ error: "Baza ulanmagan" });
  try {
    const body = await readBody(req);
    const g = cleanCode(body.g); const s = body.state || {};
    if (!g) return res.status(400).json({ error: "Guruh kodi yo'q" });
    const size = Math.min(10, Math.max(2, parseInt(s.size, 10) || 5));
    const groups = s.locked && Array.isArray(s.groups)
      ? s.groups.slice(0, 50).map(a => (Array.isArray(a) ? a : []).slice(0, 50).map(x => String(x).replace(/[^a-zA-Z0-9]/g, "").slice(0, 40)))
      : null;
    const key = `tz:state:${g}`;
    await redis("SET", key, JSON.stringify({ size, locked: Boolean(s.locked), groups }));
    await ttl(key);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server xatosi" });
  }
}
