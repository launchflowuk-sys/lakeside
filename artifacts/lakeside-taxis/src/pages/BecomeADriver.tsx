import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import { BUSINESS } from "@/lib/constants";
import {
  IconArrowRight,
  IconCar,
  IconCheck,
  IconClock,
  IconMessage,
  IconPhone,
  IconPound,
  IconShield,
  IconUsers,
} from "@/components/icons/Icons";
import "./inner-page.css";
import "./become-a-driver.css";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif";

type DocType =
  | "ph_driver_licence"
  | "dvla_licence"
  | "dbs_certificate"
  | "right_to_work"
  | "proof_of_address"
  | "insurance"
  | "mot"
  | "v5c"
  | "cv";

interface DocumentSlot {
  key: DocType;
  label: string;
  hint: string;
  /** Which branch of the form this slot belongs to. */
  showFor: "licensed" | "vehicle" | "always";
}

const DOCUMENT_SLOTS: readonly DocumentSlot[] = [
  {
    key: "ph_driver_licence",
    label: "Private hire driver licence (badge)",
    hint: "Both sides if you have them",
    showFor: "licensed",
  },
  {
    key: "dvla_licence",
    label: "DVLA driving licence",
    hint: "Photocard, front and back",
    showFor: "always",
  },
  {
    key: "dbs_certificate",
    label: "DBS certificate",
    hint: "Enhanced DBS if you have one",
    showFor: "licensed",
  },
  {
    key: "right_to_work",
    label: "Right to work document",
    hint: "Passport, BRP or share code letter",
    showFor: "always",
  },
  {
    key: "proof_of_address",
    label: "Proof of address",
    hint: "Utility bill or bank statement, last 3 months",
    showFor: "always",
  },
  {
    key: "insurance",
    label: "Insurance certificate",
    hint: "Hire and reward cover",
    showFor: "vehicle",
  },
  { key: "mot", label: "MOT certificate", hint: "Current certificate", showFor: "vehicle" },
  { key: "v5c", label: "V5C logbook", hint: "Vehicle registration document", showFor: "vehicle" },
  { key: "cv", label: "CV", hint: "Optional, if you have one", showFor: "always" },
];

const REASONS = [
  {
    Icon: IconPound,
    title: "Steady, local work",
    body: "Account work, school contracts, airport runs and regular locals — not just whatever an app decides to send you.",
  },
  {
    Icon: IconClock,
    title: "Hours that suit you",
    body: "Full time, part time, days, nights or weekends. Tell us what you can do and we will work around it.",
  },
  {
    Icon: IconUsers,
    title: "A firm you can actually reach",
    body: "A real office in Thurrock with people who answer the phone, since 1990. No faceless support queue.",
  },
  {
    Icon: IconShield,
    title: "Help getting licensed",
    body: "Not licensed yet? We will talk you through what Thurrock Council requires and what the process involves.",
  },
];

const STEPS = [
  { n: "01", title: "Apply", body: "Fill in the form below and upload whatever documents you already have." },
  { n: "02", title: "We review", body: "We check your details and come back to you, usually within a couple of days." },
  { n: "03", title: "Have a chat", body: "A quick conversation about the work, the hours and how we operate." },
  { n: "04", title: "Get started", body: "Once your paperwork is in order we get you on the road." },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postcode: string;
  rightToWork: string;
  isLicensed: string;
  licenceAuthority: string;
  phLicenceNumber: string;
  phLicenceExpiry: string;
  dvlaLicenceNumber: string;
  dvlaYearsHeld: string;
  penaltyPoints: string;
  hasOwnVehicle: string;
  vehicleDetails: string;
  yearsExperience: string;
  availability: string;
  howHeard: string;
  additionalInfo: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  addressLine: "",
  city: "",
  postcode: "",
  rightToWork: "",
  isLicensed: "",
  licenceAuthority: "",
  phLicenceNumber: "",
  phLicenceExpiry: "",
  dvlaLicenceNumber: "",
  dvlaYearsHeld: "",
  penaltyPoints: "",
  hasOwnVehicle: "",
  vehicleDetails: "",
  yearsExperience: "",
  availability: "",
  howHeard: "",
  additionalInfo: "",
  consent: false,
};

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.error === "string") return data.error;
  } catch {
    // Fall through to the generic message below.
  }
  return "Something went wrong. Please try again, or call us on 01375 383878.";
}

export default function BecomeADriver() {
  const revealRef = useReveal<HTMLDivElement>();
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [documents, setDocuments] = useState<Partial<Record<DocType, File>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLicensed = form.isLicensed === "yes";
  const hasOwnVehicle = form.hasOwnVehicle === "yes";

  const visibleSlots = DOCUMENT_SLOTS.filter((slot) => {
    if (slot.showFor === "licensed") return isLicensed;
    if (slot.showFor === "vehicle") return hasOwnVehicle;
    return true;
  });

  const set =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target;
      const value =
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value;
      setForm((previous) => ({ ...previous, [field]: value }));
    };

  const setDocument = (key: DocType) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setDocuments((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" is larger than 10MB. Please upload a smaller file.`);
      event.target.value = "";
      return;
    }
    setError(null);
    setDocuments((previous) => ({ ...previous, [key]: file }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1 — the written application, saved on its own so a dropped
      // connection during upload never costs the applicant what they typed.
      const createResponse = await fetch("/api/driver-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          addressLine: form.addressLine.trim() || undefined,
          city: form.city.trim() || undefined,
          postcode: form.postcode.trim(),
          rightToWork: form.rightToWork,
          isLicensed,
          licenceAuthority: form.licenceAuthority.trim() || undefined,
          phLicenceNumber: form.phLicenceNumber.trim() || undefined,
          phLicenceExpiry: form.phLicenceExpiry.trim() || undefined,
          dvlaLicenceNumber: form.dvlaLicenceNumber.trim() || undefined,
          dvlaYearsHeld: form.dvlaYearsHeld.trim() || undefined,
          penaltyPoints: form.penaltyPoints.trim() || undefined,
          hasOwnVehicle,
          vehicleDetails: form.vehicleDetails.trim() || undefined,
          yearsExperience: form.yearsExperience.trim() || undefined,
          availability: form.availability.trim() || undefined,
          howHeard: form.howHeard.trim() || undefined,
          additionalInfo: form.additionalInfo.trim() || undefined,
          consent: form.consent,
        }),
      });

      if (!createResponse.ok) {
        setError(await readError(createResponse));
        return;
      }

      const { id, uploadToken } = (await createResponse.json()) as {
        id: number;
        uploadToken: string;
      };

      // Step 2 — documents, if any were chosen.
      const chosen = visibleSlots
        .map((slot) => ({ slot, file: documents[slot.key] }))
        .filter((entry): entry is { slot: DocumentSlot; file: File } => Boolean(entry.file));

      if (chosen.length > 0) {
        const payload = new FormData();
        // Text fields first so they are already parsed by the time the file
        // parts are read on the server.
        for (const entry of chosen) payload.append("docTypes", entry.slot.key);
        for (const entry of chosen) payload.append("documents", entry.file);

        const uploadResponse = await fetch(`/api/driver-applications/${id}/documents`, {
          method: "POST",
          headers: { "x-upload-token": uploadToken },
          body: payload,
        });

        if (!uploadResponse.ok) {
          setError(
            `${await readError(uploadResponse)} Your application has been saved — we will contact you about the documents.`,
          );
          // Still finalise, so the office is notified about the application.
          await fetch(`/api/driver-applications/${id}/complete`, {
            method: "POST",
            headers: { "x-upload-token": uploadToken },
          });
          return;
        }
      }

      // Step 3 — finalise and notify the office.
      await fetch(`/api/driver-applications/${id}/complete`, {
        method: "POST",
        headers: { "x-upload-token": uploadToken },
      });

      setIsSuccess(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setError(
        "We could not reach the server. Please check your connection and try again, or call us on 01375 383878.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Private Hire Taxi Driver",
    description:
      "Private hire taxi driver opportunities with Lakeside & Purfleet Taxis Ltd in Thurrock, Essex. Local account work, school contracts and airport transfers. Owner-drivers and drivers looking to rent a vehicle both considered.",
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Grays",
        addressRegion: "Essex",
        addressCountry: "GB",
      },
    },
    directApply: true,
  };

  return (
    <Layout>
      <Helmet>
        <title>Become a Driver | Lakeside &amp; Purfleet Taxis Ltd</title>
        <meta
          name="description"
          content="Drive for Lakeside & Purfleet Taxis in Thurrock. Steady local work, hours that suit you, and help getting licensed. Apply online and upload your documents."
        />
        <link rel="canonical" href="https://lakesidetaxi.co.uk/become-a-driver" />
        <meta property="og:title" content="Become a Driver | Lakeside & Purfleet Taxis Ltd" />
        <meta
          property="og:description"
          content="Drive for a Thurrock firm trading since 1990. Steady local work, flexible hours, and help getting licensed."
        />
        <meta property="og:url" content="https://lakesidetaxi.co.uk/become-a-driver" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jobPostingJsonLd)}</script>
      </Helmet>

      <div ref={revealRef}>
        {/* ── Hero ── */}
        <section className="bd-hero">
          <div className="bd-hero-inner">
            <span className="bd-kicker">Driver recruitment</span>
            <h1 className="bd-hero-h1">Drive with Lakeside &amp; Purfleet Taxis</h1>
            <p className="bd-hero-lede">
              We have been running taxis in Thurrock since 1990. If you know the roads
              and you want steady work from a firm that answers the phone, we would like
              to hear from you.
            </p>
            <div className="bd-hero-actions">
              <a href="#apply" className="bd-btn bd-btn--primary">
                Apply now <IconArrowRight size={18} />
              </a>
              <a href={BUSINESS.phoneTel} className="bd-btn bd-btn--ghost">
                <IconPhone size={18} /> {BUSINESS.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ── Why drive with us ── */}
        <section className="bd-section">
          <div className="bd-section-inner">
            <span className="bd-section-kicker">Why us</span>
            <h2 className="bd-section-h2">What you get</h2>
            <div className="bd-card-grid">
              {REASONS.map(({ Icon, title, body }) => (
                <div className="bd-card ls-reveal" key={title}>
                  <span className="bd-card-icon">
                    <Icon size={22} />
                  </span>
                  <h3 className="bd-card-h3">{title}</h3>
                  <p className="bd-card-p">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Requirements ── */}
        <section className="bd-section bd-section--alt">
          <div className="bd-section-inner">
            <span className="bd-section-kicker">Requirements</span>
            <h2 className="bd-section-h2">What you need</h2>
            <div className="bd-req-grid">
              <div className="bd-req ls-reveal">
                <h3 className="bd-req-h3">
                  <IconCheck size={18} /> Already licensed
                </h3>
                <ul className="bd-list">
                  <li>A current private hire driver licence from Thurrock or a neighbouring authority</li>
                  <li>A full UK or exchangeable driving licence</li>
                  <li>An enhanced DBS check</li>
                  <li>The right to work in the UK</li>
                  <li>
                    If you drive your own car: a licensed vehicle, valid MOT and hire and
                    reward insurance
                  </li>
                </ul>
              </div>
              <div className="bd-req ls-reveal">
                <h3 className="bd-req-h3">
                  <IconCar size={18} /> Not licensed yet
                </h3>
                <p className="bd-req-p">
                  You can still apply. Getting a private hire licence in Thurrock means a
                  DBS check, a medical, a driving assessment and a council application —
                  it takes a few weeks and there are fees involved.
                </p>
                <p className="bd-req-p">
                  Tell us where you are up to on the form and we will talk you through
                  what is left. We can also discuss renting a licensed vehicle rather
                  than buying one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="bd-section">
          <div className="bd-section-inner">
            <span className="bd-section-kicker">The process</span>
            <h2 className="bd-section-h2">How it works</h2>
            <div className="bd-steps">
              {STEPS.map((step) => (
                <div className="bd-step ls-reveal" key={step.n}>
                  <span className="bd-step-n">{step.n}</span>
                  <h3 className="bd-step-h3">{step.title}</h3>
                  <p className="bd-step-p">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Application form ── */}
        <section className="bd-apply" id="apply" ref={formRef}>
          <div className="bd-apply-inner">
            <div className="bd-apply-heading">
              <span className="bd-section-kicker">Driver application</span>
              <h2 className="bd-section-h2">Apply to drive with us</h2>
              <p className="bd-apply-desc">
                Everything marked with an asterisk is required. Upload whatever documents
                you already have — you can send the rest later.
              </p>
            </div>

            {isSuccess ? (
              <div className="bd-success">
                <span className="bd-success-icon">
                  <IconCheck size={26} />
                </span>
                <h3 className="bd-success-h3">Application received</h3>
                <p className="bd-success-p">
                  Thanks — we have your application and we will be in touch. We have also
                  sent a confirmation to your email address.
                </p>
                <p className="bd-success-p">
                  If you want to talk to someone sooner, call{" "}
                  <a href={BUSINESS.phoneTel}>{BUSINESS.phone}</a> or message us on{" "}
                  <a href={BUSINESS.whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Section 1 — about you */}
                <div className="bd-form-block">
                  <div className="bd-form-block-title">01 — About you</div>
                  <div className="bd-form-grid">
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-fullName">
                        Full name <span>*</span>
                      </label>
                      <input
                        id="bd-fullName"
                        className="bd-input"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.fullName}
                        onChange={set("fullName")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-phone">
                        Mobile number <span>*</span>
                      </label>
                      <input
                        id="bd-phone"
                        className="bd-input"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-email">
                        Email address <span>*</span>
                      </label>
                      <input
                        id="bd-email"
                        className="bd-input"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-address">
                        Address
                      </label>
                      <input
                        id="bd-address"
                        className="bd-input"
                        type="text"
                        autoComplete="address-line1"
                        value={form.addressLine}
                        onChange={set("addressLine")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-city">
                        Town
                      </label>
                      <input
                        id="bd-city"
                        className="bd-input"
                        type="text"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={set("city")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-postcode">
                        Postcode <span>*</span>
                      </label>
                      <input
                        id="bd-postcode"
                        className="bd-input"
                        type="text"
                        required
                        autoComplete="postal-code"
                        value={form.postcode}
                        onChange={set("postcode")}
                      />
                    </div>
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-rightToWork">
                        Right to work in the UK <span>*</span>
                      </label>
                      <select
                        id="bd-rightToWork"
                        className="bd-input"
                        required
                        value={form.rightToWork}
                        onChange={set("rightToWork")}
                      >
                        <option value="">Please select</option>
                        <option value="uk_citizen">UK citizen</option>
                        <option value="settled_status">Settled / pre-settled status</option>
                        <option value="visa_with_right_to_work">Visa with right to work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2 — licensing */}
                <div className="bd-form-block">
                  <div className="bd-form-block-title">02 — Licensing</div>
                  <div className="bd-form-grid">
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-isLicensed">
                        Do you already hold a private hire driver licence? <span>*</span>
                      </label>
                      <select
                        id="bd-isLicensed"
                        className="bd-input"
                        required
                        value={form.isLicensed}
                        onChange={set("isLicensed")}
                      >
                        <option value="">Please select</option>
                        <option value="yes">Yes, I am licensed</option>
                        <option value="no">Not yet — I would like to get licensed</option>
                      </select>
                    </div>

                    {isLicensed && (
                      <>
                        <div className="bd-field">
                          <label className="bd-label" htmlFor="bd-licenceAuthority">
                            Issuing council <span>*</span>
                          </label>
                          <input
                            id="bd-licenceAuthority"
                            className="bd-input"
                            type="text"
                            placeholder="e.g. Thurrock Council"
                            value={form.licenceAuthority}
                            onChange={set("licenceAuthority")}
                          />
                        </div>
                        <div className="bd-field">
                          <label className="bd-label" htmlFor="bd-phLicenceNumber">
                            Badge number <span>*</span>
                          </label>
                          <input
                            id="bd-phLicenceNumber"
                            className="bd-input"
                            type="text"
                            value={form.phLicenceNumber}
                            onChange={set("phLicenceNumber")}
                          />
                        </div>
                        <div className="bd-field">
                          <label className="bd-label" htmlFor="bd-phLicenceExpiry">
                            Badge expiry
                          </label>
                          <input
                            id="bd-phLicenceExpiry"
                            className="bd-input"
                            type="text"
                            placeholder="e.g. March 2027"
                            value={form.phLicenceExpiry}
                            onChange={set("phLicenceExpiry")}
                          />
                        </div>
                      </>
                    )}

                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-dvlaYearsHeld">
                        Years held a driving licence
                      </label>
                      <input
                        id="bd-dvlaYearsHeld"
                        className="bd-input"
                        type="text"
                        placeholder="e.g. 8 years"
                        value={form.dvlaYearsHeld}
                        onChange={set("dvlaYearsHeld")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-penaltyPoints">
                        Penalty points
                      </label>
                      <input
                        id="bd-penaltyPoints"
                        className="bd-input"
                        type="text"
                        placeholder="e.g. None, or 3 points (SP30)"
                        value={form.penaltyPoints}
                        onChange={set("penaltyPoints")}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 — vehicle and availability */}
                <div className="bd-form-block">
                  <div className="bd-form-block-title">03 — Vehicle &amp; availability</div>
                  <div className="bd-form-grid">
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-hasOwnVehicle">
                        Do you have your own vehicle? <span>*</span>
                      </label>
                      <select
                        id="bd-hasOwnVehicle"
                        className="bd-input"
                        required
                        value={form.hasOwnVehicle}
                        onChange={set("hasOwnVehicle")}
                      >
                        <option value="">Please select</option>
                        <option value="yes">Yes, I have my own vehicle</option>
                        <option value="no">No — I would want to rent one</option>
                      </select>
                    </div>

                    {hasOwnVehicle && (
                      <div className="bd-field bd-field--full">
                        <label className="bd-label" htmlFor="bd-vehicleDetails">
                          Vehicle details <span>*</span>
                        </label>
                        <input
                          id="bd-vehicleDetails"
                          className="bd-input"
                          type="text"
                          placeholder="Make, model, year and registration"
                          value={form.vehicleDetails}
                          onChange={set("vehicleDetails")}
                        />
                      </div>
                    )}

                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-yearsExperience">
                        Driving experience
                      </label>
                      <input
                        id="bd-yearsExperience"
                        className="bd-input"
                        type="text"
                        placeholder="e.g. 3 years private hire"
                        value={form.yearsExperience}
                        onChange={set("yearsExperience")}
                      />
                    </div>
                    <div className="bd-field">
                      <label className="bd-label" htmlFor="bd-availability">
                        Availability
                      </label>
                      <input
                        id="bd-availability"
                        className="bd-input"
                        type="text"
                        placeholder="e.g. Full time, nights and weekends"
                        value={form.availability}
                        onChange={set("availability")}
                      />
                    </div>
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-howHeard">
                        How did you hear about us?
                      </label>
                      <input
                        id="bd-howHeard"
                        className="bd-input"
                        type="text"
                        value={form.howHeard}
                        onChange={set("howHeard")}
                      />
                    </div>
                    <div className="bd-field bd-field--full">
                      <label className="bd-label" htmlFor="bd-additionalInfo">
                        Anything else you would like us to know?
                      </label>
                      <textarea
                        id="bd-additionalInfo"
                        className="bd-input bd-textarea"
                        rows={4}
                        value={form.additionalInfo}
                        onChange={set("additionalInfo")}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4 — documents */}
                <div className="bd-form-block">
                  <div className="bd-form-block-title">04 — Documents</div>
                  <p className="bd-form-block-note">
                    PDF or photo, up to 10MB each. Upload what you have now — anything
                    missing can follow later.
                  </p>
                  <div className="bd-doc-grid">
                    {visibleSlots.map((slot) => {
                      const chosen = documents[slot.key];
                      return (
                        <div className="bd-doc" key={slot.key}>
                          <label className="bd-label" htmlFor={`bd-doc-${slot.key}`}>
                            {slot.label}
                          </label>
                          <span className="bd-doc-hint">{slot.hint}</span>
                          <input
                            id={`bd-doc-${slot.key}`}
                            className="bd-file"
                            type="file"
                            accept={ACCEPTED_FILE_TYPES}
                            onChange={setDocument(slot.key)}
                          />
                          {chosen && (
                            <span className="bd-doc-chosen">
                              <IconCheck size={14} /> {chosen.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Consent + submit */}
                <div className="bd-form-block">
                  <label className="bd-consent">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={set("consent")}
                    />
                    <span>
                      I confirm the information above is accurate and I agree to Lakeside
                      &amp; Purfleet Taxis Ltd storing my details and documents so my
                      application can be assessed. <span className="bd-required">*</span>
                    </span>
                  </label>

                  {error && (
                    <p className="bd-error" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="bd-btn bd-btn--primary bd-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending…" : "Submit application"}
                    {!isSubmitting && <IconArrowRight size={18} />}
                  </button>

                  <p className="bd-form-foot">
                    Prefer to talk first? Call{" "}
                    <a href={BUSINESS.phoneTel}>{BUSINESS.phone}</a> or message us on{" "}
                    <a href={BUSINESS.whatsappHref} target="_blank" rel="noreferrer">
                      <IconMessage size={14} /> WhatsApp
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
