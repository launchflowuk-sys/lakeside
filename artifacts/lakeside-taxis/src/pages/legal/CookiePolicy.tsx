import LegalPage, { type LegalSection } from "./LegalPage";

const UPDATED = "16 August 2026";

const sections: LegalSection[] = [
  {
    id: "the-short-version",
    heading: "The short version",
    content: (
      <>
        <p>
          <strong>
            Browsing this website sets no cookies on your device at all.
          </strong>{" "}
          We use no analytics, no advertising trackers and no social media pixels. That
          is why you have never seen a cookie banner here — there is nothing to ask you
          to consent to.
        </p>
        <p>
          The only cookie this site can set is a sign-in cookie for our own office staff,
          and it is only created once someone signs into the admin area. As a visitor,
          you will never receive it.
        </p>
      </>
    ),
  },
  {
    id: "what-cookies-are",
    heading: "What cookies are",
    content: (
      <p>
        A cookie is a small text file a website asks your browser to store, so it can
        recognise you on a later page or a later visit. Some are strictly necessary to
        make a site work, such as keeping someone signed in. Others exist to measure
        behaviour or target advertising, and those need your consent under UK law.
      </p>
    ),
  },
  {
    id: "what-we-use",
    heading: "What we actually use",
    content: (
      <>
        <div className="lg-rows">
          <div className="lg-row">
            <span className="lg-row-term">Staff sign-in cookie</span>
            <span className="lg-row-def">
              Strictly necessary. Created only when a member of our office staff signs
              into the admin area, so the system knows they are logged in. It holds a
              random session reference and no personal information. It expires after
              seven days, or when they sign out.
            </span>
          </div>
        </div>
        <p>
          That is the complete list. It is a strictly necessary cookie, so it does not
          require consent, and it is never set for members of the public browsing the
          site.
        </p>
      </>
    ),
  },
  {
    id: "what-we-dont-use",
    heading: "What we do not use",
    content: (
      <>
        <p>To be specific, this website does not run any of the following:</p>
        <div className="lg-list">
          {[
            "Google Analytics or Google Tag Manager",
            "Facebook or Meta advertising pixels",
            "Advertising or retargeting networks of any kind",
            "Session recording or heatmap tools",
            "Cross-site tracking or data brokers",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          We do not track you across other websites, and we do not sell or share browsing
          data with anyone.
        </p>
      </>
    ),
  },
  {
    id: "third-party-pages",
    heading: "Pages hosted by other companies",
    content: (
      <>
        <p>
          One part of using us takes you off our website, and different rules apply there:
        </p>
        <div className="lg-rows">
          <div className="lg-row">
            <span className="lg-row-term">Paying by card</span>
            <span className="lg-row-def">
              If we send you a payment link, following it takes you to a checkout page
              hosted by Square, not by us. Square sets its own cookies on that page under
              its own privacy and cookie policies. Once payment completes you are
              returned to our website.
            </span>
          </div>
        </div>
        <p>
          If you follow a link from our site to WhatsApp, Google Maps or any other
          service, that service's own cookie policy applies from the moment you arrive.
        </p>
      </>
    ),
  },
  {
    id: "managing-cookies",
    heading: "Managing cookies",
    content: (
      <>
        <p>
          Because we set no cookies for visitors, there is nothing here for you to turn
          off. If you want to manage cookies generally, every major browser lets you view
          and delete them, and block them by site, from its settings or privacy menu.
        </p>
        <p>
          Blocking cookies entirely will not stop you using this website, browsing our
          pages, or submitting a quote request or a driver application.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    content: (
      <p>
        If we ever add analytics or any other non-essential cookie, we will update this
        page, change the date at the top, and ask for your consent before setting it.
        This policy was last updated on {UPDATED}.
      </p>
    ),
  },
];

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      metaDescription="Lakeside & Purfleet Taxis Ltd sets no cookies for website visitors and uses no analytics or advertising trackers. Here is exactly what that means."
      canonicalPath="/cookie-policy"
      updated={UPDATED}
      sections={sections}
      related={[
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
      ]}
    />
  );
}
