import nodemailer from "nodemailer";
import { logger } from "./logger";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM ?? "noreply@lakesidetaxi.co.uk";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@lakesidetaxi.co.uk";

const BUSINESS_PHONE = "01375 383878";
const BUSINESS_WHATSAPP = "07879 956275";
const BUSINESS_WHATSAPP_HREF = "https://wa.me/447879956275";
const BUSINESS_EMAIL = "info@lakesidetaxi.co.uk";

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
    // Without these, nodemailer's defaults allow a broken/unreachable SMTP
    // server to hang the connection for up to 2 minutes — and since lead
    // submission awaits email sending before responding, that hangs the
    // customer's request too. Fail fast instead; the lead is already saved
    // in the database before this runs, so a failed/slow email never loses
    // data, it just gets logged (see the catch block around the callers).
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
}

const journeyTypeLabel: Record<string, string> = {
  local: "Local Taxi",
  airport: "Airport Transfer",
  school_run: "School Run",
  corporate: "Corporate Travel",
  long_distance: "Long Distance",
  other: "Other",
};

export async function sendNewLeadNotification(lead: {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  preferredContactMethod?: string | null;
  journeyType: string;
  pickupLocation: string;
  destination: string;
  viaStops?: string | null;
  journeyDate: string;
  journeyTime: string;
  returnRequired?: boolean | null;
  returnDate?: string | null;
  returnTime?: string | null;
  passengers: number;
  luggage?: string | null;
  childSeatsRequired?: boolean | null;
  accessibilityRequirements?: string | null;
  additionalNotes?: string | null;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping new lead notification");
    return;
  }

  const journeyLabel = journeyTypeLabel[lead.journeyType] ?? lead.journeyType;
  const subject = `New Booking Request — ${journeyLabel} — ${lead.pickupLocation} to ${lead.destination}`;
  const adminUrl = process.env.ADMIN_URL ?? "https://lakesidetaxi.co.uk";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f5b50a; padding: 16px 20px;">
        <h2 style="margin: 0; color: #0d1017; font-size: 18px;">New Booking Request #${lead.id}</h2>
      </div>
      <div style="padding: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
        <h3 style="color: #374151; margin-top: 0;">Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 4px 0; color: #6b7280; width: 160px;">Name</td><td style="padding: 4px 0; font-weight: 600;">${lead.fullName}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Mobile</td><td style="padding: 4px 0;"><a href="tel:${lead.mobile.replace(/\s+/g, "")}" style="color: #f5b50a;">${lead.mobile}</a></td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Email</td><td style="padding: 4px 0;"><a href="mailto:${lead.email}" style="color: #f5b50a;">${lead.email}</a></td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Preferred Contact</td><td style="padding: 4px 0; text-transform: capitalize;">${lead.preferredContactMethod ?? "Not specified"}</td></tr>
        </table>

        <h3 style="color: #374151;">Journey Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 4px 0; color: #6b7280; width: 160px;">Journey Type</td><td style="padding: 4px 0; font-weight: 600;">${journeyLabel}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Pickup</td><td style="padding: 4px 0;">${lead.pickupLocation}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Destination</td><td style="padding: 4px 0;">${lead.destination}</td></tr>
          ${lead.viaStops ? `<tr><td style="padding: 4px 0; color: #6b7280;">Via</td><td style="padding: 4px 0;">${lead.viaStops}</td></tr>` : ""}
          <tr><td style="padding: 4px 0; color: #6b7280;">Date</td><td style="padding: 4px 0;">${lead.journeyDate}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Time</td><td style="padding: 4px 0;">${lead.journeyTime}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Passengers</td><td style="padding: 4px 0;">${lead.passengers}</td></tr>
          ${lead.luggage ? `<tr><td style="padding: 4px 0; color: #6b7280;">Luggage</td><td style="padding: 4px 0;">${lead.luggage} bag(s)</td></tr>` : ""}
          <tr><td style="padding: 4px 0; color: #6b7280;">Child Seats</td><td style="padding: 4px 0;">${lead.childSeatsRequired ? "Yes — required" : "No"}</td></tr>
          ${lead.accessibilityRequirements ? `<tr><td style="padding: 4px 0; color: #6b7280;">Accessibility</td><td style="padding: 4px 0;">${lead.accessibilityRequirements}</td></tr>` : ""}
        </table>

        ${lead.returnRequired ? `
        <h3 style="color: #374151;">Return Journey</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 4px 0; color: #6b7280; width: 160px;">Return Date</td><td style="padding: 4px 0;">${lead.returnDate ?? "Not specified"}</td></tr>
          <tr><td style="padding: 4px 0; color: #6b7280;">Return Time</td><td style="padding: 4px 0;">${lead.returnTime ?? "Not specified"}</td></tr>
        </table>
        ` : ""}

        ${lead.additionalNotes ? `
        <h3 style="color: #374151;">Customer Notes</h3>
        <p style="font-size: 14px; background: #f9fafb; padding: 10px 12px; border-radius: 4px; border-left: 3px solid #f5b50a;">${lead.additionalNotes}</p>
        ` : ""}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <a href="${adminUrl}/admin/leads/${lead.id}" style="display: inline-block; background: #f5b50a; color: #0d1017; padding: 10px 20px; text-decoration: none; font-weight: 700; border-radius: 4px; font-size: 14px;">
            View in Admin Panel &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: ADMIN_EMAIL, subject, html });
    logger.info({ leadId: lead.id }, "New lead notification sent");
  } catch (err) {
    logger.error({ err, leadId: lead.id }, "Failed to send new lead notification");
  }
}

export async function sendCustomerConfirmation(lead: {
  id: number;
  fullName: string;
  email: string;
  journeyType: string;
  pickupLocation: string;
  destination: string;
  viaStops?: string | null;
  journeyDate: string;
  journeyTime: string;
  returnRequired?: boolean | null;
  returnDate?: string | null;
  returnTime?: string | null;
  passengers: number;
  luggage?: string | null;
  childSeatsRequired?: boolean | null;
  accessibilityRequirements?: string | null;
  additionalNotes?: string | null;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping customer confirmation");
    return;
  }

  const subject = `Your booking request has been received — Lakeside & Purfleet Taxis Ltd`;
  const journeyLabel = journeyTypeLabel[lead.journeyType] ?? lead.journeyType;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f5b50a; padding: 16px 20px;">
        <h2 style="margin: 0; color: #0d1017; font-size: 18px;">Lakeside &amp; Purfleet Taxis Ltd</h2>
      </div>
      <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Hi ${lead.fullName},</p>
        <p style="font-size: 15px;">Thank you for sending your journey details to <strong>Lakeside &amp; Purfleet Taxis Ltd</strong>.</p>
        <div style="background: #fff8e1; border: 1px solid #f5b50a; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #374151;">
            <strong>Please note:</strong> This is not a confirmed booking. Our team will review your request and contact you to confirm availability and pricing.
          </p>
        </div>

        <h3 style="color: #374151; margin-top: 20px;">Your Journey Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 5px 0; color: #6b7280; width: 160px;">Journey Type</td><td style="padding: 5px 0; font-weight: 600;">${journeyLabel}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Pickup</td><td style="padding: 5px 0;">${lead.pickupLocation}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Destination</td><td style="padding: 5px 0;">${lead.destination}</td></tr>
          ${lead.viaStops ? `<tr><td style="padding: 5px 0; color: #6b7280;">Via</td><td style="padding: 5px 0;">${lead.viaStops}</td></tr>` : ""}
          <tr><td style="padding: 5px 0; color: #6b7280;">Date</td><td style="padding: 5px 0;">${lead.journeyDate}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Time</td><td style="padding: 5px 0;">${lead.journeyTime}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Passengers</td><td style="padding: 5px 0;">${lead.passengers}</td></tr>
          ${lead.luggage ? `<tr><td style="padding: 5px 0; color: #6b7280;">Luggage</td><td style="padding: 5px 0;">${lead.luggage} bag(s)</td></tr>` : ""}
          ${lead.childSeatsRequired ? `<tr><td style="padding: 5px 0; color: #6b7280;">Child Seats</td><td style="padding: 5px 0;">Required</td></tr>` : ""}
          ${lead.accessibilityRequirements ? `<tr><td style="padding: 5px 0; color: #6b7280;">Accessibility</td><td style="padding: 5px 0;">${lead.accessibilityRequirements}</td></tr>` : ""}
          <tr><td style="padding: 5px 0; color: #6b7280;">Reference</td><td style="padding: 5px 0; font-weight: 600;">#${lead.id}</td></tr>
        </table>

        ${lead.returnRequired ? `
        <h3 style="color: #374151; margin-top: 20px;">Return Journey</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 5px 0; color: #6b7280; width: 160px;">Return Date</td><td style="padding: 5px 0;">${lead.returnDate ?? "To be confirmed"}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Return Time</td><td style="padding: 5px 0;">${lead.returnTime ?? "To be confirmed"}</td></tr>
        </table>
        ` : ""}

        ${lead.additionalNotes ? `
        <h3 style="color: #374151; margin-top: 20px;">Your Notes</h3>
        <p style="font-size: 14px; background: #f9fafb; padding: 10px 12px; border-radius: 4px; border-left: 3px solid #f5b50a; margin: 0;">${lead.additionalNotes}</p>
        ` : ""}

        <p style="font-size: 14px; margin-top: 20px;">If your journey is urgent, please contact us directly:</p>
        <table style="font-size: 14px;">
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">Phone</td><td><a href="tel:01375383878" style="color: #f5b50a; font-weight: 600;">${BUSINESS_PHONE}</a></td></tr>
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">WhatsApp</td><td><a href="${BUSINESS_WHATSAPP_HREF}" style="color: #f5b50a; font-weight: 600;">${BUSINESS_WHATSAPP}</a></td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          We only use your details to respond to your taxi enquiry. We do not sell your information.<br/>
          <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> &mdash; Thurrock, Essex &mdash;
          <a href="mailto:${BUSINESS_EMAIL}" style="color: #9ca3af;">${BUSINESS_EMAIL}</a>
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: lead.email, subject, html });
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f5b50a; padding: 16px 20px;">
        <h2 style="margin: 0; color: #0d1017; font-size: 18px;">Lakeside &amp; Purfleet Taxis Ltd</h2>
      </div>
      <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear ${opts.customerName},</p>
        <p style="font-size: 15px; white-space: pre-line;">${opts.message.replace(/\n/g, "<br/>")}</p>

        ${opts.quotedPrice ? `
        <div style="background: #fff8e1; border: 1px solid #f5b50a; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
          <p style="margin: 0; font-size: 15px; color: #374151;"><strong>Quoted Price:</strong> ${opts.quotedPrice}</p>
        </div>
        ` : ""}

        <h3 style="color: #374151; margin-top: 20px;">Journey Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 5px 0; color: #6b7280; width: 120px;">From</td><td style="padding: 5px 0;">${opts.journeyFrom}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">To</td><td style="padding: 5px 0;">${opts.journeyTo}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Date</td><td style="padding: 5px 0;">${opts.journeyDate}</td></tr>
          <tr><td style="padding: 5px 0; color: #6b7280;">Time</td><td style="padding: 5px 0;">${opts.journeyTime}</td></tr>
        </table>

        <p style="font-size: 14px; margin-top: 20px;">To confirm or enquire further, contact us directly:</p>
        <table style="font-size: 14px;">
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">Phone</td><td><a href="tel:01375383878" style="color: #f5b50a; font-weight: 600;">${BUSINESS_PHONE}</a></td></tr>
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">WhatsApp</td><td><a href="${BUSINESS_WHATSAPP_HREF}" style="color: #f5b50a; font-weight: 600;">${BUSINESS_WHATSAPP}</a></td></tr>
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">Email</td><td><a href="mailto:${BUSINESS_EMAIL}" style="color: #f5b50a;">${BUSINESS_EMAIL}</a></td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> &mdash; Thurrock, Essex
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: opts.to, subject: opts.subject, html });
    logger.info({ to: opts.to }, "Admin reply sent");
  } catch (err) {
    logger.error({ err, to: opts.to }, "Failed to send admin reply");
  }
}
