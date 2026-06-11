import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Plane } from "lucide-react";

const airports = [
  { name: "Heathrow", href: "/airport-transfers/heathrow", desc: "UK's busiest airport. Fixed collection and drop-off." },
  { name: "Gatwick", href: "/airport-transfers/gatwick", desc: "South and North terminal transfers from Thurrock." },
  { name: "Stansted", href: "/airport-transfers/stansted", desc: "Budget airline hub. Early morning and late night runs." },
  { name: "Luton", href: "/airport-transfers/luton", desc: "Luton airport transfers for Thurrock travellers." },
  { name: "London City", href: "/airport-transfers/london-city", desc: "Business and short-haul departures from Docklands." },
  { name: "Southend", href: "/airport-transfers/southend", desc: "Essex's own airport. Closest to Thurrock." },
];

export default function AirportTransfers() {
  return (
    <Layout>
      <Helmet>
        <title>Airport Transfers from Thurrock | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Airport transfers from Thurrock, Grays and Purfleet to Heathrow, Gatwick, Stansted, Luton, London City and Southend airports. Pre-booked, reliable service." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">AIRPORT TRANSFERS FROM THURROCK</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Pre-booked airport transfers from Thurrock, Grays, Purfleet and Lakeside to all major London and Essex airports.
            </p>
            <p className="text-foreground/70 mb-8">
              Travelling from Thurrock to Heathrow, Gatwick, Stansted or Luton? We provide direct, pre-booked airport transfers. Your driver will be waiting, your luggage will be taken care of, and you'll arrive at the airport with time to spare.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {["Meet & greet service available", "Flight monitoring for delays", "Luggage assistance", "Early morning and late night transfers", "Return journey bookings", "Business and family travel"].map((v) => (
                <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {v}
                </div>
              ))}
            </div>
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-6">All airports covered</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {airports.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                data-testid={`airport-card-${a.href.split("/").pop()}`}
              >
                <Plane className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-2">{a.name} Airport</h3>
                <p className="text-muted-foreground text-sm mb-4">{a.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1">
                  Request transfer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center">
            <h2 className="font-display font-black text-3xl text-white mb-3">Ready to book your airport transfer?</h2>
            <p className="text-foreground/70 mb-5">Send your journey details and we'll confirm availability and pricing.</p>
            <Link href="/quote-request">
              <Button className="bg-primary text-primary-foreground font-semibold px-8" data-testid="airport-transfers-cta">
                Get Airport Transfer Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
