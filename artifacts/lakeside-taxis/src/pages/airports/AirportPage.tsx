import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Plane } from "lucide-react";

interface AirportPageProps {
  airportName: string;
  airportCode?: string;
  description: string;
  content: string;
  distance?: string;
}

export default function AirportPage({ airportName, airportCode, description, content, distance }: AirportPageProps) {
  const title = `${airportName} Airport Transfers from Thurrock | Lakeside & Purfleet Taxis`;
  const metaDesc = `${airportName} airport transfers from Thurrock, Grays and Purfleet. Pre-booked, reliable service. Request a quote from Lakeside & Purfleet Taxis Ltd.`;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <Link href="/airport-transfers" className="hover:text-primary">Airport Transfers</Link>
                <span>/</span>
                <span className="text-foreground">{airportName}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Plane className="w-8 h-8 text-primary" />
                {airportCode && (
                  <span className="bg-primary/10 border border-primary/30 text-primary text-xs font-bold px-2 py-1 rounded">
                    {airportCode}
                  </span>
                )}
              </div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">
                {airportName.toUpperCase()}<br />AIRPORT TRANSFERS
              </h1>
              <p className="text-primary font-semibold text-sm mb-2">From Thurrock, Grays, Purfleet & Lakeside</p>
              {distance && (
                <p className="text-muted-foreground text-sm mb-4">Approx. {distance} from Grays, Thurrock</p>
              )}
              <p className="text-xl text-muted-foreground mb-5">{description}</p>
              <p className="text-foreground/70 mb-6">{content}</p>

              <h2 className="font-display font-bold text-2xl text-white mb-4">What's included</h2>
              <div className="space-y-3 mb-8">
                {[
                  "Direct pickup from your home address",
                  "Meet & greet at the terminal on return",
                  "Luggage assistance",
                  "Flight monitoring for delays",
                  "Comfortable, clean vehicles",
                  "Fixed price confirmed before travel",
                  "Early morning and late night transfers",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                <p className="text-primary font-semibold text-sm mb-1">Important note</p>
                <p className="text-foreground/70 text-sm">
                  All prices are confirmed by our team before your journey. We do not show prices online. Submit your booking request and we'll contact you with pricing and availability.
                </p>
              </div>

              <Link href="/quote-request">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="airport-page-cta">
                  Get {airportName} Transfer Quote <ArrowRight className="w-4 h-4 ml-2" />
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
