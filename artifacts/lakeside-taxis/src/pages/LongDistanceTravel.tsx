import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function LongDistanceTravel() {
  return (
    <Layout>
      <Helmet>
        <title>Long Distance Taxis from Thurrock | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Long distance taxi service from Thurrock, Grays and Purfleet. UK-wide journeys including London, Birmingham, Manchester and beyond." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">LONG DISTANCE TRAVEL</h1>
              <p className="text-xl text-muted-foreground mb-6">
                UK-wide taxi journeys from Thurrock. Whether it's London, Birmingham or beyond.
              </p>
              <p className="text-foreground/70 mb-6">
                Not every journey fits on the train. When you need to get to a city, hospital, event or destination that requires a private vehicle, our long distance taxi service provides comfortable, direct travel from Thurrock.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Comfortable, modern vehicles",
                  "Direct journeys with no changes",
                  "Return bookings available",
                  "Competitive pricing confirmed before travel",
                  "All major UK destinations covered",
                  "Luggage and equipment transport",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
              <Link href="/quote-request">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="long-distance-cta">
                  Request a Long Distance Quote <ArrowRight className="w-4 h-4 ml-2" />
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
