import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BookingForm from "@/components/BookingForm";
import Layout from "@/components/layout/Layout";
import {
  Phone, MessageCircle, Shield, Clock, MapPin, Award, Users, Plane, Briefcase,
  GraduationCap, Car, Star, CheckCircle2, ArrowRight
} from "lucide-react";

const PHONE = "01375 000000";
const PHONE_HREF = "tel:01375000000";
const WA_HREF = "https://wa.me/447700000000";

const areas = [
  { name: "Grays", href: "/areas/grays" },
  { name: "Purfleet", href: "/areas/purfleet" },
  { name: "Chafford Hundred", href: "/areas/chafford-hundred" },
  { name: "Tilbury", href: "/areas/tilbury" },
  { name: "South Ockendon", href: "/areas/south-ockendon" },
  { name: "Aveley", href: "/areas/aveley" },
  { name: "West Thurrock", href: "/areas/west-thurrock" },
  { name: "Stanford-le-Hope", href: "/areas/stanford-le-hope" },
  { name: "Corringham", href: "/areas/corringham" },
];

const services = [
  {
    icon: Car,
    title: "Local Taxis",
    desc: "Reliable local taxis across Grays, Purfleet, Lakeside and all of Thurrock. Available days, evenings and weekends.",
    href: "/local-taxis",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Stress-free transfers to Heathrow, Gatwick, Stansted, Luton, London City and Southend. Fixed-route reliability.",
    href: "/airport-transfers",
  },
  {
    icon: Briefcase,
    title: "Corporate Accounts",
    desc: "Professional business travel with monthly invoicing available. Reliable, punctual service for your team.",
    href: "/corporate-accounts",
  },
  {
    icon: GraduationCap,
    title: "School Runs",
    desc: "Safe, reliable school runs with experienced local drivers. Regular or one-off journeys across Thurrock.",
    href: "/school-runs",
  },
  {
    icon: MapPin,
    title: "Long Distance",
    desc: "UK-wide long distance travel. Whether it's London, Birmingham or beyond, we can get you there.",
    href: "/long-distance-travel",
  },
];

const airports = [
  { name: "Heathrow", href: "/airport-transfers/heathrow" },
  { name: "Gatwick", href: "/airport-transfers/gatwick" },
  { name: "Stansted", href: "/airport-transfers/stansted" },
  { name: "Luton", href: "/airport-transfers/luton" },
  { name: "London City", href: "/airport-transfers/london-city" },
  { name: "Southend", href: "/airport-transfers/southend" },
];

const testimonials = [
  {
    name: "Sharon M.",
    location: "Grays",
    text: "Used Lakeside Taxis for my Heathrow transfer. Driver was early, helpful with luggage and the price we were quoted was exactly what we paid. Would absolutely recommend.",
    rating: 5,
  },
  {
    name: "Dave T.",
    location: "Purfleet",
    text: "Been using them for my weekly work trips into London for two years. Always on time, always reliable. Couldn't ask for better service.",
    rating: 5,
  },
  {
    name: "Amanda K.",
    location: "Chafford Hundred",
    text: "They do our daughter's school run every morning. She's always picked up on time and the driver is brilliant with her. Complete peace of mind.",
    rating: 5,
  },
  {
    name: "James L.",
    location: "Tilbury",
    text: "Needed a late night taxi after my flight landed at Stansted. They were waiting for me, great communication throughout. Really professional outfit.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is my booking confirmed when I submit the form?",
    a: "No. Submitting the form sends us your journey details as a booking request. Our team will then contact you to confirm availability and provide pricing. Your booking is not confirmed until we have spoken with you.",
  },
  {
    q: "How long will it take to get a price?",
    a: "We aim to respond to all booking requests within a few hours during business hours. For same-day or urgent enquiries, please call or WhatsApp us directly for the fastest response.",
  },
  {
    q: "Do you cover all areas of Thurrock?",
    a: "Yes. We cover the whole of Thurrock including Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope and Corringham, as well as wider Essex.",
  },
  {
    q: "Which airports do you transfer to?",
    a: "We cover all major London and Essex airports including Heathrow, Gatwick, Stansted, Luton, London City and Southend. We pick up and drop off.",
  },
  {
    q: "Can I set up a business/corporate account?",
    a: "Yes. We offer corporate accounts with regular invoicing. Contact us directly to discuss your business requirements.",
  },
  {
    q: "Do you offer child seats and wheelchair-accessible vehicles?",
    a: "Please mention your requirements in your booking request and we will do our best to accommodate. Contact us directly to discuss specific accessibility needs.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Lakeside & Purfleet Taxis Ltd | Thurrock's Trusted Taxi Company</title>
        <meta name="description" content="Thurrock's trusted local taxi company for over 30 years. Local taxis, airport transfers and corporate travel across Grays, Purfleet, Lakeside and all of Thurrock, Essex." />
        <meta property="og:title" content="Lakeside & Purfleet Taxis Ltd | Thurrock's Trusted Taxi Company" />
        <meta property="og:description" content="Thurrock's trusted local taxi company for over 30 years. Local taxis, airport transfers and corporate travel across Essex." />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(220 25% 5%) 0%, hsl(220 25% 8%) 50%, hsl(220 20% 12%) 100%)",
        }}
        data-testid="hero-section"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              hsl(45 97% 52%) 0,
              hsl(45 97% 52%) 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "20px 20px",
          }}
        />
        {/* Yellow accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div data-testid="hero-copy">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">Serving Thurrock Since 1990</span>
              </div>

              <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-none mb-4">
                MOVING<br />
                <span className="text-primary">THURROCK</span><br />
                SINCE 1990
              </h1>

              <p className="text-lg text-foreground/70 mb-2 font-medium">
                From Lakeside to Heathrow. From Purfleet to anywhere.
              </p>
              <p className="text-base text-foreground/60 mb-8">
                Local taxis, airport transfers and business travel across Thurrock. No app. No online payment. Just a direct request to a trusted local team.
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Award, text: "30+ years in Thurrock" },
                  { icon: Users, text: "Local, reliable drivers" },
                  { icon: Plane, text: "Airport transfer specialists" },
                  { icon: Briefcase, text: "Corporate accounts" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2">
                    <b.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground/70 font-medium">{b.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/quote-request">
                  <Button className="bg-primary text-primary-foreground font-bold text-base px-6 py-3 h-auto" data-testid="hero-quote-btn">
                    Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href={PHONE_HREF}>
                  <Button variant="outline" className="font-semibold text-base px-6 py-3 h-auto border-border" data-testid="hero-call-btn">
                    <Phone className="w-4 h-4 mr-2" /> {PHONE}
                  </Button>
                </a>
                <a href={WA_HREF}>
                  <Button variant="outline" className="font-semibold text-base px-6 py-3 h-auto border-border text-green-400 border-green-400/30 hover:bg-green-400/10" data-testid="hero-whatsapp-btn">
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div data-testid="hero-form">
              <BookingForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary py-4" data-testid="trust-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {[
              { icon: Clock, text: "Available 7 days a week" },
              { icon: Shield, text: "Fully licensed & insured" },
              { icon: Users, text: "Local Thurrock drivers" },
              { icon: Award, text: "30+ years experience" },
              { icon: CheckCircle2, text: "No hidden charges" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-primary-foreground">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">OUR SERVICES</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From a local run to Lakeside to an early morning Heathrow departure, we cover every journey across Thurrock.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg"
                data-testid={`service-card-${s.href.split("/").pop()}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Find out more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-5">
                WHY CHOOSE<br /><span className="text-primary">LAKESIDE TAXIS?</span>
              </h2>
              <p className="text-foreground/70 text-lg mb-8">
                Thurrock's trusted taxi company for over 30 years. We're not an app. We're a local team that knows these roads, knows this community, and gets you where you need to be.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Local knowledge", desc: "Our drivers know Thurrock, Grays and Purfleet inside out. No sat-nav errors. No time wasted." },
                  { title: "No surprises", desc: "We confirm your price before you travel. What we quote is what you pay." },
                  { title: "Direct communication", desc: "You deal with us directly — by phone, WhatsApp or email. No app, no chatbot." },
                  { title: "Reliable and punctual", desc: "We understand that your time matters. We're on time, every time." },
                  { title: "30+ years in the community", desc: "Family-run and locally based. We're as much a part of Thurrock as you are." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "30+", label: "Years serving Thurrock" },
                { number: "10k+", label: "Journeys completed" },
                { number: "6", label: "Airports covered" },
                { number: "9", label: "Areas covered" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="font-display font-black text-4xl text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas Covered */}
      <section className="py-16 lg:py-20" data-testid="areas-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-2">AREAS WE COVER</h2>
              <p className="text-muted-foreground">Local taxis across Thurrock and wider Essex</p>
            </div>
            <Link href="/areas-covered">
              <Button variant="outline" className="flex-shrink-0">View all areas <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {areas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-card/80 transition-all text-center"
                data-testid={`area-card-${area.href.split("/").pop()}`}
              >
                <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{area.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Airport Transfers */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="airports-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">
              AIRPORT TRANSFERS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Airport transfers from Thurrock to all major London and Essex airports. Arrive on time, stress-free, with your luggage taken care of.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {airports.map((airport) => (
              <Link
                key={airport.href}
                href={airport.href}
                className="group bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all"
                data-testid={`airport-card-${airport.href.split("/").pop()}`}
              >
                <Plane className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{airport.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/airport-transfers">
              <Button className="bg-primary text-primary-foreground font-semibold px-8" data-testid="airports-cta-btn">
                View all airport transfers <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section className="py-16 lg:py-20" data-testid="corporate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-semibold tracking-wide uppercase">Business Travel</span>
                </div>
                <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">
                  CORPORATE ACCOUNTS
                </h2>
                <p className="text-foreground/70 text-lg mb-6">
                  Professional business travel for Thurrock companies. Reliable, punctual, and discreet. Monthly invoicing available for regular business clients.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Monthly invoicing available",
                    "Dedicated business account management",
                    "Professional, suited drivers on request",
                    "Airport meet & greet service",
                    "Group bookings and team travel",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href="/corporate-accounts">
                  <Button className="bg-primary text-primary-foreground font-semibold" data-testid="corporate-cta-btn">
                    Enquire about corporate accounts <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="bg-background rounded-xl p-8 border border-border/50">
                <Briefcase className="w-12 h-12 text-primary mb-4" />
                <blockquote className="text-foreground/80 text-lg italic mb-4">
                  "Reliable, professional, and always on time. Lakeside Taxis handle all our staff airport runs. Couldn't recommend them more highly."
                </blockquote>
                <p className="text-sm text-muted-foreground font-semibold">— Operations Manager, Thurrock-based logistics firm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">WHAT OUR CUSTOMERS SAY</h2>
            <p className="text-muted-foreground">Trusted by Thurrock families, workers and businesses for over 30 years</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6"
                data-testid={`testimonial-${i}`}
              >
                <StarRating rating={t.rating} />
                <p className="text-foreground/80 text-sm mt-3 mb-4 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="text-foreground font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.location}, Thurrock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-muted-foreground">Everything you need to know about booking with us</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/30"
                data-testid={`faq-item-${i}`}
              >
                <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 lg:py-20" data-testid="final-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-black text-4xl lg:text-6xl text-primary-foreground mb-4">
            READY TO BOOK?
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-8 max-w-2xl mx-auto">
            Send us your journey details and our team will confirm availability and pricing. No app, no payment. Just a direct request to a local taxi team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quote-request">
              <Button
                className="bg-primary-foreground text-primary font-bold text-lg px-8 py-4 h-auto hover:bg-primary-foreground/90"
                data-testid="final-cta-quote-btn"
              >
                Request a Quote <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href={PHONE_HREF}>
              <Button
                variant="outline"
                className="font-bold text-lg px-8 py-4 h-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="final-cta-call-btn"
              >
                <Phone className="w-5 h-5 mr-2" /> Call {PHONE}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
