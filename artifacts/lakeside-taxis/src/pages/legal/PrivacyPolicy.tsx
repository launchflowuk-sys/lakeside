import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Privacy policy for Lakeside & Purfleet Taxis Ltd, Thurrock, Essex." />
      </Helmet>
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-5xl text-white mb-8">PRIVACY POLICY</h1>
          <div className="prose prose-invert max-w-none text-foreground/80 space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>
            <h2 className="font-display font-bold text-2xl text-white">1. Who we are</h2>
            <p>Lakeside & Purfleet Taxis Ltd ("we", "our", "us") is a taxi company based in Thurrock, Essex, UK. This privacy policy explains how we collect, use and protect your personal information when you use our website or contact us.</p>
            <h2 className="font-display font-bold text-2xl text-white">2. What information we collect</h2>
            <p>When you submit a booking request through our website, we collect the following information:</p>
            <ul className="space-y-2">
              {["Your full name", "Your mobile number", "Your email address", "Journey details (pickup, destination, date and time)", "Passenger and luggage information", "Any additional requirements you provide"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 block" />
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="font-display font-bold text-2xl text-white">3. How we use your information</h2>
            <p>We use your personal information to:</p>
            <ul className="space-y-2">
              {["Respond to your booking request and provide a price", "Contact you to confirm availability and journey details", "Manage your journey if a booking is confirmed", "Send you relevant communications about your booking"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2 block" />
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="font-display font-bold text-2xl text-white">4. Data retention</h2>
            <p>We retain booking request data for a reasonable period to manage ongoing journeys and for accounting purposes. You may request deletion of your data at any time by contacting us.</p>
            <h2 className="font-display font-bold text-2xl text-white">5. Your rights</h2>
            <p>Under UK GDPR, you have the right to access, correct or delete your personal data. To exercise these rights, contact us at info@lakesidetaxis.co.uk.</p>
            <h2 className="font-display font-bold text-2xl text-white">6. Contact us</h2>
            <p>For any privacy-related queries, please contact: info@lakesidetaxis.co.uk</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
