import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

const areas = [
  { name: "Grays", href: "/areas/grays", desc: "Town centre, Grays station, RM17 & RM20 postcodes" },
  { name: "Purfleet", href: "/areas/purfleet", desc: "Purfleet village, Lakeside retail park area" },
  { name: "Chafford Hundred", href: "/areas/chafford-hundred", desc: "Chafford Hundred station, residential areas" },
  { name: "Tilbury", href: "/areas/tilbury", desc: "Tilbury Town, Tilbury Docks, RM18 postcodes" },
  { name: "South Ockendon", href: "/areas/south-ockendon", desc: "South Ockendon, North Stifford, RM15" },
  { name: "Aveley", href: "/areas/aveley", desc: "Aveley village, South Ockendon borders" },
  { name: "West Thurrock", href: "/areas/west-thurrock", desc: "Lakeside, Grays border, RM20 postcodes" },
  { name: "Stanford-le-Hope", href: "/areas/stanford-le-hope", desc: "Stanford-le-Hope town, Corringham road" },
  { name: "Corringham", href: "/areas/corringham", desc: "Corringham village and surrounding areas" },
];

export default function AreasCovered() {
  return (
    <Layout>
      <Helmet>
        <title>Areas Covered | Lakeside & Purfleet Taxis | Thurrock, Essex</title>
        <meta name="description" content="Taxi services covering all areas of Thurrock including Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope and Corringham." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-black text-5xl lg:text-6xl text-foreground mb-4">AREAS WE COVER</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Local taxis across Thurrock and wider Essex. If you're in the area, we can get you there.
            </p>
            <p className="text-foreground/70">
              Lakeside & Purfleet Taxis covers the whole of Thurrock. Click on your area below to find out more about our local taxi service near you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {areas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all"
                data-testid={`area-card-${area.href.split("/").pop()}`}
              >
                <MapPin className="w-5 h-5 text-primary mb-2" />
                <h2 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{area.name}</h2>
                <p className="text-muted-foreground text-sm mb-3">{area.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1">
                  Taxis in {area.name} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center">
            <h2 className="font-display font-black text-3xl text-foreground mb-3">Not sure if we cover your area?</h2>
            <p className="text-foreground/70 mb-5">Call us or send a booking request — we'll let you know if we can help.</p>
            <Link href="/quote-request">
              <Button className="bg-primary text-primary-foreground font-semibold px-8" data-testid="areas-cta-btn">
                Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
