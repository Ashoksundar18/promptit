import nodemailer from 'nodemailer';

export interface SendResetEmailParams {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ to, resetUrl }: SendResetEmailParams): Promise<boolean> {
  const host = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '465', 10);
  const user = process.env.EMAIL_SERVER_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.GMAIL_APP_PASSWORD;
  const from = process.env.EMAIL_FROM || `"Prompt It" <${user || 'no-reply@promptit.com'}>`;

  if (!user || !pass) {
    console.warn('⚠️ SMTP email credentials not configured in environment variables (EMAIL_SERVER_USER / EMAIL_SERVER_PASSWORD).');
    return false;
  }

  const isGmail = host.includes('gmail') || user?.endsWith('@gmail.com');

  const transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: 'gmail',
          auth: { user, pass },
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        }
  );

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #3b82f6; font-size: 28px; font-weight: 800; margin: 0;">⚡ Prompt It</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smarter Prompts. Better Results.</p>
      </div>

      <div style="background-color: #1e293b; padding: 28px; border-radius: 12px; border: 1px solid #334155;">
        <h2 style="font-size: 20px; font-weight: 600; color: #f1f5f9; margin-top: 0;">Reset Your Password</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          We received a request to reset the password for your Prompt It account (<strong>${to}</strong>).
        </p>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          Click the button below to set a new password. This link is valid for 1 hour.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            Reset Password
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; margin-bottom: 0;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Prompt It. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Reset your Prompt It password',
      html: htmlContent,
    });
    console.log(`✅ Password reset email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
}
