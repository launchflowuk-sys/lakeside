import LegalPage, { type LegalSection } from "./LegalPage";

const UPDATED = "16 August 2026";

const sections: LegalSection[] = [
  {
    id: "about-us",
    heading: "About us",
    content: (
      <>
        <p>
          Lakeside &amp; Purfleet Taxis Ltd is a private hire operator licensed by
          Thurrock Council, trading in Thurrock, Essex since 1990. These terms apply to
          journeys booked with us, whether through this website, by phone or by WhatsApp.
        </p>
        <div className="lg-rows">
          <div className="lg-row">
            <span className="lg-row-term">Operator licence</span>
            <span className="lg-row-def">Available on request</span>
          </div>
          <div className="lg-row">
            <span className="lg-row-term">Company number</span>
            <span className="lg-row-def">06329710</span>
          </div>
          <div className="lg-row">
            <span className="lg-row-term">Registered office</span>
            <span className="lg-row-def">49a Orsett Road, Grays, Essex, RM17 5HJ</span>
          </div>
        </div>
        <p>
          As a private hire operator, all journeys must be booked in advance. Our
          vehicles cannot be hailed in the street or picked up from a taxi rank.
        </p>
      </>
    ),
  },
  {
    id: "booking-requests",
    heading: "Booking requests",
    content: (
      <>
        <p>
          Submitting a quote request through this website does not create a confirmed
          booking. It is a request. Your booking is confirmed only once we have contacted
          you, confirmed availability and price, and you have agreed to go ahead.
        </p>
        <p>
          We aim to come back to you within the hour during working hours. If your
          journey is urgent, please call <a href="tel:01375383878">01375 383878</a> rather
          than waiting for a reply.
        </p>
        <p>We may decline a booking request at our discretion.</p>
      </>
    ),
  },
  {
    id: "prices",
    heading: "Prices and quotes",
    content: (
      <>
        <p>
          <strong>Airport transfers have published fixed prices.</strong> The fares shown
          on our airport pages are the standard price for that journey in a standard
          saloon vehicle, from the Thurrock area, at ordinary times. They are not
          estimates.
        </p>
        <p>
          <strong>Every other journey is priced individually.</strong> Local journeys,
          school runs, cruise terminal transfers, long distance work and corporate travel
          are quoted by a member of our team, not calculated by a meter or by the website.
          There is no fare calculator and no instant online quote.
        </p>
        <p>A published or quoted price may change if:</p>
        <div className="lg-list">
          {[
            "You add stops, change the pickup or destination, or change the route",
            "You need a larger vehicle than a standard saloon",
            "There is significant waiting time beyond the agreed pickup",
            "The journey starts outside our usual area",
            "Tolls, congestion or clean air charges, or airport car park fees apply",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          Where a change affects the price, we will tell you before you incur it wherever
          it is practical to do so. Once a price is agreed for an unchanged journey, that
          is the price you pay.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    heading: "Payment",
    content: (
      <>
        <p>
          You can pay the driver on the day, or in advance by card using a payment link we
          send you by email or message.
        </p>
        <p>
          Card payments are processed by <strong>Square</strong>. When you follow a payment
          link you are taken to Square's own secure checkout page. We never see, handle or
          store your card details. Once payment completes you are returned to a
          confirmation page on our website.
        </p>
        <p>
          For account customers, journeys are invoiced under the billing terms agreed when
          the account is opened.
        </p>
        <p>
          Refunds for journeys paid in advance and then cancelled are handled under{" "}
          <a href="#cancellations">Cancellations and amendments</a> below. Refunds are
          returned to the card used to pay.
        </p>
      </>
    ),
  },
  {
    id: "cancellations",
    heading: "Cancellations and amendments",
    content: (
      <>
        <p>
          Please tell us as soon as you can if you need to cancel or change a confirmed
          booking. Call <a href="tel:01375383878">01375 383878</a> or message us on
          WhatsApp — these reach us faster than email.
        </p>
        <p>
          We may charge a cancellation fee where a confirmed booking is cancelled at short
          notice, or where a driver has already been dispatched. Any fee that applies to
          your booking will be confirmed to you at the time of booking.
        </p>
        <p>
          If we have to cancel your booking, you pay nothing and anything already paid is
          refunded in full.
        </p>
      </>
    ),
  },
  {
    id: "punctuality",
    heading: "Punctuality and delays",
    content: (
      <>
        <p>
          We take punctuality seriously, particularly for airport departures, and we aim
          to arrive at the agreed time on every journey. For flights we recommend building
          in sensible contingency, and we are happy to advise on pickup times.
        </p>
        <p>
          We cannot accept liability for delays or a failure to complete a journey caused
          by circumstances outside our reasonable control, including:
        </p>
        <div className="lg-list">
          {[
            "Exceptional traffic, accidents, road closures or Dartford Crossing incidents",
            "Severe weather",
            "Vehicle breakdown",
            "Events beyond our reasonable control",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          Where a significant delay is our fault, we will contact you as soon as we can and
          do what we reasonably can to put it right.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    heading: "Passengers and conduct",
    content: (
      <>
        <p>
          Seatbelts must be worn where fitted. Please treat our drivers and vehicles with
          respect.
        </p>
        <p>
          Our drivers may refuse or end a journey where a passenger's behaviour is unsafe,
          abusive or illegal. Where that happens, the full fare remains payable. Damage
          caused to a vehicle by a passenger, including soiling, will be charged at cost.
        </p>
        <p>
          Assistance dogs are always welcome. Please tell us about other animals, child
          seats, wheelchairs or accessibility needs when booking so we can send a suitable
          vehicle.
        </p>
        <p>Smoking and vaping are not permitted in our vehicles.</p>
      </>
    ),
  },
  {
    id: "luggage",
    heading: "Luggage and lost property",
    content: (
      <>
        <p>
          Please tell us how much luggage you have when booking, so we send a vehicle that
          fits it. We cannot guarantee to carry more than was agreed.
        </p>
        <p>
          Passengers are responsible for their own belongings. We do not accept liability
          for loss or damage to luggage or personal property except where it results from
          our negligence.
        </p>
        <p>
          If you think you have left something in one of our vehicles, contact us as soon
          as possible on <a href="tel:01375383878">01375 383878</a> or{" "}
          <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> and we will
          do what we reasonably can to reunite you with it.
        </p>
      </>
    ),
  },
  {
    id: "complaints",
    heading: "Complaints",
    content: (
      <>
        <p>
          If something goes wrong, please tell us. Email{" "}
          <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> or call{" "}
          <a href="tel:01375383878">01375 383878</a> with your journey date, pickup and
          destination, and we will look into it.
        </p>
        <p>
          If we cannot resolve it between us, you can raise the matter with our licensing
          authority, Thurrock Council, who license both our operation and our drivers.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Liability",
    content: (
      <>
        <p>
          Nothing in these terms limits our liability for death or personal injury caused
          by our negligence, for fraud, or for anything else that cannot be limited by
          law. Your statutory rights as a consumer are not affected.
        </p>
        <p>
          Subject to that, our liability in connection with a journey is limited to the
          price of that journey.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law",
    content: (
      <p>
        These terms are governed by the law of England and Wales, and disputes are subject
        to the exclusive jurisdiction of the courts of England and Wales.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      metaDescription="Terms and conditions for booking a journey with Lakeside & Purfleet Taxis Ltd, a private hire operator in Thurrock, Essex — pricing, payment, cancellations and liability."
      canonicalPath="/terms"
      updated={UPDATED}
      intro={
        <p>
          These are the terms you are agreeing to when you book a journey with us. They
          are written to be read, not to be impenetrable — if anything here is unclear,
          call us and ask.
        </p>
      }
      sections={sections}
      related={[
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/cookie-policy", label: "Cookie Policy" },
      ]}
    />
  );
}
