import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, MapPin } from "lucide-react";

export default function LocalTaxis() {
  return (
    <Layout>
      <Helmet>
        <title>Local Taxis in Thurrock | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Local taxis across Grays, Purfleet, Chafford Hundred, Tilbury and all of Thurrock, Essex. Available 7 days a week. Request a quote today." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-foreground mb-4">LOCAL TAXIS ACROSS THURROCK</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Reliable local taxi service across Grays, Purfleet, Lakeside, Chafford Hundred, Tilbury and the whole of Thurrock, Essex.
              </p>
              <p className="text-foreground/70 mb-6">
                Whether you need a taxi to the station, a shopping trip to Lakeside, a night out in Grays or a medical appointment, we're here. Available 7 days a week, days and evenings.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Local drivers who know Thurrock",
                  "Available days, evenings and weekends",
                  "Single journeys and regular bookings welcome",
                  "Saloon cars and larger vehicles available",
                  "Meet and greet service",
                  "Pets welcome on request",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">Areas we cover</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Grays", "Purfleet", "Chafford Hundred", "Tilbury", "South Ockendon", "Aveley", "West Thurrock", "Stanford-le-Hope", "Corringham", "Lakeside", "Thurrock"].map((area) => (
                  <span key={area} className="bg-card border border-border text-foreground/80 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" /> {area}
                  </span>
                ))}
              </div>
              <Link href="/quote-request">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="local-taxis-cta">
                  Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div>
              <BookingForm compact />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
