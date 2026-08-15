import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useGetPublicQuote, useAcceptQuote } from "@workspace/api-client-react";
import Layout from "@/components/layout/Layout";
import { BUSINESS } from "@/lib/constants";
import { IconBriefcase, IconCheck, IconPhone, IconPound, IconShield } from "@/components/icons/Icons";
import {
  IconAmex,
  IconApplePay,
  IconGooglePay,
  IconLock,
  IconMaestro,
  IconMastercard,
  IconVisa,
} from "@/components/icons/PaymentIcons";
import "./quote-page.css";

const PHONE = BUSINESS.phone;
const WHATSAPP_URL = BUSINESS.whatsappHref;

const journeyLabel: Record<string, string> = {
  local: "Local Journey", airport: "Airport Transfer", school_run: "School Run",
  corporate: "Corporate Journey", long_distance: "Long Distance", cruise_terminal: "Cruise Terminal", other: "Journey",
};

function QuoteDetail({ quoteRef }: { quoteRef: string }) {
  const { data: quote, isLoading, isError } = useGetPublicQuote(quoteRef);
  const acceptQuote = useAcceptQuote();
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState("");

  const handleAccept = () => {
    acceptQuote.mutate({ ref: quoteRef }, {
      onSuccess: () => setAccepted(true),
      onError: (err: any) => setAcceptError(err?.response?.data?.error ?? "Something went wrong. Please call us."),
    });
  };

  if (isLoading) {
    return (
      <div className="qp-loading">
        <div className="qp-spinner" />
        <p>Loading your quote...</p>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="qp-error">
        <div className="qp-error-icon">?</div>
        <h2>Quote Not Found</h2>
        <p>We couldn't find a quote with that reference. Please double-check the code or contact us directly.</p>
        <div className="qp-error-ctas">
          <a href={`tel:${PHONE}`} className="qp-btn-primary">Call Us</a>
          <a href={WHATSAPP_URL} className="qp-btn-whatsapp">WhatsApp</a>
        </div>
      </div>
    );
  }

  const isExpired = quote.validUntil < new Date().toISOString().split("T")[0];
  const isPaid = quote.status === "paid";
  const isAccepted = !isPaid && (quote.status === "accepted" || accepted);
  const isCancelled = quote.status === "cancelled";
  const isPending = !isPaid && !isAccepted && !isCancelled && !isExpired;

  const validUntilFormatted = new Date(quote.validUntil + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const journeyDateFormatted = new Date(quote.journeyDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="qp-card">
      {/* Header */}
      <div className="qp-card-header">
        <div className="qp-logo-row">
          <span className="qp-brand">Lakeside &amp; Purfleet Taxis</span>
          <span className={`qp-status-badge qp-status-${isPaid ? "paid" : isAccepted ? "accepted" : isExpired ? "expired" : isCancelled ? "cancelled" : "pending"}`}>
            {isPaid ? "Paid" : isAccepted ? "Accepted" : isExpired ? "Expired" : isCancelled ? "Cancelled" : "Awaiting Acceptance"}
          </span>
        </div>
        <div className="qp-ref-row">
          <span className="qp-ref-label">Quote Reference</span>
          <span className="qp-ref-value">{quote.quoteRef}</span>
        </div>
        <p className="qp-header-sub">Prepared for {quote.customerName}</p>
      </div>

      {/* Price */}
      <div className="qp-price-block">
        <span className="qp-price-label">Your Price</span>
        <span className="qp-price-value">{quote.price}</span>
        {quote.priceNotes && <p className="qp-price-notes">{quote.priceNotes}</p>}
        <p className="qp-valid-until">
          {isExpired ? "This quote expired on " : "Valid until "}
          <strong>{validUntilFormatted}</strong>
        </p>
      </div>

      {/* Journey Details */}
      <div className="qp-section">
        <h3 className="qp-section-title">Journey Details</h3>
        <div className="qp-detail-grid">
          <div className="qp-detail-item">
            <span className="qp-detail-label">Journey Type</span>
            <span className="qp-detail-value">{journeyLabel[quote.journeyType] ?? quote.journeyType}</span>
          </div>
          <div className="qp-detail-item">
            <span className="qp-detail-label">Passengers</span>
            <span className="qp-detail-value">{quote.passengers}</span>
          </div>
          <div className="qp-detail-item qp-detail-full">
            <span className="qp-detail-label">Pickup</span>
            <span className="qp-detail-value">{quote.pickupLocation}</span>
          </div>
          <div className="qp-detail-item qp-detail-full">
            <span className="qp-detail-label">Destination</span>
            <span className="qp-detail-value">{quote.destination}</span>
          </div>
          {quote.viaStops && (
            <div className="qp-detail-item qp-detail-full">
              <span className="qp-detail-label">Via</span>
              <span className="qp-detail-value">{quote.viaStops}</span>
            </div>
          )}
          <div className="qp-detail-item">
            <span className="qp-detail-label">Date</span>
            <span className="qp-detail-value">{quote.journeyDate}</span>
          </div>
          <div className="qp-detail-item">
            <span className="qp-detail-label">Time</span>
            <span className="qp-detail-value">{quote.journeyTime}</span>
          </div>
          {quote.returnRequired === "yes" && quote.returnDate && (
            <>
              <div className="qp-detail-item">
                <span className="qp-detail-label">Return Date</span>
                <span className="qp-detail-value">{quote.returnDate}</span>
              </div>
              {quote.returnTime && (
                <div className="qp-detail-item">
                  <span className="qp-detail-label">Return Time</span>
                  <span className="qp-detail-value">{quote.returnTime}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Options */}
      <div className="qp-section">
        <h3 className="qp-section-title">Payment Options</h3>
        <div className="qp-payment-options">
          {quote.paymentCash === "yes" && (
            <div className="qp-payment-option">
              <span className="qp-payment-icon"><IconPound size={20} /></span>
              <div>
                <p className="qp-payment-name">Cash on the Day</p>
                <p className="qp-payment-sub">Pay your driver directly in cash</p>
              </div>
            </div>
          )}
          {quote.paymentCard === "yes" && (
            <div className="qp-payment-option">
              <span className="qp-payment-icon"><IconShield size={20} /></span>
              <div>
                <p className="qp-payment-name">Card Payment</p>
                <p className="qp-payment-sub">Pay by debit or credit card</p>
              </div>
            </div>
          )}
          {quote.paymentBankTransfer === "yes" && (
            <div className="qp-payment-option">
              <span className="qp-payment-icon"><IconBriefcase size={20} /></span>
              <div>
                <p className="qp-payment-name">Bank Transfer</p>
                <p className="qp-payment-sub">Transfer directly to our account</p>
                {(quote.bankAccountName || quote.bankSortCode || quote.bankAccountNumber) && (
                  <div className="qp-bank-details">
                    {quote.bankAccountName && <p><span>Account Name:</span> {quote.bankAccountName}</p>}
                    {quote.bankSortCode && <p><span>Sort Code:</span> {quote.bankSortCode}</p>}
                    {quote.bankAccountNumber && <p><span>Account Number:</span> {quote.bankAccountNumber}</p>}
                    <p className="qp-bank-ref-note">Please use <strong>{quote.quoteRef}</strong> as your payment reference.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay Online — the block we most want acted on, so it gets its own
          panel rather than sitting as one more row in the page. The trust
          layer (encryption, card marks, who handles the card) sits directly
          under the button, which is where the hesitation actually happens. */}
      {quote.squarePaymentLinkUrl && (isPending || isAccepted) && (
        <div className="qp-pay" data-testid="pay-online-block">
          <span className="qp-pay-eyebrow">
            <IconLock size={13} strokeWidth={2.3} />
            Secure online payment
          </span>
          <h3 className="qp-pay-title">Pay now and your booking is done</h3>
          <p className="qp-pay-sub">
            Settle the fare in under a minute by card, Apple&nbsp;Pay or Google&nbsp;Pay — nothing to pay the driver
            on the day, and your confirmation is instant.
          </p>

          <div className="qp-pay-amount">
            <span className="qp-pay-amount-label">Amount to pay</span>
            <span className="qp-pay-amount-value">{quote.price}</span>
          </div>

          <a
            href={quote.squarePaymentLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qp-pay-btn"
            data-testid="pay-online-btn"
          >
            <IconLock size={18} strokeWidth={2.2} />
            <span>Pay {quote.price} securely</span>
          </a>

          <p className="qp-pay-encrypted">
            <IconShield size={14} />
            256-bit SSL encrypted · Card details never touch our website
          </p>

          <div className="qp-pay-marks" aria-label="Accepted payment methods">
            <IconVisa />
            <IconMastercard />
            <IconAmex />
            <IconMaestro />
            <IconApplePay />
            <IconGooglePay />
          </div>

          <ul className="qp-pay-trust">
            <li>
              <span className="qp-pay-trust-icon"><IconShield size={15} /></span>
              <span>
                <strong>Handled by Square</strong>
                Payment is taken on Square&apos;s own checkout — the same processor used by high-street shops
                worldwide. We never see or store your card number.
              </span>
            </li>
            <li>
              <span className="qp-pay-trust-icon"><IconPound size={15} /></span>
              <span>
                <strong>The price is fixed</strong>
                {quote.price} is the full fare for this journey. No booking fee, no card surcharge and no meter
                running on the day.
              </span>
            </li>
            <li>
              <span className="qp-pay-trust-icon"><IconCheck size={15} strokeWidth={2.4} /></span>
              <span>
                <strong>Instant written confirmation</strong>
                You&apos;re returned straight to our confirmation page with your booking details, and Square emails
                you a card receipt.
              </span>
            </li>
            <li>
              <span className="qp-pay-trust-icon"><IconPhone size={15} /></span>
              <span>
                <strong>A real local firm behind it</strong>
                Lakeside &amp; Purfleet Taxis has been trading in Thurrock since 1990. Reach a person on{" "}
                <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>, 24 hours a day.
              </span>
            </li>
          </ul>

          <p className="qp-pay-alt">
            Would rather not pay online? Cash and bank transfer are still fine — see the payment options above.
          </p>
        </div>
      )}

      {/* Admin message */}
      {quote.adminMessage && (
        <div className="qp-message">
          <p className="qp-message-label">A note from us</p>
          <p className="qp-message-text">{quote.adminMessage}</p>
        </div>
      )}

      {/* CTA */}
      {isPending && (
        <div className="qp-cta-block">
          <p className="qp-cta-label">Happy with this quote?</p>
          <button
            className="qp-btn-accept"
            onClick={handleAccept}
            disabled={acceptQuote.isPending}
          >
            {acceptQuote.isPending ? "Confirming..." : "Accept This Quote"}
          </button>
          {acceptError && <p className="qp-accept-error">{acceptError}</p>}
          <p className="qp-cta-sub">Accepting confirms you'd like to proceed. We'll then be in touch to confirm your booking.</p>
        </div>
      )}

      {isPaid && (
        <div className="qp-accepted-block">
          <div className="qp-accepted-icon"><IconCheck size={26} strokeWidth={2} /></div>
          <h3>Payment Received</h3>
          <p>Thank you! Your payment has been received — see you on {journeyDateFormatted}.</p>
          <div className="qp-accepted-ctas">
            <a href={`tel:${PHONE}`} className="qp-btn-primary">Call Us</a>
            <a href={WHATSAPP_URL} className="qp-btn-whatsapp">WhatsApp</a>
          </div>
        </div>
      )}

      {isAccepted && (
        <div className="qp-accepted-block">
          <div className="qp-accepted-icon"><IconCheck size={26} strokeWidth={2} /></div>
          <h3>Quote Accepted</h3>
          <p>Thank you! We've received your acceptance and will be in touch shortly to confirm your booking details.</p>
          <div className="qp-accepted-ctas">
            <a href={`tel:${PHONE}`} className="qp-btn-primary">Call Us</a>
            <a href={WHATSAPP_URL} className="qp-btn-whatsapp">WhatsApp</a>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="qp-expired-block">
          <p>This quote has expired. Please contact us for a new quote.</p>
          <div className="qp-expired-ctas">
            <a href={`tel:${PHONE}`} className="qp-btn-primary">Call for New Quote</a>
            <a href="/quote-request" className="qp-btn-outline">Request Online</a>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="qp-expired-block">
          <p>This quote has been cancelled. Please contact us if you need assistance.</p>
          <div className="qp-expired-ctas">
            <a href={`tel:${PHONE}`} className="qp-btn-primary">Contact Us</a>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="qp-card-footer">
        <p>Questions? Call us on <a href={`tel:${PHONE}`}>{PHONE}</a> or <a href={WHATSAPP_URL}>WhatsApp us</a></p>
      </div>
    </div>
  );
}

function QuoteLookup() {
  const [code, setCode] = useState("");
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = code.trim().toUpperCase();
    if (ref) navigate(`/quote/${ref}`);
  };

  return (
    <div className="qp-lookup">
      <div className="qp-lookup-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <h2>View Your Quote</h2>
      <p>Enter your quote reference code below. It looks like <strong>LPT-1234</strong> and was sent to you by our team.</p>
      <form onSubmit={handleSubmit} className="qp-lookup-form">
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="e.g. LPT-2847"
          className="qp-lookup-input"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" disabled={!code.trim()} className="qp-btn-accept">
          View Quote
        </button>
      </form>
      <div className="qp-lookup-divider">
        <span>Don't have a quote yet?</span>
      </div>
      <a href="/quote-request" className="qp-btn-outline qp-btn-full">Request a Free Quote</a>
    </div>
  );
}

export default function QuotePage() {
  const [, params] = useRoute("/quote/:ref");
  const ref = params?.ref;

  return (
    <Layout>
      <Helmet>
        <title>{ref ? `Quote ${ref} | Lakeside & Purfleet Taxis` : "View Your Quote | Lakeside & Purfleet Taxis"}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="qp-section-outer">
        <div className="qp-inner">
          {ref ? <QuoteDetail quoteRef={ref} /> : <QuoteLookup />}
        </div>
      </section>
    </Layout>
  );
}
