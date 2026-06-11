import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact Us | Lakeside & Purfleet Taxis Ltd | Thurrock, Essex</title>
        <meta name="description" content="Contact Lakeside & Purfleet Taxis. Call, WhatsApp or email us. Based in Thurrock, Essex. Available 7 days a week." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white mb-4">CONTACT US</h1>
            <p className="text-xl text-muted-foreground">Get in touch. We're a local team — call, WhatsApp or email us directly.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              {[
                {
                  icon: Phone,
                  title: "Call us",
                  lines: ["01375 383878"],
                  href: "tel:01375383878",
                  cta: "Call now",
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  lines: ["07879 956275", "Message us on WhatsApp for a quick response"],
                  href: "https://wa.me/447879956275",
                  cta: "WhatsApp us",
                  green: true,
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: ["info@lakesidetaxi.co.uk"],
                  href: "mailto:info@lakesidetaxi.co.uk",
                  cta: "Send email",
                },
                {
                  icon: MapPin,
                  title: "Based in",
                  lines: ["Thurrock, Essex, UK"],
                  static: true,
                },
                {
                  icon: Clock,
                  title: "Hours",
                  lines: ["Available 7 days a week", "Please call for out-of-hours enquiries"],
                  static: true,
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className={`w-5 h-5 ${item.green ? "text-green-400" : "text-primary"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    {item.lines.map((l) => (
                      <p key={l} className="text-muted-foreground text-sm">{l}</p>
                    ))}
                    {item.href && (
                      <a
                        href={item.href}
                        className={`text-sm font-semibold mt-2 inline-block ${item.green ? "text-green-400 hover:text-green-300" : "text-primary hover:text-primary/80"} transition-colors`}
                        data-testid={`contact-link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {item.cta} &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-2">Booking requests</h2>
              <p className="text-muted-foreground text-sm mb-6">
                For a booking request or quote, the quickest way is to use our online form. We'll review your journey details and get back to you with pricing and availability.
              </p>
              <p className="text-foreground/80 text-sm mb-1 font-medium">What to include when you contact us:</p>
              <ul className="text-muted-foreground text-sm space-y-1.5 mb-6">
                {["Pickup location and destination", "Journey date and time", "Number of passengers", "Any special requirements"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="text-foreground/60 text-xs bg-muted/30 rounded-lg p-4">
                Booking requests are not confirmed bookings. Our team will contact you to confirm availability and pricing. Your booking is not confirmed until we have spoken with you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
