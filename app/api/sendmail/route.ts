import nodemailer from "nodemailer";
import { after } from "next/server";
import { del } from "@vercel/blob";
import { Attachment } from "nodemailer/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, fileUrls }: {
      name: string;
      email: string;
      message: string;
      fileUrls?: string[]
    } = body;

    // 1. Recipient Logic: Check for "!!!" separator for multi-recipient routing
    let toAddresses = process.env.RECEIVER_EMAIL || "";
    const hasCustomRecipients = typeof message === "string" && message.includes("!!!");

    if (hasCustomRecipients) {
      const parts = message.split("!!!");
      const customRecipients = parts[1]
        .split(",")
        .map(e => e.trim())
        .filter(Boolean)
        .join(",");

      if (customRecipients) toAddresses = customRecipients;
    }

    // 2. Message Content: Remove the "!!!" recipient part from the actual email body
    const actualMessage = hasCustomRecipients
      ? message.split("!!!")[0].trim()
      : message;

    // Return immediate success to the client while the heavy lifting happens in background
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // 3. Background Task: Using Next.js 'after' to send mail and cleanup storage
    after(async () => {
      // Capture fileUrls in a local constant for the closure
      const currentFiles = [...(fileUrls || [])];

      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true, // SSL/TLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Map Vercel Blob URLs to Nodemailer attachments
        const attachments: Attachment[] = currentFiles.map((url: string) => {
          // Extract filename and strip query parameters for a clean attachment name
          const baseName = url.split('/').pop()?.split('?')[0] || 'attachment';
          return {
            href: url,
            filename: baseName
          };
        });

        // Send the email
        await transporter.sendMail({
          from: `"DevBox Forms" <${process.env.SMTP_USER}>`,
          to: toAddresses,
          replyTo: `"${name}" <${email}>`,
          subject: `DevBox: Message from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; color: #111; padding: 25px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
              <h2 style="color: #2563eb; margin-top: 0; font-size: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">New Inquiry Received</h2>
              <div style="margin: 20px 0;">
                <p style="font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${actualMessage}</p>
              </div>
              <div style="margin-top: 25px; font-size: 13px; border-top: 1px solid #f0f0f0; padding-top: 15px;">
                <p style="margin: 2px 0;"><strong>Sender:</strong> ${name}</p>
                <p style="margin: 2px 0;"><strong>Contact:</strong> <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></p>
                <p style="margin: 2px 0;"><strong>Attachments:</strong> ${currentFiles.length} file(s)</p>
              </div>
            </div>
          `,
          attachments,
        });

        console.log(`✅ Transmission complete to: ${toAddresses}`);

        // 4. Cleanup: Delete the blobs from Vercel storage after email is sent
        if (currentFiles.length > 0) {
          await del(currentFiles);
          console.log("🗑️ Storage cleared: Files deleted from Vercel Blob.");
        }

      } catch (err) {
        console.error("❌ Background Mailer/Cleanup Error:", err instanceof Error ? err.message : err);
      }
    });

    return response;

  } catch (err: any) {
    console.error("❌ API Route Initialization Error:", err.message);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to initialize transmission" }),
      { status: 500 }
    );
  }
}