import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE = "01375 383878";
const PHONE_HREF = "tel:01375383878";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    children: [
      { href: "/local-taxis", label: "Local Taxis" },
      { href: "/airport-transfers", label: "Airport Transfers" },
      { href: "/corporate-accounts", label: "Corporate Accounts" },
      { href: "/school-runs", label: "School Runs" },
      { href: "/long-distance-travel", label: "Long Distance" },
    ],
  },
  { href: "/areas-covered", label: "Areas Covered" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" data-testid="header-logo">
            <img
              src="/logo-transparent.png"
              alt="Lakeside & Purfleet Taxis"
              className="h-12 lg:h-14 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm hover:text-primary transition-colors font-medium ${transparent ? "text-white/80" : "text-foreground/70"}`}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    data-testid="nav-services-dropdown"
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div
                    className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <div className="bg-card border border-border rounded-lg shadow-xl py-1 min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                          data-testid={`nav-${child.href.replace(/\//g, "-")}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : transparent ? "text-white/80 hover:text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                  data-testid={`nav-${item.href.replace(/\//g, "-") || "home"}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 lg:gap-3">
            <a
              href={PHONE_HREF}
              className={`hidden md:flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors ${transparent ? "text-white/90" : "text-foreground/80"}`}
              data-testid="header-phone"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>{PHONE}</span>
            </a>
            <Link href="/quote-request">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm hidden sm:flex"
                data-testid="header-quote-btn"
              >
                Request a Quote
              </Button>
            </Link>
            <button
              className={`lg:hidden p-2 hover:text-primary ${transparent ? "text-white/80" : "text-foreground/70"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-border bg-white/98 backdrop-blur-md"
          data-testid="mobile-menu"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground/70 hover:text-primary"
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-foreground/60 hover:text-primary"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`block px-3 py-2.5 text-sm font-medium ${
                    location === item.href ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-border/50 space-y-2">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary"
              >
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
              <Link href="/quote-request" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground font-semibold" data-testid="mobile-quote-btn">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
