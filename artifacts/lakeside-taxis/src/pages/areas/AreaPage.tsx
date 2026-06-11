import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, MapPin, Plane, Briefcase, GraduationCap } from "lucide-react";

interface AreaPageProps {
  areaName: string;
  areaSlug: string;
  postcode?: string;
  description: string;
  content: string;
}

export default function AreaPage({ areaName, areaSlug, postcode, description, content }: AreaPageProps) {
  const title = `Taxis in ${areaName} | Lakeside & Purfleet Taxis Ltd`;
  const metaDesc = `Local taxis in ${areaName}, Thurrock, Essex. Airport transfers, school runs and corporate travel from ${areaName}. Request a quote from Lakeside & Purfleet Taxis.`;

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
                <Link href="/areas-covered" className="hover:text-primary">Areas Covered</Link>
                <span>/</span>
                <span className="text-foreground">{areaName}</span>
              </div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">
                TAXIS IN {areaName.toUpperCase()}
              </h1>
              {postcode && (
                <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{postcode} — Thurrock, Essex</span>
                </div>
              )}
              <p className="text-xl text-muted-foreground mb-5">{description}</p>
              <p className="text-foreground/70 mb-6">{content}</p>

              <h2 className="font-display font-bold text-2xl text-white mb-4">Services from {areaName}</h2>
              <div className="space-y-3 mb-6">
                {[
                  { icon: MapPin, text: `Local taxis from ${areaName} across Thurrock` },
                  { icon: Plane, text: `Airport transfers from ${areaName} to Heathrow, Gatwick, Stansted, Luton & more` },
                  { icon: Briefcase, text: `Corporate travel and business accounts` },
                  { icon: GraduationCap, text: `School runs from ${areaName}` },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2 text-foreground/80 text-sm">
                    <item.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-8">
                {[
                  "Local drivers who know the area",
                  "Available 7 days a week",
                  "Prices confirmed before travel",
                  "No online payment required",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link href="/airport-transfers">
                  <Button variant="outline" size="sm" className="text-sm">
                    <Plane className="w-3.5 h-3.5 mr-1.5" /> Airport Transfers
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="text-sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <Link href="/quote-request">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="area-page-cta">
                  Request a Quote from {areaName} <ArrowRight className="w-4 h-4 ml-2" />
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
