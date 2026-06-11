import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Briefcase } from "lucide-react";

export default function CorporateAccounts() {
  return (
    <Layout>
      <Helmet>
        <title>Corporate Taxi Accounts Thurrock | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Corporate taxi accounts for Thurrock businesses. Reliable business travel, monthly invoicing, airport transfers and staff transport across Essex." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">Business Travel</span>
              </div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">CORPORATE TAXI ACCOUNTS</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Professional business travel for Thurrock companies. Reliable, punctual, and discreet.
              </p>
              <p className="text-foreground/70 mb-6">
                We understand that business travel needs to be reliable. Whether it's getting your team to Heathrow on time, managing regular client runs or handling ad-hoc staff transport, Lakeside & Purfleet Taxis provides the dependable corporate taxi service that Thurrock businesses trust.
              </p>
              <h2 className="font-display font-bold text-2xl text-white mb-4">Corporate account benefits</h2>
              <div className="space-y-3 mb-8">
                {[
                  "Monthly invoicing for easy accounting",
                  "Dedicated account management",
                  "Professional, suited drivers on request",
                  "Airport meet & greet and terminal drop-off",
                  "Multi-passenger bookings and group travel",
                  "24-hour advance bookings",
                  "Regular and recurring journey management",
                  "Booking confirmations by email",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
              <Link href="/contact">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="corporate-contact-btn">
                  Enquire about a corporate account <ArrowRight className="w-4 h-4 ml-2" />
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
