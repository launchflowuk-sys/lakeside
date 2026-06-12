import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./legal.css";

export default function Terms() {
  const updated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" });

  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Terms and conditions for Lakeside & Purfleet Taxis Ltd, Thurrock, Essex." />
      </Helmet>

      <section className="lg-hero">
        <div className="lg-inner">
          <nav className="lg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Terms &amp; Conditions</span>
          </nav>
          <span className="lg-hero-tag">Legal</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="lg-hero-meta">
            <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> · Last updated: {updated}
          </p>
        </div>
      </section>

      <div className="lg-body">
        <div className="lg-inner">
          <div className="lg-doc">

            <div className="lg-content">

              <div className="lg-section">
                <span className="lg-section-num">Section 1</span>
                <h2>Booking requests</h2>
                <p>
                  Submitting a booking request through our website does not constitute a confirmed booking. A booking is only confirmed once our team has contacted you, confirmed availability, provided pricing, and you have agreed to proceed.
                </p>
                <p>
                  We reserve the right to decline any booking request at our discretion.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 2</span>
                <h2>Pricing</h2>
                <p>
                  All prices are provided directly by our team following your booking request. We do not display prices on our website. The price quoted by our team is the fixed price you pay for the agreed journey.
                </p>
                <p>
                  Any additional stops, route changes, waiting time, or amendments to your journey after booking may affect the agreed price. Our team will inform you of any price adjustments before they are incurred where possible.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 3</span>
                <h2>Cancellations and amendments</h2>
                <p>
                  Cancellation and amendment policies will be confirmed by our team at the time of booking. Please contact us as soon as possible if you need to cancel or amend a confirmed booking.
                </p>
                <p>
                  We reserve the right to charge a cancellation fee for confirmed bookings cancelled at short notice. Details will be provided when your booking is confirmed.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 4</span>
                <h2>Passenger conduct</h2>
                <p>
                  Passengers are expected to behave respectfully and courteously towards our drivers and not cause damage to our vehicles. Seatbelts must be worn at all times where fitted.
                </p>
                <p>
                  We reserve the right to refuse to accept or to terminate a journey if a passenger's conduct is deemed unacceptable, unsafe, or abusive. In such cases, the full journey price remains payable.
                </p>
                <p>
                  Any damage caused to our vehicles by a passenger will be charged to that passenger at cost.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 5</span>
                <h2>Punctuality and exceptional circumstances</h2>
                <p>
                  We take punctuality seriously and aim to collect passengers at the agreed time on every occasion. However, we cannot be held liable for delays or failure to complete a journey caused by circumstances beyond our reasonable control, including but not limited to:
                </p>
                <div className="lg-list">
                  {[
                    "Exceptional traffic conditions or road closures",
                    "Severe weather conditions",
                    "Vehicle breakdown",
                    "Accidents or incidents on the road",
                    "Acts of God or force majeure events",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
                <p>
                  In the event of a significant delay caused by us, we will endeavour to contact you as soon as practicable.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 6</span>
                <h2>Luggage and lost property</h2>
                <p>
                  Passengers are responsible for their own luggage and personal belongings. We accept no liability for loss or damage to luggage or personal property during transit unless caused by our direct negligence.
                </p>
                <p>
                  If you believe you have left an item in one of our vehicles, please contact us as soon as possible at <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> or <a href="tel:01375383878">01375 383878</a> and we will make every reasonable effort to reunite you with your property.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 7</span>
                <h2>Governing law</h2>
                <p>
                  These terms and conditions are governed by the laws of England and Wales. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 8</span>
                <h2>Contact us</h2>
                <p>For any queries regarding these terms, please get in touch:</p>
                <div className="lg-list">
                  <div className="lg-list-item">Email: <a href="mailto:info@lakesidetaxi.co.uk" style={{ marginLeft: 6 }}>info@lakesidetaxi.co.uk</a></div>
                  <div className="lg-list-item">Phone: <a href="tel:01375383878" style={{ marginLeft: 6 }}>01375 383878</a></div>
                </div>
              </div>

              <div className="lg-contact-note">
                <span className="lg-contact-note-icon">📋</span>
                <div className="lg-contact-note-text">
                  <strong>Also see our other legal documents</strong>
                  <p>
                    Read our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/cookie-policy">Cookie Policy</Link> for further information.
                  </p>
                </div>
              </div>

            </div>

            <aside className="lg-sidenav">
              <span className="lg-sidenav-title">On this page</span>
              <nav className="lg-sidenav-links">
                {[
                  "Booking requests",
                  "Pricing",
                  "Cancellations",
                  "Passenger conduct",
                  "Punctuality",
                  "Luggage",
                  "Governing law",
                  "Contact",
                ].map((item) => (
                  <span key={item} className="lg-sidenav-link">{item}</span>
                ))}
              </nav>
              <div className="lg-sidenav-divider" />
              <span className="lg-sidenav-title">Other legal pages</span>
              <div className="lg-sidenav-other">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </Layout>
  );
}
