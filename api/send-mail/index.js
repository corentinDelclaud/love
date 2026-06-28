/**
 * Vercel Serverless Function for sending emails
 * Handles POST requests to /api/send-mail
 */
import nodemailer from 'nodemailer';

// Create SMTP transporter
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const fromAddress = process.env.MAIL_FROM || 'Love Date Planner <you@example.com>';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && fromAddress);

// Helper to read JSON body
const readJsonBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
};

// Helper to send JSON response
const sendJson = (response, statusCode, payload) => {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.status(statusCode).json(payload);
};

// For Vercel to recognize this as a serverless function
export const config = {
  api: {
    bodyParser: false, // We handle body parsing manually
  },
};

export default async function handler(request, response) {
  // Handle OPTIONS for CORS preflight
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).end();
    return;
  }

  // Only allow POST
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const { recipient, subject, body: messageBody } = body;

    // Validate required fields
    if (typeof recipient !== 'string' || typeof subject !== 'string' || typeof messageBody !== 'string') {
      sendJson(response, 400, { 
        error: 'recipient, subject, and body are required strings' 
      });
      return;
    }

    // Check if SMTP is configured
    if (!smtpConfigured) {
      sendJson(response, 500, { 
        error: 'SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM environment variables.' 
      });
      return;
    }

    // Create transporter (recreate it for each request)
    const mailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    const info = await mailTransporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: subject,
      text: messageBody,
      html: messageBody.replace(/\n/g, '<br />'),
    });

    sendJson(response, 200, {
      message: 'Mail sent successfully.',
      messageId: info.messageId ?? 'sent',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to send mail.';
    console.error('Email sending error:', error);
    sendJson(response, 500, { error: errorMessage });
  }
}