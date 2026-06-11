import { Link } from "wouter";
import { Phone, MessageCircle, FileText, Anchor } from "lucide-react";

export default function MobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border shadow-lg" data-testid="mobile-bottom-bar">
      <div className="grid grid-cols-4">

        {/* Call — black background */}
        <a
          href="tel:01375383878"
          className="flex flex-col items-center justify-center py-3 gap-1 bg-foreground text-card hover:opacity-90 transition-opacity"
          data-testid="mobile-bar-call"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs font-semibold">Call Us</span>
        </a>

        {/* WhatsApp — WhatsApp green */}
        <a
          href="https://wa.me/447879956275"
          className="flex flex-col items-center justify-center py-3 gap-1 text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#25D366" }}
          data-testid="mobile-bar-whatsapp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">WhatsApp</span>
        </a>

        {/* Cruise — neutral with yellow accent */}
        <Link
          href="/tilbury-cruise-terminal"
          className="flex flex-col items-center justify-center py-3 gap-1 bg-white text-foreground/80 hover:text-primary transition-colors border-r border-border/50"
          data-testid="mobile-bar-cruise"
        >
          <Anchor className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold text-primary">Cruise</span>
        </Link>

        {/* Get Quote — company yellow */}
        <Link
          href="/quote-request"
          className="flex flex-col items-center justify-center py-3 gap-1 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          data-testid="mobile-bar-quote"
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs font-semibold">Get Quote</span>
        </Link>

      </div>
    </div>
  );
}
