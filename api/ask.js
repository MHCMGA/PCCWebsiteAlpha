// AI concierge endpoint backed by Vercel AI Gateway.
// POST { question: string } -> { answer: string }
// Protected by BotID. The model is grounded in PCC facts (no hallucinated
// services, prices, or claims). Used for an optional in-page assistant.

import { checkBotId } from "botid/server";
import { waitUntil } from "@vercel/functions";
import { reportException } from "./_lib/sentry.js";

const MODEL = process.env.AI_MODEL || "anthropic/claude-haiku-4.5";
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const MAX_BODY_BYTES = 4_000;
const MAX_QUESTION_CHARS = 1000;

const SYSTEM_PROMPT = `You are the website assistant for Palmetto Consulting of Columbia, LLC (PCC), an independent insurance consulting firm in Columbia, SC, founded in 1998 by John A. Weitzel.

Authoritative facts you may use:
- Address: 1325 Park St. Suite 200, Columbia, SC 29201
- Phone: 803-904-8461
- Founded: 1998
- Services: captive insurance company design and structure; full Chief Financial Officer (CFO) services; controllership services; growth management; reinsurance structuring; rating-agency relationship management; regulatory navigation; fractional insurance CFO engagements
- Captive types served: pure (single-parent), group, association, agency-owned reinsurance vehicles, traditional commercial carriers; domicile-agnostic
- Engagement model: all business is by referral; initial conversations are at no obligation
- Geography: clients across the United States

RULES:
1. Only answer questions about PCC, captive insurance, or insurance company finance/operations.
2. If asked anything outside that scope, politely redirect: "That's outside what I can help with. For general questions, please call 803-904-8461 or use the contact form."
3. NEVER invent prices, fee structures, regulatory promises, or guarantee outcomes.
4. NEVER provide legal, tax, accounting, or actuarial advice. If asked, say: "PCC's consultants can discuss your specific situation in a no-obligation call. Please reach out via the contact form."
5. Keep answers under 120 words and in plain English.
6. If unsure, say so and suggest contacting PCC directly.`;

const isString = (x) => typeof x === "string" && x.length > 0;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return res.status(403).json({ error: "Request blocked." });
    }
  } catch (err) {
    if (process.env.VERCEL_ENV === "production") {
      console.error("[ask] BotID error:", err);
      await reportException(err, { tags: { handler: "ask", stage: "botid" } });
      return res
        .status(503)
        .json({ error: "Service temporarily unavailable." });
    }
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.error("[ask] AI_GATEWAY_API_KEY missing");
    return res.status(503).json({ error: "Assistant unavailable." });
  }

  const body = (typeof req.body === "object" && req.body) || {};
  const question = isString(body.question) ? body.question.trim() : null;
  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }
  if (question.length > MAX_QUESTION_CHARS) {
    return res.status(400).json({ error: "question is too long" });
  }

  const upstream = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 350,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    console.error("[ask] gateway", upstream.status, text.slice(0, 300));
    await reportException(
      new Error(`AI gateway ${upstream.status}: ${text.slice(0, 200)}`),
      { tags: { handler: "ask", stage: "gateway" } },
    );
    return res
      .status(502)
      .json({ error: "Assistant temporarily unavailable." });
  }

  const data = await upstream.json();
  const answer =
    data?.choices?.[0]?.message?.content?.trim() ||
    "I'm not sure. Please contact PCC at 803-904-8461 or via the contact form.";

  waitUntil(
    Promise.resolve().then(() => {
      console.log("[ask]", {
        model: MODEL,
        q_len: question.length,
        a_len: answer.length,
      });
    }),
  );

  return res.status(200).json({ answer, model: MODEL });
}
