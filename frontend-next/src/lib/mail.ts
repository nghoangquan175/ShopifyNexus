import nodemailer from "nodemailer";

interface SendActivationEmailParams {
  email: string;
  firstName: string;
  activationUrl: string;
}

export async function sendActivationEmail({
  email,
  firstName,
  activationUrl,
}: SendActivationEmailParams) {
  const host = process.env.SMTP_HOST || "localhost";
  const port = parseInt(process.env.SMTP_PORT || "1025", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"ShopifyNexus" <no-reply@shopifynexus.local>';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: host === "localhost" || host === "127.0.0.1" ? false : true,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activate Your Account</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #191c1d; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 40px 20px 40px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(196, 198, 205, 0.3); box-shadow: 0 4px 12px rgba(26, 43, 60, 0.03);">
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 40px 30px 40px; background-color: #041627;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">ShopifyNexus</h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #8192a7; font-weight: 500;">Alpine Horizon Storefront</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #041627;">Welcome to ShopifyNexus!</h2>
                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #5c6066;">
                    Hi ${firstName},
                  </p>
                  <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #5c6066;">
                    Thank you for creating an account with us. To complete your registration and set up your secure password, please click the button below:
                  </p>
                  <!-- Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <a href="${activationUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #a23f00; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 12px; transition: background-color 0.2s ease; box-shadow: 0 4px 6px rgba(162, 63, 0, 0.15);">
                          Activate Your Account
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #8c9199;">
                    If the button above doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.5; word-break: break-all; color: #a23f00;">
                    <a href="${activationUrl}" target="_blank" style="color: #a23f00; text-decoration: underline;">${activationUrl}</a>
                  </p>
                  <hr style="border: 0; border-top: 1px solid #e1e3e6; margin: 30px 0 20px 0;" />
                  <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8c9199; text-align: center;">
                    If you did not request this registration, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Activate Your ShopifyNexus Account",
    text: `Hi ${firstName},\n\nPlease activate your account by visiting the following URL: ${activationUrl}`,
    html: htmlContent,
  });
}
