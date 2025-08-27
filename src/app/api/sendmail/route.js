import nodemailer from "nodemailer";
import { after } from "next/server";

export async function POST(req) {
    try {
        const { name, email, message, file } = await req.json();

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

                await transporter.sendMail({
                    from: `"${name}" <${email}>`,
                    to: process.env.RECEIVER_EMAIL,
                    replyTo: `${name} <${email}>`,
                    subject: `${name} sent you a message from your portfolio site`,
                    html: `<p>${message}</p><p>${name} - ${email}</p>`,
                    attachments: file
                        ? [{ filename: file.name, content: Buffer.from(file.data, "base64") }]
                        : [],
                });

                console.log("✅ Email sent in the background!");
            } catch (err) {
                console.error("❌ Failed to send email:", err);
            }
        });

        return response;
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
