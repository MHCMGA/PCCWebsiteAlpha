import { Resend } from "resend";
import { checkBotId } from "botid/server";
import { waitUntil } from "@vercel/functions";
import { render } from "@react-email/render";
import ContactNotification from "../emails/contact-notification.js";
import ContactAutoReply from "../emails/contact-autoreply.js";
import { reportException } from "./_lib/sentry.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const REPLY_TO_PCC =
  process.env.RESEND_REPLY_TO || "info@palmettoconsulting.us";
const TO_EMAIL = (process.env.RESEND_TO_EMAIL || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
  email.length <= 254;

const MAX_BODY_BYTES = 12_000;

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
}

export default async function handler(req, res) {
  setNoStore(res);

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
      await reportException(err, {
        tags: { handler: "contact", stage: "botid" },
      });
      return res
        .status(503)
        .json({ error: "Verification temporarily unavailable." });
    }
  }

  if (!process.env.RESEND_API_KEY || TO_EMAIL.length === 0) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const { name, email, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Invalid input." });
  }
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }
  if (cleanName.length > 200 || cleanMessage.length > 5000) {
    return res.status(400).json({ error: "Input is too long." });
  }
  if (!isValidEmail(cleanEmail)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address." });
  }

  const meta = {
    country: req.headers["x-vercel-ip-country"] || null,
    region: req.headers["x-vercel-ip-country-region"] || null,
    city: req.headers["x-vercel-ip-city"] || null,
  };

  try {
    const notifProps = {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      meta,
    };
    const [notifHtml, notifText] = await Promise.all([
      render(ContactNotification(notifProps)),
      render(ContactNotification(notifProps), { plainText: true }),
    ]);

    const { error } = await resend.emails.send({
      from: `Palmetto Consulting Website <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: cleanEmail,
      subject: `New contact form submission from ${cleanName}`,
      html: notifHtml,
      text: notifText,
      tags: [{ name: "template", value: "contact-notification" }],
    });

    if (error) {
      console.error("Resend notification error:", error);
      await reportException(
        new Error(`Resend notification failed: ${error.message || error}`),
        { tags: { handler: "contact", stage: "notification-send" } },
      );
      return res
        .status(502)
        .json({ error: "Failed to send message. Please try again later." });
    }

    waitUntil(
      (async () => {
        try {
          const replyProps = { name: cleanName, message: cleanMessage };
          const [replyHtml, replyText] = await Promise.all([
            render(ContactAutoReply(replyProps)),
            render(ContactAutoReply(replyProps), { plainText: true }),
          ]);
          const ar = await resend.emails.send({
            from: `Palmetto Consulting <${FROM_EMAIL}>`,
            to: [cleanEmail],
            replyTo: REPLY_TO_PCC,
            subject: "We received your message: Palmetto Consulting",
            html: replyHtml,
            text: replyText,
            tags: [{ name: "template", value: "contact-autoreply" }],
          });
          if (ar.error) {
            console.error("Resend autoreply error:", ar.error);
            await reportException(
              new Error(`Resend autoreply failed: ${ar.error.message || ar.error}`),
              { tags: { handler: "contact", stage: "autoreply-send" } },
            );
          }
          console.log("[contact:ok]", {
            name_len: cleanName.length,
            msg_len: cleanMessage.length,
            ...meta,
            ip: req.headers["x-forwarded-for"] || null,
            ua: (req.headers["user-agent"] || "").slice(0, 200),
          });
        } catch (e) {
          console.error("autoreply dispatch failed:", e);
          await reportException(e, {
            tags: { handler: "contact", stage: "autoreply-dispatch" },
          });
        }
      })(),
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    await reportException(err, {
      tags: { handler: "contact", stage: "handler" },
    });
    return res
      .status(500)
      .json({ error: "Unexpected error. Please try again later." });
  }
}
