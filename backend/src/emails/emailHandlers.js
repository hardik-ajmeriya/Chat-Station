import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTamplates.js";
import { ENV } from "../lib/env.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  // In development, Resend only permits sending to the authenticated sender address.
  const isProd = ENV.NODE_ENV === "production";
  const canSendInDev =
    email && ENV.EMAIL_FROM && email.toLowerCase() === ENV.EMAIL_FROM.toLowerCase();

  if (!isProd && !canSendInDev) {
    console.warn(
      `Skipping welcome email in dev: Resend allows sending only to EMAIL_FROM (${ENV.EMAIL_FROM}).`
    );
    return { skipped: true };
  }

  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to chat-station-app!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Resend welcome email error:", error);
    return { error };
  }

  console.log("Welcome email queued", data);
  return { data };
};