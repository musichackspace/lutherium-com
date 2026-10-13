/* Relais du formulaire de contact de leclosdesclefs.com.

   Le site est statique (GitHub Pages) : il ne peut pas porter d'identifiants.
   Il poste la demande en JSON ici, et ce Worker l'envoie par le SMTP Mailgun
   (EU, domaine mail.musichackspace.org), avec Reply-To sur l'adresse du
   visiteur pour qu'il suffise de repondre au message. */

import { WorkerMailer } from "worker-mailer";

/* Champs attendus, dans l'ordre du message, avec leur libelle. */
const FIELDS = [
  ["evenement", "Événement"],
  ["date", "Date souhaitée"],
  ["invites", "Invités"],
  ["chambres", "Chambres sur place"],
  ["nom", "Nom"],
  ["email", "E-mail"],
  ["telephone", "Téléphone"],
  ["langue", "Langue du site"],
];
const MAX_FIELD = 300;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function cors(origin, env) {
  const allowed = env.ALLOWED_ORIGINS.split(",").map(s => s.trim());
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(status, body, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/* Pas de retour a la ligne dans ce qui part en en-tete (objet, noms). */
const oneLine = s => String(s).replace(/[\r\n]+/g, " ").trim();

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json(405, { ok: false, error: "method" }, headers);

    /* Seul le site peut poster ici : un navigateur envoie toujours Origin. */
    const allowed = env.ALLOWED_ORIGINS.split(",").map(s => s.trim());
    if (!allowed.includes(origin)) return json(403, { ok: false, error: "origin" }, headers);

    let data;
    try {
      data = await request.json();
    } catch {
      return json(400, { ok: false, error: "json" }, headers);
    }
    if (!data || typeof data !== "object") return json(400, { ok: false, error: "json" }, headers);

    /* Champ piege, invisible pour un humain : on fait comme si tout allait bien. */
    if (data.site_web) return json(200, { ok: true }, headers);

    const clean = {};
    for (const [k] of FIELDS) {
      if (data[k] != null) clean[k] = oneLine(data[k]).slice(0, MAX_FIELD);
    }
    const message = String(data.message || "").trim().slice(0, MAX_MESSAGE);

    if (!clean.nom || !clean.email || !EMAIL_RE.test(clean.email)) {
      return json(422, { ok: false, error: "missing" }, headers);
    }

    const lines = FIELDS.filter(([k]) => clean[k]).map(([k, label]) => `${label} : ${clean[k]}`);
    const text = lines.join("\n") + (message ? `\n\nMessage :\n${message}\n` : "\n");
    const subject = ["Le Clos des Clefs", clean.evenement || "Demande", clean.date, clean.nom]
      .filter(Boolean).join(" — ");

    try {
      await WorkerMailer.send(
        {
          host: env.MAILGUN_SMTP_HOST,
          port: Number.parseInt(env.MAILGUN_SMTP_PORT, 10),
          secure: false,
          startTls: true,
          credentials: { username: env.MAILGUN_SMTP_USER, password: env.MAILGUN_SMTP_PASSWORD },
          authType: "plain",
        },
        {
          from: { name: env.CONTACT_FROM_NAME, email: env.CONTACT_FROM_EMAIL },
          to: env.CONTACT_TO_EMAIL,
          reply: { name: clean.nom, email: clean.email },
          subject,
          text,
        },
      );
    } catch (err) {
      console.error("contact: send failed", err && err.message);
      return json(502, { ok: false, error: "send" }, headers);
    }

    return json(200, { ok: true }, headers);
  },
};
