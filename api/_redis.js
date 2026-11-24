// Upstash Redis REST — Vercel Marketplace o'zgaruvchilarini avtomatik o'qiydi
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const hasDb = Boolean(URL_ && TOKEN);
const TTL = 60 * 60 * 24 * 60; // 60 kun

export async function redis(...cmd) {
  const r = await fetch(URL_, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
export const ttl = key => redis("EXPIRE", key, TTL);
export const cleanCode = g => String(g || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
export const str = (v, n) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
export async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  let raw = ""; for await (const c of req) { raw += c; if (raw.length > 20000) break; }
  try { return JSON.parse(raw); } catch { return {}; }
}
