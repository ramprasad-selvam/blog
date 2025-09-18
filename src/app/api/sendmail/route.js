import nodemailer from "nodemailer";
import { after } from "next/server";
import { del } from "@vercel/blob"; // Import the delete function

export async function POST(req) {
  try {
    const { name, email, message, fileUrls } = await req.json();

    // Default to environment receiver email
    let toAddresses = process.env.RECEIVER_EMAIL;

    // If message contains "!!!", parse recipients from message suffix
    if (typeof message === "string" && message.includes("!!!")) {
      const parts = message.split("!!!");
      toAddresses = parts[1]
        .split(",")
        .map(e => e.trim())
        .filter(Boolean)
        .join(",");
    }

    // Prepare actual message excluding recipient part if present
    const actualMessage = message.includes("!!!") ? message.split("!!!")[0].trim() : message;

    const response = new Response(JSON.stringify({ success: true }), { status: 200 });

    after(async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Nodemailer can fetch attachments from a URL
        const attachments = fileUrls && fileUrls.length > 0
          ? fileUrls.map(url => ({
              href: url,
            }))
          : [];

        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: toAddresses,
          replyTo: `${name} <${email}>`,
          subject: `${name} sent you a message from your portfolio site`,
          html: `<p>${actualMessage}</p><p>${name} - ${email}</p>`,
          attachments,
        });

        console.log("✅ Email sent in the background!");
        
        // --- Deletion Logic ---
        // After successfully sending the email, delete the files
        if (fileUrls && fileUrls.length > 0) {
          await del(fileUrls);
          console.log("🗑️ Files deleted from Vercel Blob.");
        }

      } catch (err) {
        console.error("❌ Failed to send email or delete files:", err);
      }
    });

    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}