import { hasDb, redis, ttl, cleanCode, str, readBody } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const g = cleanCode(req.query.g);
      if (!g) return res.status(400).json({ error: "Guruh kodi yo'q" });
      if (!hasDb) return res.status(200).json({ db: false, students: [], state: null });
      const [flat, st] = await Promise.all([redis("HGETALL", `tz:s:${g}`), redis("GET", `tz:state:${g}`)]);
      const students = [];
      for (let i = 0; i < (flat || []).length; i += 2) { try { students.push(JSON.parse(flat[i + 1])); } catch {} }
      students.sort((a, b) => a.t - b.t);
      return res.status(200).json({ db: true, students, state: st ? JSON.parse(st) : null });
    }
    if (req.method === "POST") {
      if (!hasDb) return res.status(503).json({ error: "Baza ulanmagan" });
      const body = await readBody(req);
      const g = cleanCode(body.g); const s = body.student || {};
      const id = str(s.id, 40).replace(/[^a-zA-Z0-9]/g, "");
      const age = parseInt(s.age, 10);
      const interests = (Array.isArray(s.interests) ? s.interests : []).map(i => str(i, 24)).filter(Boolean).slice(0, 3);
      const student = { id, name: str(s.name, 40), age, district: str(s.district, 40), school: str(s.school, 40), interests, t: Date.now() };
      if (!g || !id || !student.name || !(age >= 10 && age <= 80) || !student.district || !student.school || !interests.length)
        return res.status(400).json({ error: "Ma'lumot to'liq emas" });
      const key = `tz:s:${g}`;
      const prev = await redis("HGET", key, id);
      if (prev) { try { student.t = JSON.parse(prev).t; } catch {} }
      else if ((await redis("HLEN", key)) >= 200) return res.status(429).json({ error: "Guruh to'lgan" });
      await redis("HSET", key, id, JSON.stringify(student));
      await ttl(key);
      return res.status(200).json({ ok: true, student });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "Server xatosi" });
  }
}
