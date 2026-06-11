import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

const serviceLinks = [
  { href: "/local-taxis", label: "Local Taxis" },
  { href: "/airport-transfers", label: "Airport Transfers" },
  { href: "/corporate-accounts", label: "Corporate Accounts" },
  { href: "/school-runs", label: "School Runs" },
  { href: "/long-distance-travel", label: "Long Distance Travel" },
];

const airportLinks = [
  { href: "/airport-transfers/heathrow", label: "Heathrow Transfers" },
  { href: "/airport-transfers/gatwick", label: "Gatwick Transfers" },
  { href: "/airport-transfers/stansted", label: "Stansted Transfers" },
  { href: "/airport-transfers/luton", label: "Luton Transfers" },
  { href: "/airport-transfers/london-city", label: "London City Transfers" },
  { href: "/airport-transfers/southend", label: "Southend Transfers" },
];

const areaLinks = [
  { href: "/areas/grays", label: "Taxis in Grays" },
  { href: "/areas/purfleet", label: "Taxis in Purfleet" },
  { href: "/areas/chafford-hundred", label: "Taxis in Chafford Hundred" },
  { href: "/areas/tilbury", label: "Taxis in Tilbury" },
  { href: "/areas/south-ockendon", label: "Taxis in South Ockendon" },
  { href: "/areas/aveley", label: "Taxis in Aveley" },
  { href: "/areas/west-thurrock", label: "Taxis in West Thurrock" },
  { href: "/areas/stanford-le-hope", label: "Stanford-le-Hope" },
  { href: "/areas/corringham", label: "Taxis in Corringham" },
];

export default function Footer() {
  return (
    <footer className="bg-[hsl(220_25%_5%)] border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="font-display font-black text-white text-xl leading-tight">
                LAKESIDE & PURFLEET
              </div>
              <div className="text-primary font-bold tracking-widest text-sm">
                TAXIS LTD
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Thurrock's trusted taxi company for over 30 years. Local taxis, airport transfers and business travel across Essex.
            </p>
            <div className="space-y-2">
              <a href="tel:01375383878" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>01375 383878</span>
              </a>
              <a href="https://wa.me/447879956275" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>WhatsApp: 07879 956275</span>
              </a>
              <a href="mailto:info@lakesidetaxi.co.uk" className="flex items-center gap-2 text-sm text-white/70 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@lakesidetaxi.co.uk</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Thurrock, Essex, UK</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-white text-base uppercase tracking-wide mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Airport Transfers */}
          <div>
            <h3 className="font-display font-bold text-white text-base uppercase tracking-wide mb-4">
              Airport Transfers
            </h3>
            <ul className="space-y-2">
              {airportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-display font-bold text-white text-base uppercase tracking-wide mb-4">
              Areas Covered
            </h3>
            <ul className="space-y-2">
              {areaLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Lakeside & Purfleet Taxis Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
