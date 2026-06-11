import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Award, Users, MapPin } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Lakeside & Purfleet Taxis Ltd | Thurrock Since 1990</title>
        <meta name="description" content="Thurrock's trusted local taxi company since 1990. A family-run business based in Grays and Purfleet, serving the whole of Thurrock, Essex." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-black text-5xl lg:text-6xl text-foreground mb-4">ABOUT US</h1>
            <p className="text-xl text-muted-foreground">Thurrock's trusted taxi company for over 30 years.</p>
          </div>
          <div className="prose prose-slate max-w-none mb-10">
            <p className="text-foreground/80 text-lg leading-relaxed mb-5">
              Lakeside & Purfleet Taxis Ltd has been serving the people of Thurrock since 1990. What started as a small local operation has grown into one of the most trusted taxi services in Essex — built on reliability, local knowledge, and straightforward service.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-5">
              We are a family-run business. We know Thurrock, Grays, Purfleet, Lakeside and the surrounding communities because we live here too. Our drivers aren't just drivers — they're local people who take pride in their work and in their community.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-8">
              We don't do apps or online payments. We believe in direct communication — a real person you can call, WhatsApp or email. When you book with us, you're dealing with us directly, not a faceless platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Award, title: "Est. 1990", desc: "Over 30 years serving Thurrock and Essex" },
              { icon: Users, title: "Local drivers", desc: "Thurrock-based, community-focused team" },
              { icon: MapPin, title: "Full coverage", desc: "Grays, Purfleet, Tilbury and beyond" },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-5">What we stand for</h2>
          <div className="space-y-3 mb-10">
            {[
              "Reliability — we are there when we say we will be",
              "Transparency — you always know what you'll pay before you travel",
              "Local knowledge — we know these roads, not just the sat-nav",
              "Direct service — you deal with us, not a third party",
              "Community — we've been part of Thurrock for over 30 years",
            ].map((v) => (
              <div key={v} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center">
            <h2 className="font-display font-black text-3xl text-foreground mb-3">Ready to book?</h2>
            <p className="text-foreground/70 mb-5">Send your journey details and we'll confirm availability and pricing.</p>
            <Link href="/quote-request">
              <Button className="bg-primary text-primary-foreground font-semibold px-8" data-testid="about-cta-btn">
                Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
