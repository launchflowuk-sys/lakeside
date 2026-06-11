import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

export default function CookiePolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Cookie Policy | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Cookie policy for Lakeside & Purfleet Taxis Ltd website." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-5xl text-foreground mb-8">COOKIE POLICY</h1>
          <div className="prose prose-slate max-w-none text-foreground/80 space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>
            <h2 className="font-display font-bold text-2xl text-foreground">What are cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help websites function properly and provide a better user experience.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">How we use cookies</h2>
            <p>Our website uses minimal cookies necessary for the site to function correctly. We do not use tracking or advertising cookies. The cookies we use are:</p>
            <ul className="space-y-2">
              {["Session cookies: to maintain your browsing session", "Functional cookies: to remember your preferences during a visit"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2 block" />
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="font-display font-bold text-2xl text-foreground">Managing cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.</p>
            <h2 className="font-display font-bold text-2xl text-foreground">Contact us</h2>
            <p>For any queries about our use of cookies, contact: info@lakesidetaxis.co.uk</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
