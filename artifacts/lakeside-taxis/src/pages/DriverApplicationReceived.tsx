import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import { IconCheck, IconMessage, IconPhone } from "@/components/icons/Icons";
import { BUSINESS } from "@/lib/constants";
// Shares the thank-you stylesheet deliberately: this is the same moment in a
// different flow, and both confirmations should look identical.
import "./thank-you.css";

const steps = [
  {
    n: "1",
    t: "We review your application",
    d: "A member of the team goes through your details and the documents you uploaded. This usually takes a couple of working days.",
  },
  {
    n: "2",
    t: "We give you a call",
    d: "We talk through the work, the hours that suit you, and anything still outstanding — including documents you couldn't upload at the time.",
  },
  {
    n: "3",
    t: "Licence and document checks",
    d: "We verify your private hire badge, DBS and insurance. If you aren't licensed yet, this is where we walk you through what the council needs.",
  },
  {
    n: "4",
    t: "Getting you started",
    d: "Once the paperwork is in order we sort your induction and get you on the road.",
  },
];

export default function DriverApplicationReceived() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Driver Application Received | Lakeside &amp; Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="ty-wrap" ref={scope}>
        <div className="ty-inner" data-testid="driver-application-received-page">
          <div className="ty-card">
            <div className="ty-icon">
              <IconCheck size={30} strokeWidth={2} />
            </div>
            <span className="ty-eyebrow">Application received</span>
            <h1 className="ty-title">
              Thanks — we&apos;ve got your <span>application</span>
            </h1>
            <p className="ty-body">
              Your application has been sent to Lakeside &amp; Purfleet Taxis, along with
              any documents you uploaded. We&apos;ve also emailed you a confirmation — if
              it isn&apos;t in your inbox, please check your spam folder.
            </p>
            <div className="ty-notice">
              This is <strong>not an offer of work</strong> yet. We&apos;ll review your
              application and speak to you before anything is agreed.
            </div>
            <div className="ty-actions">
              <a href={BUSINESS.phoneTel} className="ty-btn ty-btn-primary">
                <IconPhone size={17} />
                {BUSINESS.phone}
              </a>
              <a
                href={BUSINESS.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ty-btn ty-btn-whatsapp"
              >
                <IconMessage size={17} />
                WhatsApp us
              </a>
              <Link href="/" className="ty-btn ty-btn-quiet">
                Back to home
              </Link>
            </div>
          </div>

          <div className="ty-next">
            <div className="ty-next-title">What happens next</div>
            <div className="ty-steps">
              {steps.map((s) => (
                <div className="ty-step" key={s.n}>
                  <span className="ty-step-num" aria-hidden="true">
                    {s.n}
                  </span>
                  <div>
                    <div className="ty-step-title">{s.t}</div>
                    <div className="ty-step-desc">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ty-next-footer">
              Still need to send us a document? Reply to the confirmation email, or call{" "}
              <a href={BUSINESS.phoneTel}>{BUSINESS.phone}</a> and we&apos;ll sort it.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
