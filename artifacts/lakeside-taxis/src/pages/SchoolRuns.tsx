import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SchoolRuns() {
  return (
    <Layout>
      <Helmet>
        <title>School Runs Thurrock | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Safe and reliable school run taxis across Thurrock, Grays, Purfleet and Essex. Regular or one-off school runs with experienced local drivers." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="font-display font-black text-5xl lg:text-6xl text-foreground mb-4">SCHOOL RUN TAXIS</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Safe, reliable school runs across Thurrock with trusted local drivers.
              </p>
              <p className="text-foreground/70 mb-6">
                When it comes to your child's safety, you need a taxi company you can trust completely. Our school run service covers primary and secondary schools across Thurrock, Grays, Purfleet and surrounding areas.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Experienced, locally known drivers",
                  "Regular morning and afternoon runs",
                  "One-off and occasional journeys",
                  "Child seat provision on request",
                  "Consistent driver assignments where possible",
                  "Punctual pickup and drop-off",
                ].map((v) => (
                  <div key={v} className="flex items-center gap-2 text-foreground/80 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
              <p className="text-foreground/60 text-sm bg-card border border-border rounded-lg p-4 mb-6">
                Please mention any child seat requirements or specific needs when making your booking request. We'll confirm availability and discuss your requirements before confirming.
              </p>
              <Link href="/quote-request">
                <Button className="bg-primary text-primary-foreground font-semibold" data-testid="school-runs-cta">
                  Request a School Run Quote <ArrowRight className="w-4 h-4 ml-2" />
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
