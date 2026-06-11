import nodemailer from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? "noreply@lakesidetaxis.co.uk";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@lakesidetaxis.co.uk";

function createTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendNewLeadNotification(lead: {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  journeyType: string;
  pickupLocation: string;
  destination: string;
  journeyDate: string;
  journeyTime: string;
  passengers: number;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping new lead notification");
    return;
  }

  const subject = `New Booking Request #${lead.id} - Lakeside & Purfleet Taxis`;
  const html = `
    <h2>New Booking Request Received</h2>
    <p><strong>Reference:</strong> #${lead.id}</p>
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${lead.fullName}</p>
    <p><strong>Mobile:</strong> ${lead.mobile}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    <h3>Journey Details</h3>
    <p><strong>Type:</strong> ${lead.journeyType}</p>
    <p><strong>From:</strong> ${lead.pickupLocation}</p>
    <p><strong>To:</strong> ${lead.destination}</p>
    <p><strong>Date:</strong> ${lead.journeyDate}</p>
    <p><strong>Time:</strong> ${lead.journeyTime}</p>
    <p><strong>Passengers:</strong> ${lead.passengers}</p>
    <hr/>
    <p><a href="${process.env.ADMIN_URL ?? "https://lakesidetaxis.co.uk"}/admin/leads/${lead.id}">View lead in admin panel</a></p>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    logger.info({ leadId: lead.id }, "New lead notification sent");
  } catch (err) {
    logger.error({ err, leadId: lead.id }, "Failed to send new lead notification");
  }
}

export async function sendCustomerConfirmation(lead: {
  id: number;
  fullName: string;
  email: string;
  pickupLocation: string;
  destination: string;
  journeyDate: string;
  journeyTime: string;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping customer confirmation");
    return;
  }

  const subject = `We've received your booking request — Lakeside & Purfleet Taxis`;
  const html = `
    <h2>Thank you, ${lead.fullName}</h2>
    <p>We've received your booking request and our team will be in touch shortly to confirm availability and pricing.</p>
    <h3>Your Journey Details</h3>
    <p><strong>From:</strong> ${lead.pickupLocation}</p>
    <p><strong>To:</strong> ${lead.destination}</p>
    <p><strong>Date:</strong> ${lead.journeyDate}</p>
    <p><strong>Time:</strong> ${lead.journeyTime}</p>
    <p><strong>Reference:</strong> #${lead.id}</p>
    <hr/>
    <p style="color: #666; font-size: 14px;">
      <strong>Please note:</strong> This is a booking request, not a confirmed booking. 
      Your booking is not confirmed until our team contacts you with price and availability.
    </p>
    <hr/>
    <p><strong>Lakeside &amp; Purfleet Taxis Ltd</strong><br/>
    Thurrock, Essex<br/>
    Tel: 01375 000000<br/>
    WhatsApp: 07700 000000</p>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: lead.email,
      subject,
      html,
    });
    logger.info({ leadId: lead.id }, "Customer confirmation sent");
  } catch (err) {
    logger.error({ err, leadId: lead.id }, "Failed to send customer confirmation");
  }
}

export async function sendAdminReply(opts: {
  to: string;
  customerName: string;
  subject: string;
  message: string;
  quotedPrice?: string | null;
  journeyFrom: string;
  journeyTo: string;
  journeyDate: string;
  journeyTime: string;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping admin reply");
    return;
  }

  const html = `
    <p>Dear ${opts.customerName},</p>
    <p>${opts.message.replace(/\n/g, "<br/>")}</p>
    ${opts.quotedPrice ? `<p><strong>Quoted Price:</strong> ${opts.quotedPrice}</p>` : ""}
    <h3>Journey Summary</h3>
    <p><strong>From:</strong> ${opts.journeyFrom}</p>
    <p><strong>To:</strong> ${opts.journeyTo}</p>
    <p><strong>Date:</strong> ${opts.journeyDate}</p>
    <p><strong>Time:</strong> ${opts.journeyTime}</p>
    <hr/>
    <p>To confirm or enquire further, please contact us directly:</p>
    <p><strong>Lakeside &amp; Purfleet Taxis Ltd</strong><br/>
    Tel: 01375 000000<br/>
    WhatsApp: 07700 000000<br/>
    Email: info@lakesidetaxis.co.uk</p>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: opts.to,
      subject: opts.subject,
      html,
    });
    logger.info({ to: opts.to }, "Admin reply sent");
  } catch (err) {
    logger.error({ err, to: opts.to }, "Failed to send admin reply");
  }
}
