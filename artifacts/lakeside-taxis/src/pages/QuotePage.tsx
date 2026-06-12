import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useGetPublicQuote, useAcceptQuote } from "@workspace/api-client-react";
import Layout from "@/components/layout/Layout";
import { BUSINESS } from "@/lib/constants";
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
          <a href={WHATSAPP_URL} className="qp-btn-outline">WhatsApp</a>
        </div>
      </div>
    );
  }

  const isExpired = quote.validUntil < new Date().toISOString().split("T")[0];
  const isAccepted = quote.status === "accepted" || accepted;
  const isCancelled = quote.status === "cancelled";
  const isPending = !isAccepted && !isCancelled && !isExpired;

  const validUntilFormatted = new Date(quote.validUntil + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="qp-card">
      {/* Header */}
      <div className="qp-card-header">
        <div className="qp-logo-row">
          <span className="qp-brand">Lakeside &amp; Purfleet Taxis</span>
          <span className={`qp-status-badge qp-status-${isAccepted ? "accepted" : isExpired ? "expired" : isCancelled ? "cancelled" : "pending"}`}>
            {isAccepted ? "Accepted" : isExpired ? "Expired" : isCancelled ? "Cancelled" : "Awaiting Acceptance"}
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
              <span className="qp-payment-icon">💵</span>
              <div>
                <p className="qp-payment-name">Cash on the Day</p>
                <p className="qp-payment-sub">Pay your driver directly in cash</p>
              </div>
            </div>
          )}
          {quote.paymentCard === "yes" && (
            <div className="qp-payment-option">
              <span className="qp-payment-icon">💳</span>
              <div>
                <p className="qp-payment-name">Card Payment</p>
                <p className="qp-payment-sub">Pay by debit or credit card</p>
              </div>
            </div>
          )}
          {quote.paymentBankTransfer === "yes" && (
            <div className="qp-payment-option">
              <span className="qp-payment-icon">🏦</span>
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

      {isAccepted && (
        <div className="qp-accepted-block">
          <div className="qp-accepted-icon">✓</div>
          <h3>Quote Accepted</h3>
          <p>Thank you! We've received your acceptance and will be in touch shortly to confirm your booking details.</p>
          <div className="qp-accepted-ctas">
            <a href={`tel:${PHONE}`} className="qp-btn-primary">Call Us</a>
            <a href={WHATSAPP_URL} className="qp-btn-outline">WhatsApp</a>
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
