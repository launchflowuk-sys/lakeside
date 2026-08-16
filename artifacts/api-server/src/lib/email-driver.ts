import { logger } from "./logger";
import {
  createTransport,
  SMTP_FROM,
  ADMIN_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_WHATSAPP,
  BUSINESS_WHATSAPP_HREF,
  BUSINESS_EMAIL,
} from "./email";

const SITE_URL = (process.env.SITE_URL?.trim() || "https://lakesidetaxi.co.uk").replace(
  /\/+$/,
  "",
);

interface DriverApplicationEmailData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  addressLine?: string | null;
  city?: string | null;
  postcode: string;
  rightToWork: string;
  isLicensed: boolean;
  licenceAuthority?: string | null;
  phLicenceNumber?: string | null;
  phLicenceExpiry?: string | null;
  dvlaLicenceNumber?: string | null;
  dvlaYearsHeld?: string | null;
  penaltyPoints?: string | null;
  hasOwnVehicle: boolean;
  vehicleDetails?: string | null;
  yearsExperience?: string | null;
  availability?: string | null;
  howHeard?: string | null;
  additionalInfo?: string | null;
}

interface DriverDocumentSummary {
  docType: string;
  originalFilename: string;
}

/**
 * Applicant-supplied free text ends up inside the HTML email body. Escaping it
 * stops a stray `<` — or a deliberate `<script>` — from mangling the message
 * the office opens.
 */
function escapeHtml(value: unknown): string {
  if (value === null || value === undefined || value === "") return "&mdash;";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const rightToWorkLabel: Record<string, string> = {
  uk_citizen: "UK citizen",
  settled_status: "Settled / pre-settled status",
  visa_with_right_to_work: "Visa with right to work",
  other: "Other",
};

export const documentTypeLabel: Record<string, string> = {
  ph_driver_licence: "Private hire driver licence (badge)",
  dvla_licence: "DVLA driving licence",
  dbs_certificate: "DBS certificate",
  right_to_work: "Right to work document",
  proof_of_address: "Proof of address",
  insurance: "Insurance certificate",
  mot: "MOT certificate",
  v5c: "V5C logbook",
  cv: "CV",
  other: "Other document",
};

function detailRow(label: string, value: unknown): string {
  return `
    <tr>
      <td style="padding: 6px 14px 6px 0; color: #6b7280; font-size: 14px; vertical-align: top; white-space: nowrap;">${label}</td>
      <td style="padding: 6px 0; font-size: 14px; color: #111827;">${escapeHtml(value)}</td>
    </tr>`;
}

export async function sendDriverApplicationNotification(
  application: DriverApplicationEmailData,
  documents: readonly DriverDocumentSummary[],
): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping driver application notification");
    return;
  }

  const detailUrl = `${SITE_URL}/admin/driver-applications/${application.id}`;

  const licensingRows = application.isLicensed
    ? detailRow("Licensing authority", application.licenceAuthority) +
      detailRow("Badge number", application.phLicenceNumber) +
      detailRow("Badge expiry", application.phLicenceExpiry)
    : detailRow("Licensed", "Not yet licensed — wants help getting started");

  const address = [application.addressLine, application.city, application.postcode]
    .filter(Boolean)
    .join(", ");

  const documentList = documents.length
    ? `<ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #111827;">${documents
        .map(
          (doc) =>
            `<li style="margin-bottom: 4px;">${escapeHtml(
              documentTypeLabel[doc.docType] ?? doc.docType,
            )} &mdash; ${escapeHtml(doc.originalFilename)}</li>`,
        )
        .join("")}</ul>`
    : `<p style="margin: 8px 0 0; font-size: 14px; color: #b45309;">No documents were attached.</p>`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
      <div style="background: #f5b50a; padding: 16px 20px;">
        <h2 style="margin: 0; color: #0d1017; font-size: 18px;">New driver application</h2>
      </div>
      <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px; margin-top: 0;"><strong>${escapeHtml(application.fullName)}</strong> has applied to drive.</p>

        <h3 style="font-size: 15px; margin: 20px 0 4px; color: #0d1017;">Contact</h3>
        <table style="border-collapse: collapse;">
          ${detailRow("Phone", application.phone)}
          ${detailRow("Email", application.email)}
          ${detailRow("Address", address)}
          ${detailRow("Right to work", rightToWorkLabel[application.rightToWork] ?? application.rightToWork)}
        </table>

        <h3 style="font-size: 15px; margin: 20px 0 4px; color: #0d1017;">Licensing</h3>
        <table style="border-collapse: collapse;">
          ${licensingRows}
          ${detailRow("DVLA licence no.", application.dvlaLicenceNumber)}
          ${detailRow("Years held", application.dvlaYearsHeld)}
          ${detailRow("Penalty points", application.penaltyPoints)}
        </table>

        <h3 style="font-size: 15px; margin: 20px 0 4px; color: #0d1017;">Vehicle &amp; availability</h3>
        <table style="border-collapse: collapse;">
          ${detailRow("Own vehicle", application.hasOwnVehicle ? "Yes" : "No — would want to rent")}
          ${detailRow("Vehicle", application.vehicleDetails)}
          ${detailRow("Experience", application.yearsExperience)}
          ${detailRow("Availability", application.availability)}
          ${detailRow("Heard about us via", application.howHeard)}
          ${detailRow("Notes", application.additionalInfo)}
        </table>

        <h3 style="font-size: 15px; margin: 20px 0 4px; color: #0d1017;">Documents</h3>
        ${documentList}

        <div style="margin-top: 24px;">
          <a href="${detailUrl}" style="display: inline-block; background: #f5b50a; color: #0d1017; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 4px; font-size: 15px;">
            Open application &amp; download documents &rarr;
          </a>
        </div>
        <p style="font-size: 13px; color: #6b7280; margin-top: 12px;">
          Documents are not attached to this email — sign in to the admin panel to download them.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> &mdash; Thurrock, Essex
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      replyTo: application.email,
      subject: `New driver application — ${application.fullName}`,
      html,
    });
    logger.info(
      { driverApplicationId: application.id },
      "Driver application notification sent",
    );
  } catch (err) {
    logger.error(
      { err, driverApplicationId: application.id },
      "Failed to send driver application notification",
    );
  }
}

export async function sendDriverApplicationAck(application: {
  id: number;
  fullName: string;
  email: string;
}): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    logger.warn("Email not configured — skipping driver application acknowledgement");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f5b50a; padding: 16px 20px;">
        <h2 style="margin: 0; color: #0d1017; font-size: 18px;">Lakeside &amp; Purfleet Taxis Ltd</h2>
      </div>
      <div style="padding: 24px; background: #ffffff; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px; margin-top: 0;">Hi ${escapeHtml(application.fullName)},</p>
        <p style="font-size: 15px;">Thanks for applying to drive with us. We have your application, and one of the team will review it and get back to you.</p>
        <p style="font-size: 15px;">If you need to send anything else, or you have a question in the meantime, just reply to this email or contact us:</p>
        <table style="font-size: 14px;">
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">Phone</td><td><a href="tel:01375383878" style="color: #b8860b; font-weight: 600;">${BUSINESS_PHONE}</a></td></tr>
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">WhatsApp</td><td><a href="${BUSINESS_WHATSAPP_HREF}" style="color: #b8860b; font-weight: 600;">${BUSINESS_WHATSAPP}</a></td></tr>
          <tr><td style="padding: 3px 12px 3px 0; color: #6b7280;">Email</td><td><a href="mailto:${BUSINESS_EMAIL}" style="color: #b8860b; font-weight: 600;">${BUSINESS_EMAIL}</a></td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> &mdash; Thurrock, Essex
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: application.email,
      subject: "We have your driver application — Lakeside & Purfleet Taxis Ltd",
      html,
    });
    logger.info(
      { driverApplicationId: application.id },
      "Driver application acknowledgement sent",
    );
  } catch (err) {
    logger.error(
      { err, driverApplicationId: application.id },
      "Failed to send driver application acknowledgement",
    );
  }
}
