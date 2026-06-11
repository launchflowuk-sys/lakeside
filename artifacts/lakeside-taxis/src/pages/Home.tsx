import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BookingForm from "@/components/BookingForm";
import Layout from "@/components/layout/Layout";
import {
  Phone, MessageCircle, Shield, Clock, MapPin, Award, Users, Plane, Briefcase,
  GraduationCap, Car, Star, CheckCircle2, ArrowRight, Zap
} from "lucide-react";

const PHONE = "01375 383878";
const PHONE_HREF = "tel:01375383878";
const WA_HREF = "https://wa.me/447879956275";

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
  { name: "Heathrow", code: "LHR", href: "/airport-transfers/heathrow" },
  { name: "Gatwick", code: "LGW", href: "/airport-transfers/gatwick" },
  { name: "Stansted", code: "STN", href: "/airport-transfers/stansted" },
  { name: "Luton", code: "LTN", href: "/airport-transfers/luton" },
  { name: "London City", code: "LCY", href: "/airport-transfers/london-city" },
  { name: "Southend", code: "SEN", href: "/airport-transfers/southend" },
];

const testimonials = [
  {
    name: "Sharon M.",
    location: "Grays",
    text: "Used Lakeside Taxis for my Heathrow transfer. Driver was early, helpful with luggage and the price we were quoted was exactly what we paid. Would absolutely recommend.",
    rating: 5,
    service: "Airport Transfer",
  },
  {
    name: "Dave T.",
    location: "Purfleet",
    text: "Been using them for my weekly work trips into London for two years. Always on time, always reliable. Couldn't ask for better service.",
    rating: 5,
    service: "Corporate Travel",
  },
  {
    name: "Amanda K.",
    location: "Chafford Hundred",
    text: "They do our daughter's school run every morning. She's always picked up on time and the driver is brilliant with her. Complete peace of mind.",
    rating: 5,
    service: "School Run",
  },
  {
    name: "James L.",
    location: "Tilbury",
    text: "Needed a late night taxi after my flight landed at Stansted. They were waiting for me, great communication throughout. Really professional outfit.",
    rating: 5,
    service: "Airport Transfer",
  },
];

const faqs = [
  {
    q: "Is my booking confirmed when I submit the form?",
    a: "No. Submitting the form sends us your journey details as a booking request. Our team will then contact you to confirm availability and provide pricing. Your booking is not confirmed until we have spoken with you.",
  },
  {
    q: "How quickly will I get a response?",
    a: "We aim to respond to all booking requests within 2 hours during business hours. For same-day or urgent enquiries, please call or WhatsApp us directly for the fastest response.",
  },
  {
    q: "Do you cover all areas of Thurrock?",
    a: "Yes. We cover the whole of Thurrock including Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope and Corringham, as well as wider Essex.",
  },
  {
    q: "Which airports do you transfer to?",
    a: "We cover all major London and Essex airports including Heathrow, Gatwick, Stansted, Luton, London City and Southend. We handle both outbound and return pickups.",
  },
  {
    q: "Will I know the price before I travel?",
    a: "Yes. We always confirm your price before your journey. There are no hidden charges — what we quote is what you pay.",
  },
  {
    q: "Can I set up a corporate account?",
    a: "Yes. We offer corporate accounts with monthly invoicing for regular business clients. Contact us directly to discuss your requirements.",
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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": "Lakeside & Purfleet Taxis Ltd",
          "telephone": "01375383878",
          "email": "info@lakesidetaxi.co.uk",
          "areaServed": "Thurrock, Essex",
          "url": "https://lakesidetaxi.co.uk",
          "address": { "@type": "PostalAddress", "addressLocality": "Thurrock", "addressRegion": "Essex", "addressCountry": "GB" },
          "priceRange": "££",
          "openingHours": "Mo-Su 00:00-23:59"
        })}</script>
      </Helmet>

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        data-testid="hero-section"
      >
        {/* Photo background — dark UK motorway at night */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Multi-layer overlay — very dark left, slightly less dark right, ensures text always readable */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, rgba(9,16,26,0.97) 0%, rgba(9,16,26,0.93) 45%, rgba(9,16,26,0.82) 100%)"
        }} />
        {/* Bottom gradient fade to match page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: "linear-gradient(to bottom, transparent, hsl(220 20% 7%))"
        }} />
        {/* Yellow left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 lg:pt-14">
          <div className="grid lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-10 lg:gap-14 items-end">

            {/* LEFT: Copy */}
            <div className="pb-12 lg:pb-16" data-testid="hero-copy">

              {/* Social proof — above the headline */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <span className="text-sm text-foreground/70 font-medium">Trusted by thousands of Thurrock customers since 1990</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-bold text-2xl sm:text-[1.85rem] lg:text-[2.1rem] xl:text-[2.4rem] text-white leading-[1.15] mb-5">
                Thurrock's Trusted Taxi &amp;<br />
                Airport Transfer Company —<br />
                <span className="text-primary">Serving Grays, Purfleet</span><br />
                <span className="text-primary">&amp; Essex Since 1990</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-xl font-semibold text-white/80 mb-3 leading-snug">
                From Lakeside to Heathrow. From Purfleet to anywhere.
              </p>

              {/* Coverage areas */}
              <p className="text-sm text-primary/90 font-medium mb-4 tracking-wide">
                Grays &bull; Purfleet &bull; Chafford Hundred &bull; Tilbury &bull; West Thurrock &bull; Aveley &bull; Stanford-le-Hope
              </p>

              <p className="text-base text-white/50 mb-8 max-w-md leading-relaxed">
                Local taxis, airport transfers, school runs and business travel. Call us, WhatsApp us, or send your journey details — we confirm your price within 2 hours.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-5">
                <a href={WA_HREF} data-testid="hero-whatsapp-btn">
                  <Button className="bg-green-500 hover:bg-green-400 text-white font-bold text-base px-7 py-3 h-auto gap-2 shadow-lg shadow-green-900/30">
                    <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
                  </Button>
                </a>
                <a href={PHONE_HREF} data-testid="hero-call-btn">
                  <Button variant="outline" className="font-bold text-base px-6 py-3 h-auto border-white/20 text-white hover:border-primary/60 hover:bg-white/5">
                    <Phone className="w-4 h-4 mr-2" /> {PHONE}
                  </Button>
                </a>
              </div>

              {/* Micro-assurance */}
              <div className="flex items-center gap-2 mb-10">
                <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs text-white/45">Reply within 2 hours &middot; No card details &middot; No app &middot; Price confirmed before you travel</span>
              </div>

              {/* Hero stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
                {[
                  { number: "30+", label: "Years serving Thurrock" },
                  { number: "10k+", label: "Journeys completed" },
                  { number: "6", label: "Airports served" },
                  { number: "9", label: "Areas covered" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display font-black text-3xl text-primary leading-none mb-1">{stat.number}</div>
                    <div className="text-xs text-white/40 font-medium uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Enquiry card */}
            <div className="relative" data-testid="hero-form">
              {/* Card header — local & warm, not SaaS */}
              <div className="bg-[hsl(220_25%_10%)] border border-white/10 border-b-0 px-5 py-4 rounded-t-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-black text-white text-lg leading-tight">Send Your Journey Details</p>
                    <p className="text-white/45 text-xs mt-1">Our local team replies within 2 hours &middot; No payment needed</p>
                  </div>
                  <Link
                    href="/quote-request"
                    className="text-primary/70 text-xs hover:text-primary transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
                  >
                    Full form →
                  </Link>
                </div>
              </div>
              {/* Form body */}
              <div className="bg-card rounded-b-2xl border border-white/10 border-t-0 shadow-2xl shadow-black/50">
                <BookingForm compact />
              </div>
              {/* Below-form reassurance */}
              <p className="text-center text-xs text-white/30 mt-3 pb-1">
                No payment · No obligation · Trusted local service since 1990
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="bg-primary py-4" data-testid="trust-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { icon: Award,        text: "30+ Years Serving Thurrock" },
              { icon: MapPin,       text: "9 Areas Covered" },
              { icon: Plane,        text: "6 Major Airports Served" },
              { icon: Users,        text: "Thousands of Journeys Completed" },
              { icon: Shield,       text: "Fully Licensed & Insured" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-primary-foreground">
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-bold whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (moved up — social proof before services) ─── */}
      <section className="py-16 lg:py-20" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Real customers · Real reviews</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white leading-tight">
                WHAT THURROCK<br className="hidden sm:block" /> SAYS ABOUT US
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs sm:text-right">
              Trusted by Thurrock families, workers and businesses since 1990
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 flex flex-col"
                data-testid={`testimonial-${i}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={t.rating} />
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {t.service}
                  </span>
                </div>
                <p className="text-foreground/75 text-sm leading-relaxed italic flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-black">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm leading-none">{t.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{t.location}, Thurrock</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* CTA beneath testimonials */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/quote-request">
              <Button className="bg-primary text-primary-foreground font-bold px-6" data-testid="testimonials-quote-btn">
                Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href={WA_HREF}>
              <Button variant="outline" className="text-green-400 border-green-400/30 hover:bg-green-400/10 font-semibold px-6">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp for a quick quote
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Local · Airport · Corporate · School</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">EVERY JOURNEY, COVERED</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From a local run to Lakeside to an early Heathrow departure — we cover every journey type across Thurrock and beyond.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-background border border-border/60 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                data-testid={`service-card-${s.href.split("/").pop()}`}
              >
                <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Find out more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/quote-request">
              <Button className="bg-primary text-primary-foreground font-bold px-8 py-3 h-auto" data-testid="services-cta-btn">
                Request a Quote for Any Journey <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AIRPORT TRANSFERS ─── */}
      <section className="py-16 lg:py-20" data-testid="airports-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">All major London & Essex airports</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
                AIRPORT TRANSFERS<br />FROM THURROCK
              </h2>
              <p className="text-foreground/65 text-lg leading-relaxed mb-6">
                Early morning. Late night. Return pickups. We cover every flight at every major airport — from Heathrow to Southend. No meet-and-greet stress. Your driver waits for you.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Flight tracking — we monitor your arrival",
                  "Waiting time included for return pickups",
                  "All terminal departures and arrivals",
                  "Large vehicles for extra luggage",
                  "Price confirmed before you travel",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/75">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link href="/airport-transfers">
                  <Button className="bg-primary text-primary-foreground font-bold" data-testid="airports-cta-btn">
                    Get Airport Transfer Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {airports.map((airport) => (
                <Link
                  key={airport.href}
                  href={airport.href}
                  className="group bg-card border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                  data-testid={`airport-card-${airport.href.split("/").pop()}`}
                >
                  <Plane className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{airport.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{airport.code}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Local. Reliable. Honest.</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-6 leading-tight">
                WHY THURROCK<br /><span className="text-primary">CHOOSES US</span>
              </h2>
              <p className="text-foreground/65 text-lg mb-8 leading-relaxed">
                We're not an app. We're not a national call centre. We're a local team that has been driving Thurrock families, workers and businesses since 1990 — and we treat every journey that way.
              </p>
              <div className="space-y-5">
                {[
                  {
                    title: "You know the price before you travel",
                    desc: "We confirm your price before your journey. No meters running. No surprises. What we quote is what you pay.",
                  },
                  {
                    title: "We know these roads",
                    desc: "Our drivers know Thurrock inside out — Grays, Purfleet, Lakeside, the Dartford crossing. No sat-nav errors. No wasted time.",
                  },
                  {
                    title: "Real people, not chatbots",
                    desc: "Call us. WhatsApp us. Email us. You deal with the actual team — a two-hour response, not an automated queue.",
                  },
                  {
                    title: "30+ years. Still local.",
                    desc: "Family-run and community-based. We've earned Thurrock's trust over three decades and we intend to keep it.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-snug mb-1">{item.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: CTA card + call-out */}
            <div className="space-y-4">
              <div className="bg-primary rounded-2xl p-8">
                <p className="font-display font-black text-2xl text-primary-foreground mb-2">Ready to request a quote?</p>
                <p className="text-primary-foreground/70 text-sm mb-6">Fill in the form and we'll confirm your price and availability within 2 hours. No payment required.</p>
                <Link href="/quote-request" className="block">
                  <Button className="w-full bg-primary-foreground text-primary font-bold text-base py-3 h-auto hover:bg-primary-foreground/90" data-testid="why-quote-btn">
                    Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <a href={WA_HREF} className="block">
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4 hover:border-green-500/60 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Prefer to WhatsApp?</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Message us now — fastest way to get a response.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-green-400 transition-colors" />
                </div>
              </a>
              <a href={PHONE_HREF} className="block">
                <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Prefer to call?</p>
                    <p className="text-primary font-bold text-base">{PHONE}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AREAS COVERED ─── */}
      <section className="py-16 lg:py-20" data-testid="areas-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Thurrock & wider Essex</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white">AREAS WE SERVE</h2>
            </div>
            <Link href="/areas-covered">
              <Button variant="outline" className="flex-shrink-0">
                View all areas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
                <MapPin className="w-4 h-4 text-primary mx-auto mb-2" />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{area.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORPORATE ─── */}
      <section className="bg-[hsl(220_25%_5%)] py-16 lg:py-20 border-y border-border/50" data-testid="corporate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-2xl border border-border overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary text-xs font-bold tracking-widest uppercase">Business Travel</span>
                </div>
                <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
                  CORPORATE<br />ACCOUNTS
                </h2>
                <p className="text-foreground/65 text-lg mb-7 leading-relaxed">
                  Professional, punctual and discreet business travel for Thurrock companies. Monthly invoicing. No need to pay per journey.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Monthly invoicing available",
                    "Dedicated business account management",
                    "Professional drivers on request",
                    "Airport meet & greet service",
                    "Group bookings and team travel",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm text-foreground/75">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href="/corporate-accounts">
                  <Button className="bg-primary text-primary-foreground font-bold" data-testid="corporate-cta-btn">
                    Enquire about a corporate account <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="bg-card/60 border-t lg:border-t-0 lg:border-l border-border p-8 lg:p-12 flex items-center">
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <blockquote className="text-foreground/80 text-lg leading-relaxed mb-5">
                    "Reliable, professional, and always on time. Lakeside Taxis handle all our staff airport runs. Couldn't recommend them more highly."
                  </blockquote>
                  <p className="text-sm text-muted-foreground font-semibold">— Operations Manager, Thurrock-based logistics firm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 lg:py-20" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Common questions</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-3">QUICK ANSWERS</h2>
            <p className="text-muted-foreground">Everything you need to know before you book</p>
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
          {/* CTA under FAQ */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm mb-4">Still have a question? Contact us directly.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={PHONE_HREF}>
                <Button variant="outline" className="font-semibold">
                  <Phone className="w-4 h-4 mr-2" /> Call {PHONE}
                </Button>
              </a>
              <a href={WA_HREF}>
                <Button variant="outline" className="text-green-400 border-green-400/30 hover:bg-green-400/10 font-semibold">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: "linear-gradient(135deg, hsl(220 25% 5%) 0%, hsl(220 20% 9%) 100%)" }}
        data-testid="final-cta-section"
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `repeating-linear-gradient(-45deg, hsl(45 97% 52%) 0, hsl(45 97% 52%) 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-7">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-bold tracking-widest uppercase">Thurrock, Essex · Est. 1990</span>
          </div>
          <h2 className="font-display font-black text-5xl lg:text-7xl text-white mb-4 leading-tight">
            NEED A TAXI<br /><span className="text-primary">IN THURROCK?</span>
          </h2>
          <p className="text-foreground/60 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Fill in the form and we'll confirm your price within 2 hours. Or call and speak to a real person right now.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/quote-request">
              <Button
                className="bg-primary text-primary-foreground font-black text-lg px-10 py-4 h-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                data-testid="final-cta-quote-btn"
              >
                Request a Free Quote <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href={WA_HREF}>
              <Button className="bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-4 h-auto">
                <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Us
              </Button>
            </a>
            <a href={PHONE_HREF}>
              <Button
                variant="outline"
                className="font-bold text-lg px-8 py-4 h-auto border-border/50 hover:border-primary/40"
                data-testid="final-cta-call-btn"
              >
                <Phone className="w-5 h-5 mr-2" /> {PHONE}
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground text-sm">
            No payment required · No app · Price confirmed before your journey · Available 7 days a week
          </p>
        </div>
      </section>
    </Layout>
  );
}
