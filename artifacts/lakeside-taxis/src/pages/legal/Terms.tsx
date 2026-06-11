import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <Helmet>
        <title>Terms & Conditions | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Terms and conditions for Lakeside & Purfleet Taxis Ltd, Thurrock, Essex." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-5xl text-foreground mb-8">TERMS & CONDITIONS</h1>
          <div className="prose prose-slate max-w-none text-foreground/80 space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>
            <h2 className="font-display font-bold text-2xl text-foreground">1. Booking requests</h2>
            <p>Submitting a booking request through our website does not constitute a confirmed booking. A booking is only confirmed once our team has contacted you, confirmed availability, provided pricing, and you have agreed to proceed.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">2. Pricing</h2>
            <p>All prices are provided directly by our team following your booking request. We do not display prices on our website. The price quoted by our team is the price you pay. Any additional stops or changes to your journey may affect the price.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">3. Cancellations</h2>
            <p>Cancellation policies will be confirmed at the time of booking. Please contact us as soon as possible if you need to cancel or amend a confirmed booking.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">4. Passenger conduct</h2>
            <p>Passengers are expected to behave respectfully towards our drivers. We reserve the right to refuse or terminate a journey if passenger conduct is deemed unacceptable.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">5. Delays and exceptional circumstances</h2>
            <p>While we aim to be punctual at all times, we cannot be held liable for delays caused by exceptional traffic, weather conditions or circumstances beyond our control.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">6. Contact</h2>
            <p>For any queries regarding these terms, contact us at info@lakesidetaxi.co.uk or call 01375 383878.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
