import nodemailer from "nodemailer";
import { after } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const files = formData.getAll("files"); // Get all files with the "files" key

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

        // Convert files to the format expected by Nodemailer
        const attachments = files.length > 0
          ? await Promise.all(
              files.map(async file => ({
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()), // Read the file as a buffer
              }))
            )
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
      } catch (err) {
        console.error("❌ Failed to send email:", err);
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