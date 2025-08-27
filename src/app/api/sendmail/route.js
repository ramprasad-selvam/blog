import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { name, email, message, file } = await req.json();
        const response = new Response(
            JSON.stringify({ success: true, message: "Message is being sent..." }),
            { status: 200 }
        );
        (async () => {
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

                const mailOptions = {
                    from: process.env.SMTP_USER,
                    to: process.env.RECEIVER_EMAIL,
                    replyTo: `${name} <${email}>`,
                    subject: `${name} sent you a message from your portfolio site`,
                    text: message,
                    html: `<p>${message}</p><p>${name} - ${email}</p>`,
                    attachments: file
                        ? [
                            {
                                filename: file.name,
                                content: Buffer.from(file.data, "base64"),
                            },
                        ]
                        : [],
                };

                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully!");
            } catch (err) {
                console.error("Failed to send email:", err);
            }
        })();

        return response;
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
