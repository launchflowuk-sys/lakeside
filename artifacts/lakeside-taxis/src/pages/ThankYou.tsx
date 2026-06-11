import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function ThankYou() {
  return (
    <Layout>
      <Helmet>
        <title>Booking Request Received | Lakeside & Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center" data-testid="thank-you-page">
          <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">
            REQUEST RECEIVED
          </h1>
          <p className="text-lg text-foreground/80 mb-4">
            Thank you. Your booking request has been sent to Lakeside & Purfleet Taxis.
          </p>
          <p className="text-foreground/60 mb-8">
            Our team will contact you shortly to confirm availability and pricing. Please note — your booking is not confirmed until our team gets in touch.
          </p>
          <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-foreground mb-3">What happens next?</h2>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Our team reviews your journey details</li>
              <li className="flex gap-2"><span className="text-primary font-bold">2.</span> We check driver availability for your date and time</li>
              <li className="flex gap-2"><span className="text-primary font-bold">3.</span> We contact you with pricing via your preferred method</li>
              <li className="flex gap-2"><span className="text-primary font-bold">4.</span> You confirm — and your booking is set</li>
            </ol>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Need an urgent response? Call or WhatsApp us directly:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <a href="tel:01375383878">
              <Button variant="outline" data-testid="thankyou-call-btn">
                <Phone className="w-4 h-4 mr-2" /> 01375 383878
              </Button>
            </a>
            <a href="https://wa.me/447879956275">
              <Button variant="outline" className="text-green-400 border-green-400/30" data-testid="thankyou-whatsapp-btn">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
              </Button>
            </a>
          </div>
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground">
              Back to homepage <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
