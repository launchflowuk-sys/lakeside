import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useSubmitCorporateApplication } from "@workspace/api-client-react";
import "./inner-page.css";
import "./corporate-accounts.css";

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";

const sectors = [
  {
    icon: "🏢",
    name: "Private Businesses",
    desc: "Regular airport runs, client collections and staff transport for businesses of all sizes across Essex and London.",
  },
  {
    icon: "🏛️",
    name: "Local Councils",
    desc: "Transport solutions for council staff and community services. Trusted by Thurrock Council.",
  },
  {
    icon: "🎓",
    name: "Schools & Academies",
    desc: "Safe, reliable school-run contracts with DBS-checked drivers, flexible early starts and fixed monthly billing.",
  },
  {
    icon: "🏥",
    name: "NHS & Healthcare",
    desc: "Priority booking for healthcare staff, patient transport support and 24/7 availability when it matters most.",
  },
  {
    icon: "🏭",
    name: "Industrial & Logistics",
    desc: "Shift-pattern transport, site access and staff shuttles for manufacturing and logistics clients including Inchcape.",
  },
  {
    icon: "💛",
    name: "Charities & Nonprofits",
    desc: "Flexible, cost-conscious transport for charitable organisations — invoiced monthly to keep your admin simple.",
  },
];

const benefits = [
  { icon: "🔒", title: "Fixed pricing, every trip", desc: "Agreed rates upfront — no surprises on your invoice." },
  { icon: "📋", title: "Monthly invoice billing", desc: "One consolidated invoice per billing period. Easy for finance teams." },
  { icon: "👤", title: "Dedicated account manager", desc: "A named contact who knows your account and your requirements." },
  { icon: "📞", title: "24/7 priority booking", desc: "Account holders get priority access, day and night." },
  { icon: "🗺️", title: "UK-wide coverage", desc: "Airports, ports, city centres — we go anywhere in the UK." },
  { icon: "📊", title: "Journey reporting", desc: "Monthly journey summaries available on request for your records." },
  { icon: "👥", title: "Multiple booking contacts", desc: "Add your PA, operations team or authorised staff to the account." },
  { icon: "📱", title: "No app needed", desc: "Book by phone or email — simple for everyone in your organisation." },
];

const steps = [
  {
    num: "01",
    title: "Submit your application",
    desc: "Complete the form below in under 5 minutes. Tell us about your organisation and transport needs.",
  },
  {
    num: "02",
    title: "We review and contact you",
    desc: "We'll review your application and call or email you within one business day to discuss your account.",
  },
  {
    num: "03",
    title: "Rates agreed, account set up",
    desc: "We agree your fixed rates, billing terms and account details. No setup fee, no contract lock-in.",
  },
  {
    num: "04",
    title: "Start booking immediately",
    desc: "From day one your team can book transport by phone or email. We handle everything else.",
  },
];

const JOURNEY_TYPE_OPTIONS = [
  { value: "airport", label: "Airport transfers" },
  { value: "local", label: "Local taxis" },
  { value: "school_run", label: "School runs" },
  { value: "long_distance", label: "Long distance" },
  { value: "cruise", label: "Cruise terminal" },
  { value: "mixed", label: "Mixed / varied" },
];

interface FormState {
  companyName: string;
  organisationType: string;
  companyAddress: string;
  city: string;
  postcode: string;
  website: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  estimatedMonthlyJourneys: string;
  journeyTypes: string[];
  numberOfPassengers: string;
  preferredBilling: string;
  contractStartDate: string;
  existingProviderDetails: string;
  additionalRequirements: string;
}

const EMPTY_FORM: FormState = {
  companyName: "",
  organisationType: "",
  companyAddress: "",
  city: "",
  postcode: "",
  website: "",
  contactName: "",
  jobTitle: "",
  email: "",
  phone: "",
  estimatedMonthlyJourneys: "",
  journeyTypes: [],
  numberOfPassengers: "",
  preferredBilling: "monthly",
  contractStartDate: "",
  existingProviderDetails: "",
  additionalRequirements: "",
};

export default function CorporateAccounts() {
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");

  const { mutate, isPending, isSuccess, isError } = useSubmitCorporateApplication();

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleJourneyType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      journeyTypes: prev.journeyTypes.includes(value)
        ? prev.journeyTypes.filter((v) => v !== value)
        : [...prev.journeyTypes, value],
    }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (): boolean => {
    const required: [keyof FormState, string][] = [
      ["companyName", "Company / organisation name"],
      ["organisationType", "Organisation type"],
      ["companyAddress", "Company address"],
      ["city", "City"],
      ["postcode", "Postcode"],
      ["contactName", "Your full name"],
      ["email", "Email address"],
      ["phone", "Phone number"],
      ["estimatedMonthlyJourneys", "Estimated monthly journeys"],
      ["preferredBilling", "Preferred billing method"],
    ];
    for (const [key, label] of required) {
      if (!form[key]) {
        setValidationError(`Please fill in: ${label}`);
        return false;
      }
    }
    if (form.journeyTypes.length === 0) {
      setValidationError("Please select at least one journey type.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutate({
      data: {
        companyName: form.companyName,
        organisationType: form.organisationType as
          | "business"
          | "school"
          | "council"
          | "nhs"
          | "charity"
          | "other",
        companyAddress: form.companyAddress,
        city: form.city,
        postcode: form.postcode,
        website: form.website || null,
        contactName: form.contactName,
        jobTitle: form.jobTitle || null,
        email: form.email,
        phone: form.phone,
        estimatedMonthlyJourneys: form.estimatedMonthlyJourneys,
        journeyTypes: form.journeyTypes.join(","),
        numberOfPassengers: form.numberOfPassengers || null,
        preferredBilling: form.preferredBilling,
        contractStartDate: form.contractStartDate || null,
        existingProviderDetails: form.existingProviderDetails || null,
        additionalRequirements: form.additionalRequirements || null,
      },
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Corporate Accounts | Lakeside &amp; Purfleet Taxis</title>
        <meta
          name="description"
          content="Open a corporate taxi account with Lakeside & Purfleet Taxis. Fixed pricing, monthly billing and dedicated account management for businesses, councils, schools and NHS in Essex and London."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="ca-hero">
        <div className="ca-hero-inner">
          <span className="ca-hero-kicker">✦ Corporate Accounts · Essex &amp; London</span>
          <h1 className="ca-hero-h1">
            Transport that works
            <span>for business.</span>
          </h1>
          <p className="ca-hero-desc">
            Professional transport accounts for businesses, local councils, schools and
            organisations across Essex and London. Fixed prices. Monthly billing. A team
            that picks up the phone.
          </p>
          <div className="ca-hero-actions">
            <button className="ca-hero-btn-primary" onClick={scrollToForm}>
              Open a corporate account
            </button>
            <a className="ca-hero-btn-secondary" href={TEL}>
              📞 01375 383878
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="ca-trust">
        <div className="ca-trust-inner">
          <div>
            <div className="ca-trust-label">Trusted by organisations including</div>
            <div className="ca-trust-clients">
              Inchcape · Thurrock Council · and businesses across Essex
            </div>
          </div>
          <div className="ca-trust-stats">
            {[
              { num: "30+", lbl: "Years operating" },
              { num: "24/7", lbl: "Service" },
              { num: "100%", lbl: "Fixed pricing" },
              { num: "UK", lbl: "Wide coverage" },
            ].map((s) => (
              <div className="ca-trust-stat" key={s.lbl}>
                <span className="ca-trust-stat-num">{s.num}</span>
                <span className="ca-trust-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Who we work with ── */}
      <section className="ca-section ca-section--dark">
        <div className="ca-section-inner">
          <div className="ca-section-kicker">Who we work with</div>
          <h2 className="ca-section-h2">The right fit for your organisation</h2>
          <p className="ca-section-desc">
            From single-driver bookings to full fleet support, we tailor every corporate
            account to the way your organisation actually works.
          </p>
          <div className="ca-sectors-grid">
            {sectors.map((s) => (
              <div className="ca-sector-card" key={s.name}>
                <span className="ca-sector-icon">{s.icon}</span>
                <div className="ca-sector-name">{s.name}</div>
                <div className="ca-sector-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="ca-section ca-section--mid">
        <div className="ca-section-inner">
          <div className="ca-section-kicker">Account benefits</div>
          <h2 className="ca-section-h2">Everything a business account should be</h2>
          <p className="ca-section-desc">
            No hidden fees, no booking apps, no complicated processes — just a reliable
            taxi account that works the way your business works.
          </p>
          <div className="ca-benefits-grid">
            {benefits.map((b) => (
              <div className="ca-benefit-card" key={b.title}>
                <span className="ca-benefit-icon">{b.icon}</span>
                <div className="ca-benefit-title">{b.title}</div>
                <div className="ca-benefit-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="ca-section ca-section--dark">
        <div className="ca-section-inner">
          <div className="ca-section-kicker">How it works</div>
          <h2 className="ca-section-h2">Up and running in 24 hours</h2>
          <p className="ca-section-desc">Applying takes less than 5 minutes. We do the rest.</p>
          <div className="ca-steps-grid">
            {steps.map((s) => (
              <div className="ca-step-card" key={s.num}>
                <span className="ca-step-num">{s.num}</span>
                <div className="ca-step-title">{s.title}</div>
                <div className="ca-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div className="ca-cta">
        <h2 className="ca-cta-h2">Already have questions?</h2>
        <p className="ca-cta-sub">
          Call us or message on WhatsApp — we'll talk you through everything before you apply.
        </p>
        <div className="ca-cta-actions">
          <a className="ca-cta-btn-dark" href={TEL}>
            📞 01375 383878
          </a>
          <a
            className="ca-cta-btn-outline"
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp us
          </a>
        </div>
      </div>

      {/* ── Application Form ── */}
      <div className="ca-apply" ref={formRef} id="apply">
        <div className="ca-apply-inner">
          <div className="ca-apply-heading">
            <span className="ca-section-kicker">Corporate account application</span>
            <h2
              className="ca-section-h2"
              style={{ textAlign: "center", marginTop: "8px" }}
            >
              Open your account
            </h2>
            <p
              className="ca-section-desc"
              style={{ textAlign: "center", margin: "0 auto" }}
            >
              Complete the form below and we'll be in touch within one business day to
              confirm your account and agreed rates.
            </p>
          </div>

          {isSuccess ? (
            <div className="ca-success">
              <span className="ca-success-icon">✅</span>
              <h3 className="ca-success-h3">Application received</h3>
              <p className="ca-success-p">
                Thank you — we'll review your application and be in touch within one
                business day.
                <br />
                In the meantime, call us on{" "}
                <a href={TEL} style={{ color: "#ffd100" }}>
                  01375 383878
                </a>{" "}
                if you have any questions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* ── Section 1 ── */}
              <div className="ca-form-block">
                <div className="ca-form-block-title">01 — Your Organisation</div>
                <div className="ca-form-grid">
                  <div className="ca-form-field ca-form-field--full">
                    <label className="ca-form-label">
                      Company / organisation name <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.companyName}
                      onChange={set("companyName")}
                      placeholder="e.g. Acme Ltd"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Organisation type <span>*</span>
                    </label>
                    <select
                      className="ca-form-input"
                      value={form.organisationType}
                      onChange={set("organisationType")}
                    >
                      <option value="">Select type</option>
                      <option value="business">Private business</option>
                      <option value="school">School / academy</option>
                      <option value="council">Local council</option>
                      <option value="nhs">NHS / healthcare</option>
                      <option value="charity">Charity / nonprofit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">Website</label>
                    <input
                      className="ca-form-input"
                      type="url"
                      value={form.website}
                      onChange={set("website")}
                      placeholder="https://www.example.com"
                    />
                  </div>
                  <div className="ca-form-field ca-form-field--full">
                    <label className="ca-form-label">
                      Company address <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.companyAddress}
                      onChange={set("companyAddress")}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      City <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.city}
                      onChange={set("city")}
                      placeholder="e.g. Grays"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Postcode <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.postcode}
                      onChange={set("postcode")}
                      placeholder="e.g. RM17 6NN"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 2 ── */}
              <div className="ca-form-block">
                <div className="ca-form-block-title">02 — Your Contact Details</div>
                <div className="ca-form-grid">
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Your full name <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.contactName}
                      onChange={set("contactName")}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">Job title</label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.jobTitle}
                      onChange={set("jobTitle")}
                      placeholder="e.g. Operations Manager"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Work email <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Phone number <span>*</span>
                    </label>
                    <input
                      className="ca-form-input"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="e.g. 07700 900000"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 3 ── */}
              <div className="ca-form-block">
                <div className="ca-form-block-title">03 — Your Transport Requirements</div>
                <div className="ca-form-grid">
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Estimated journeys per month <span>*</span>
                    </label>
                    <select
                      className="ca-form-input"
                      value={form.estimatedMonthlyJourneys}
                      onChange={set("estimatedMonthlyJourneys")}
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1 – 10 journeys</option>
                      <option value="11-25">11 – 25 journeys</option>
                      <option value="26-50">26 – 50 journeys</option>
                      <option value="51-100">51 – 100 journeys</option>
                      <option value="100+">100+ journeys</option>
                    </select>
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">Typical passenger numbers</label>
                    <select
                      className="ca-form-input"
                      value={form.numberOfPassengers}
                      onChange={set("numberOfPassengers")}
                    >
                      <option value="">Select range</option>
                      <option value="1-5">1 – 5 per journey</option>
                      <option value="6-15">6 – 15 per journey</option>
                      <option value="16-30">16 – 30 per journey</option>
                      <option value="30+">30+ per journey</option>
                    </select>
                  </div>
                  <div className="ca-form-field ca-form-field--full">
                    <label className="ca-form-label">
                      Types of journeys needed <span>*</span>
                    </label>
                    <div className="ca-check-group">
                      {JOURNEY_TYPE_OPTIONS.map((opt) => (
                        <label className="ca-check-item" key={opt.value}>
                          <input
                            type="checkbox"
                            checked={form.journeyTypes.includes(opt.value)}
                            onChange={() => toggleJourneyType(opt.value)}
                          />
                          <span className="ca-check-pill">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">
                      Preferred billing <span>*</span>
                    </label>
                    <select
                      className="ca-form-input"
                      value={form.preferredBilling}
                      onChange={set("preferredBilling")}
                    >
                      <option value="monthly">Monthly invoice</option>
                      <option value="weekly">Weekly invoice</option>
                      <option value="per_journey">Per journey</option>
                    </select>
                  </div>
                  <div className="ca-form-field">
                    <label className="ca-form-label">Preferred start date</label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.contractStartDate}
                      onChange={set("contractStartDate")}
                      placeholder="e.g. ASAP or 1 September 2025"
                    />
                  </div>
                  <div className="ca-form-field ca-form-field--full">
                    <label className="ca-form-label">
                      Currently using another provider?
                    </label>
                    <input
                      className="ca-form-input"
                      type="text"
                      value={form.existingProviderDetails}
                      onChange={set("existingProviderDetails")}
                      placeholder="Optional — name of current provider or 'None'"
                    />
                  </div>
                  <div className="ca-form-field ca-form-field--full">
                    <label className="ca-form-label">
                      Any additional requirements or notes
                    </label>
                    <textarea
                      className="ca-form-input ca-form-textarea"
                      value={form.additionalRequirements}
                      onChange={set("additionalRequirements")}
                      placeholder="e.g. child seats required, early morning shifts, specific collection points…"
                    />
                  </div>
                </div>
              </div>

              {validationError && (
                <div className="ca-form-error">{validationError}</div>
              )}
              {isError && (
                <div className="ca-form-error">
                  Something went wrong submitting your application. Please try again or
                  call us on{" "}
                  <a href={TEL} style={{ color: "#f87171" }}>
                    01375 383878
                  </a>
                  .
                </div>
              )}

              <div className="ca-form-submit-row">
                <p className="ca-form-note">
                  We'll review your application and contact you within one business day.
                  No commitment required.
                </p>
                <button
                  type="submit"
                  className="ca-submit-btn"
                  disabled={isPending}
                >
                  {isPending ? "Submitting…" : "Submit application →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
