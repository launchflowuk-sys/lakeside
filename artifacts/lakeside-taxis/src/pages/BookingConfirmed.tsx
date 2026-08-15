import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { getGetPublicQuoteQueryKey, useGetPublicQuote } from "@workspace/api-client-react";
import Layout from "@/components/layout/Layout";
import { BUSINESS } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import {
  IconCheck,
  IconClock,
  IconMessage,
  IconPhone,
  IconPin,
  IconPlaneLanding,
  IconShip,
  IconUsers,
} from "@/components/icons/Icons";
import "./booking-confirmed.css";

/* Where Square sends the customer after a successful payment — see
   checkoutOptions.redirectUrl in api-server/src/lib/square.ts. Square appends
   its own params (checkoutId, orderId, transactionId, referenceId), which we
   ignore: the quote ref in the path is the key, and the live quote is read
   back from the API rather than trusted from the URL. */

const journeyLabel: Record<string, string> = {
  local: "Local journey",
  airport: "Airport transfer",
  school_run: "School run",
  corporate: "Corporate journey",
  long_distance: "Long distance",
  cruise_terminal: "Cruise terminal transfer",
  other: "Journey",
};

/* The webhook that marks a quote paid arrives from Square's servers on its own
   schedule, so the customer can land here a few seconds ahead of our own
   record. Poll for it, but stop after this long and tell them plainly rather
   than spinning forever. */
const CONFIRM_POLL_MS = 3_000;
const CONFIRM_TIMEOUT_MS = 45_000;

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* A floating (no timezone) ICS date-time — calendars read it as local time,
   which is what a UK pickup time means to the customer. Journey times are
   stored as "HH:MM" strings; anything unparseable falls back to 09:00 rather
   than producing an invalid file. */
function icsStamp(dateIso: string, time: string, addMinutes = 0): string {
  const [h, m] = (time.match(/^(\d{1,2}):(\d{2})/)?.slice(1) ?? ["9", "00"]).map(Number);
  const d = new Date(`${dateIso}T00:00:00`);
  d.setHours(h, m + addMinutes, 0, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

function icsEscape(text: string): string {
  return text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

interface CalendarBooking {
  quoteRef: string;
  pickupLocation: string;
  destination: string;
  journeyDate: string;
  journeyTime: string;
}

function downloadCalendarFile(b: CalendarBooking): void {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lakeside & Purfleet Taxis//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.quoteRef}@lakesidetaxi.co.uk`,
    `DTSTART:${icsStamp(b.journeyDate, b.journeyTime)}`,
    `DTEND:${icsStamp(b.journeyDate, b.journeyTime, 60)}`,
    `SUMMARY:${icsEscape(`Taxi to ${b.destination}`)}`,
    `LOCATION:${icsEscape(b.pickupLocation)}`,
    `DESCRIPTION:${icsEscape(
      `Lakeside & Purfleet Taxis — booking ${b.quoteRef}\nPickup: ${b.pickupLocation}\nDestination: ${b.destination}\nAny changes: ${BUSINESS.phone}`,
    )}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT60M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Taxi pickup in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taxi-booking-${b.quoteRef}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ContactActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bc-actions${compact ? " bc-actions-compact" : ""}`}>
      <a href={BUSINESS.phoneTel} className="bc-btn bc-btn-primary" data-testid="confirmed-call-btn">
        <IconPhone size={17} />
        {BUSINESS.phone}
      </a>
      <a
        href={BUSINESS.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="bc-btn bc-btn-whatsapp"
        data-testid="confirmed-whatsapp-btn"
      >
        <IconMessage size={17} />
        WhatsApp us
      </a>
    </div>
  );
}

/* ── Ad-hoc payment links carry no quote ref, so there is no journey to show.
   Confirm the payment, give them the phone number, and stop there rather than
   inventing booking details we don't have. ── */
function GenericConfirmation() {
  return (
    <div className="bc-card bc-status">
      <div className="bc-status-icon">
        <IconCheck size={30} strokeWidth={2} />
      </div>
      <span className="bc-eyebrow">Payment received</span>
      <h1 className="bc-title">Thank you — your payment went through</h1>
      <p className="bc-lede">
        Square has taken your payment and will email you a card receipt. Our team has been notified and will be in
        touch to confirm the details of your journey.
      </p>
      <div className="bc-notice">
        Any questions about this payment? Call us on <a href={BUSINESS.phoneTel}>{BUSINESS.phone}</a> — we&apos;re
        here 24 hours a day.
      </div>
      <ContactActions />
      <Link href="/" className="bc-back">Back to home</Link>
    </div>
  );
}

function ConfirmedBooking({ quoteRef }: { quoteRef: string }) {
  const [pollTimedOut, setPollTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPollTimedOut(true), CONFIRM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  // queryKey is restated because the generated options type requires it, even
  // though the hook falls back to getGetPublicQuoteQueryKey(ref) itself.
  const { data: quote, isLoading, isError } = useGetPublicQuote(quoteRef, {
    query: {
      queryKey: getGetPublicQuoteQueryKey(quoteRef),
      refetchInterval: (query) => {
        const current = query.state.data;
        if (!current || current.status === "paid") return false;
        return pollTimedOut ? false : CONFIRM_POLL_MS;
      },
    },
  });

  if (isLoading) {
    return (
      <div className="bc-card bc-loading">
        <div className="bc-spinner" aria-hidden="true" />
        <p>Confirming your payment…</p>
      </div>
    );
  }

  /* The payment itself succeeded — Square only redirects here on success — so
     a lookup failure is our problem to own, not a reason to worry them. */
  if (isError || !quote) {
    return (
      <div className="bc-card bc-status">
        <div className="bc-status-icon bc-status-icon-quiet">
          <IconCheck size={30} strokeWidth={2} />
        </div>
        <span className="bc-eyebrow">Payment received</span>
        <h1 className="bc-title">Your payment went through</h1>
        <p className="bc-lede">
          We couldn&apos;t load the booking details for reference <strong>{quoteRef}</strong> just now, but your
          payment has been taken and Square will email your receipt. Give us a call and we&apos;ll confirm everything
          over the phone.
        </p>
        <ContactActions />
        <Link href="/" className="bc-back">Back to home</Link>
      </div>
    );
  }

  const isPaid = quote.status === "paid";
  const isAirport = quote.journeyType === "airport";
  const isCruise = quote.journeyType === "cruise_terminal";
  const hasReturn = quote.returnRequired === "yes" && !!quote.returnDate;

  const steps = [
    {
      icon: <IconCheck size={16} strokeWidth={2.4} />,
      t: "Your payment is logged against this booking",
      d: `Reference ${quote.quoteRef} is now marked as paid on our system. Square emails your card receipt separately.`,
    },
    {
      icon: <IconPhone size={16} strokeWidth={2.2} />,
      t: "We confirm your booking with you",
      d: "A member of our team checks the details and confirms your pickup — by phone or message, whichever suits you.",
    },
    {
      icon: <IconUsers size={16} strokeWidth={2.2} />,
      t: "Your driver is assigned",
      d: "We allocate a driver for your date and time and hold the slot for you. Nothing else is needed from you.",
    },
    {
      icon: <IconClock size={16} strokeWidth={2.2} />,
      t: "Your driver arrives on the day",
      d: "They'll be at your pickup point at the agreed time and will call or text when they're outside.",
    },
  ];

  return (
    <>
      {/* ── 1. Status ── */}
      <div className="bc-card bc-status" data-testid="booking-confirmed">
        <div className={`bc-status-icon${isPaid ? "" : " bc-status-icon-quiet"}`}>
          <IconCheck size={30} strokeWidth={2} />
        </div>
        <span className="bc-eyebrow">{isPaid ? "Payment confirmed" : "Payment received"}</span>
        <h1 className="bc-title">
          {isPaid ? "Your booking is paid and confirmed" : "Thank you — we're confirming your payment"}
        </h1>
        <p className="bc-lede">
          {isPaid ? (
            <>
              Thanks {quote.customerName.split(" ")[0]}. We&apos;ve got your payment for reference{" "}
              <strong>{quote.quoteRef}</strong>, your journey is booked in, and our team will be in touch to confirm
              the final details.
            </>
          ) : (
            <>
              Your payment has gone through at Square and we&apos;re waiting for it to land on our system — this
              usually takes a few seconds. Your reference is <strong>{quote.quoteRef}</strong>.
            </>
          )}
        </p>

        {!isPaid && !pollTimedOut && (
          <div className="bc-pending" role="status">
            <div className="bc-spinner bc-spinner-sm" aria-hidden="true" />
            Checking for confirmation…
          </div>
        )}

        {!isPaid && pollTimedOut && (
          <div className="bc-notice bc-notice-warn">
            Your payment hasn&apos;t appeared on our system yet. It can occasionally take a few minutes. Nothing is
            lost — give us a ring on <a href={BUSINESS.phoneTel}>{BUSINESS.phone}</a> with reference{" "}
            <strong>{quote.quoteRef}</strong> and we&apos;ll confirm it for you straight away.
          </div>
        )}

        <dl className="bc-receipt">
          <div className="bc-receipt-item">
            <dt>Amount paid</dt>
            <dd className="bc-receipt-amount">{quote.price}</dd>
          </div>
          <div className="bc-receipt-item">
            <dt>Booking reference</dt>
            <dd className="bc-receipt-ref">{quote.quoteRef}</dd>
          </div>
          <div className="bc-receipt-item">
            <dt>{isPaid ? "Confirmed" : "Status"}</dt>
            <dd>{isPaid ? (quote.paidAt ? formatDateTime(quote.paidAt) : "Paid") : "Awaiting confirmation"}</dd>
          </div>
        </dl>
      </div>

      {/* ── 2. The journey ── */}
      <section className="bc-card">
        <h2 className="bc-card-title">Your journey</h2>

        <div className="bc-route">
          <div className="bc-route-point">
            <span className="bc-route-dot bc-route-dot-start" aria-hidden="true" />
            <div>
              <span className="bc-route-label">Pickup</span>
              <span className="bc-route-value">{quote.pickupLocation}</span>
            </div>
          </div>
          {quote.viaStops && (
            <div className="bc-route-point">
              <span className="bc-route-dot bc-route-dot-via" aria-hidden="true" />
              <div>
                <span className="bc-route-label">Via</span>
                <span className="bc-route-value">{quote.viaStops}</span>
              </div>
            </div>
          )}
          <div className="bc-route-point">
            <span className="bc-route-dot bc-route-dot-end" aria-hidden="true">
              <IconPin size={11} strokeWidth={2.4} />
            </span>
            <div>
              <span className="bc-route-label">Destination</span>
              <span className="bc-route-value">{quote.destination}</span>
            </div>
          </div>
        </div>

        <dl className="bc-facts">
          <div className="bc-fact">
            <dt>Date</dt>
            <dd>{formatDate(quote.journeyDate)}</dd>
          </div>
          <div className="bc-fact">
            <dt>Pickup time</dt>
            <dd className="bc-fact-strong">{quote.journeyTime}</dd>
          </div>
          <div className="bc-fact">
            <dt>Passengers</dt>
            <dd>{quote.passengers}</dd>
          </div>
          <div className="bc-fact">
            <dt>Journey type</dt>
            <dd>{journeyLabel[quote.journeyType] ?? quote.journeyType}</dd>
          </div>
          {hasReturn && (
            <>
              <div className="bc-fact">
                <dt>Return date</dt>
                <dd>{formatDate(quote.returnDate as string)}</dd>
              </div>
              {quote.returnTime && (
                <div className="bc-fact">
                  <dt>Return time</dt>
                  <dd className="bc-fact-strong">{quote.returnTime}</dd>
                </div>
              )}
            </>
          )}
        </dl>

        {quote.priceNotes && <p className="bc-note">{quote.priceNotes}</p>}
        {quote.adminMessage && <p className="bc-note">{quote.adminMessage}</p>}

        <button
          type="button"
          className="bc-btn bc-btn-quiet bc-btn-inline"
          data-testid="add-to-calendar"
          onClick={() =>
            downloadCalendarFile({
              quoteRef: quote.quoteRef,
              pickupLocation: quote.pickupLocation,
              destination: quote.destination,
              journeyDate: quote.journeyDate,
              journeyTime: quote.journeyTime,
            })
          }
        >
          <IconClock size={16} />
          Add to my calendar
        </button>
      </section>

      {/* ── 3. What happens next ── */}
      <section className="bc-card">
        <h2 className="bc-card-title">What happens next</h2>
        <ol className="bc-steps">
          {steps.map((s, i) => (
            <li className="bc-step" key={s.t}>
              <span className={`bc-step-icon${i === 0 && isPaid ? " bc-step-icon-done" : ""}`} aria-hidden="true">
                {s.icon}
              </span>
              <div>
                <span className="bc-step-title">{s.t}</span>
                <span className="bc-step-desc">{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 4. On the day ── */}
      <section className="bc-card">
        <h2 className="bc-card-title">On the day</h2>
        <ul className="bc-tips">
          <li>
            <span className="bc-tip-icon" aria-hidden="true"><IconClock size={15} /></span>
            Your driver aims to arrive a few minutes early. Please be ready at{" "}
            <strong>{quote.journeyTime}</strong> so the run stays on time.
          </li>
          <li>
            <span className="bc-tip-icon" aria-hidden="true"><IconPhone size={15} /></span>
            The driver will call or text you when they&apos;re outside. Keep your phone to hand.
          </li>
          {isAirport && (
            <li>
              <span className="bc-tip-icon" aria-hidden="true"><IconPlaneLanding size={15} /></span>
              Flying back with us? Send your flight number when you speak to the team — we track the landing time and
              adjust the pickup if the flight moves.
            </li>
          )}
          {isCruise && (
            <li>
              <span className="bc-tip-icon" aria-hidden="true"><IconShip size={15} /></span>
              For Tilbury cruise pickups, let us know your ship and docking time and we&apos;ll set the collection
              around it.
            </li>
          )}
          <li>
            <span className="bc-tip-icon" aria-hidden="true"><IconUsers size={15} /></span>
            Travelling with extra luggage, a child seat or more passengers than booked? Tell us in advance so the
            right vehicle is sent.
          </li>
          <li>
            <span className="bc-tip-icon" aria-hidden="true"><IconPin size={15} /></span>
            Pickup is from <strong>{quote.pickupLocation}</strong>. If the exact door or entrance is tricky to find,
            mention it when we call.
          </li>
        </ul>
      </section>

      {/* ── 5. Changes and help ── */}
      <section className="bc-card bc-help">
        <h2 className="bc-card-title">Need to change or cancel?</h2>
        <p className="bc-help-body">
          Plans change — that&apos;s fine. Call or message us with reference <strong>{quote.quoteRef}</strong> and
          we&apos;ll move your booking. The sooner you tell us, the easier it is to re-arrange. We answer 24 hours a
          day, every day of the year.
        </p>
        <ContactActions />
        <p className="bc-help-foot">
          You can view this booking again at any time at{" "}
          <Link href={`/quote/${quote.quoteRef}`}>your quote page</Link>. Keep reference{" "}
          <strong>{quote.quoteRef}</strong> handy — it&apos;s all we need to find you.
        </p>
        <Link href="/" className="bc-back">Back to home</Link>
      </section>
    </>
  );
}

export default function BookingConfirmed() {
  const [, params] = useRoute("/booking-confirmed/:ref");
  const scope = useReveal<HTMLDivElement>();
  const ref = params?.ref;

  return (
    <Layout>
      <Helmet>
        <title>Booking Confirmed | Lakeside &amp; Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="bc-wrap" ref={scope}>
        <div className="bc-inner">
          {ref ? <ConfirmedBooking quoteRef={ref} /> : <GenericConfirmation />}
        </div>
      </div>
    </Layout>
  );
}
