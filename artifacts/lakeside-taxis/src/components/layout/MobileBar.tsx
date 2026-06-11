import { Link } from "wouter";
import { Phone, MessageCircle, FileText } from "lucide-react";

export default function MobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[hsl(220_25%_5%)] border-t border-border/50 shadow-2xl" data-testid="mobile-bottom-bar">
      <div className="grid grid-cols-3 divide-x divide-border/50">
        <a
          href="tel:01375383878"
          className="flex flex-col items-center justify-center py-3 gap-1 text-foreground/80 hover:text-primary transition-colors"
          data-testid="mobile-bar-call"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs font-semibold">Call Us</span>
        </a>
        <a
          href="https://wa.me/447879956275"
          className="flex flex-col items-center justify-center py-3 gap-1 text-foreground/80 hover:text-primary transition-colors"
          data-testid="mobile-bar-whatsapp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">WhatsApp</span>
        </a>
        <Link
          href="/quote-request"
          className="flex flex-col items-center justify-center py-3 gap-1 bg-primary text-primary-foreground"
          data-testid="mobile-bar-quote"
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs font-semibold">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
