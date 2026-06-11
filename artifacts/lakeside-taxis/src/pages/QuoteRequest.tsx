import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";

export default function QuoteRequest() {
  return (
    <Layout>
      <Helmet>
        <title>Request a Quote | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Send your journey details to Lakeside & Purfleet Taxis. Our team will confirm availability and pricing. No payment, no instant booking." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-4xl lg:text-5xl text-foreground mb-3">REQUEST A QUOTE</h1>
            <p className="text-muted-foreground text-lg">
              Send us your journey details and our team will confirm availability and pricing.
            </p>
            <p className="text-muted-foreground/70 text-sm mt-2">
              No payment. No instant booking. Just a direct request to a local taxi team.
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </Layout>
  );
}
