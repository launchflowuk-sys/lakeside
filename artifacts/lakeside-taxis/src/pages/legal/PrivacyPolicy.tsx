import LegalPage, { Placeholder, type LegalSection } from "./LegalPage";

const UPDATED = "16 August 2026";

function Rows({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="lg-rows">
      {items.map(([term, def]) => (
        <div className="lg-row" key={term}>
          <span className="lg-row-term">{term}</span>
          <span className="lg-row-def">{def}</span>
        </div>
      ))}
    </div>
  );
}

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    content: (
      <>
        <p>
          Lakeside &amp; Purfleet Taxis Ltd ("we", "our", "us") is a licensed private
          hire operator based in Thurrock, Essex. We are the data controller for the
          personal information described in this policy.
        </p>
        <div className="lg-rows">
          <div className="lg-row">
            <span className="lg-row-term">Registered office</span>
            <span className="lg-row-def">49a Orsett Road, Grays, Essex, RM17 5HJ</span>
          </div>
          <div className="lg-row">
            <span className="lg-row-term">Company number</span>
            <span className="lg-row-def">06329710</span>
          </div>
          <div className="lg-row">
            <span className="lg-row-term">ICO registration</span>
            <span className="lg-row-def"><Placeholder>ICO registration reference</Placeholder></span>
          </div>
          <div className="lg-row">
            <span className="lg-row-term">Contact</span>
            <span className="lg-row-def">
              <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> &middot;{" "}
              <a href="tel:01375383878">01375 383878</a>
            </span>
          </div>
        </div>
        <p>
          We handle personal data in line with the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect, and why",
    content: (
      <>
        <p>
          We collect different information depending on how you deal with us. We do not
          collect anything we do not need.
        </p>

        <h3 className="lg-subhead">If you request a quote or booking</h3>
        <div className="lg-list">
          {[
            "Your name, mobile number and email address",
            "Your preferred way of being contacted",
            "Journey details: pickup, destination, any stops, date and time",
            "Passenger and luggage numbers, child seat and accessibility requirements",
            "Anything else you choose to tell us in the notes",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>

        <h3 className="lg-subhead">If you apply for a corporate account</h3>
        <div className="lg-list">
          {[
            "Your organisation's name, type, address and website",
            "Your name, job title, email address and phone number",
            "Expected journey volumes, billing preference and account requirements",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>

        <h3 className="lg-subhead">If you apply to drive for us</h3>
        <p>
          A driver application carries considerably more sensitive information than a
          booking, so we set it out in full:
        </p>
        <div className="lg-list">
          {[
            "Your name, address, postcode, phone number and email address",
            "Your right to work status in the UK",
            "Private hire driver licence details: issuing council, badge number and expiry",
            "DVLA licence details, years held and any penalty points",
            "Vehicle details, if you drive your own vehicle",
            "Your experience, availability and any notes you add",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          You may also upload supporting documents, which can include your private hire
          badge, DVLA licence, DBS certificate, right to work document, proof of address,
          insurance certificate, MOT, V5C logbook or CV. These are handled with additional
          care — see <a href="#driver-documents">Driver application documents</a> below.
        </p>
      </>
    ),
  },
  {
    id: "lawful-basis",
    heading: "Our lawful basis for using it",
    content: (
      <>
        <p>
          UK GDPR requires us to have a specific lawful basis for each thing we do with
          your data. Ours are:
        </p>
        <Rows
          items={[
            [
              "Quotes and bookings",
              "Steps taken at your request before entering into a contract, and performance of that contract once a journey is booked.",
            ],
            [
              "Payment and record keeping",
              "Performance of a contract, and our legal obligation to retain financial records.",
            ],
            [
              "Corporate account applications",
              "Steps taken at your request before entering into a contract.",
            ],
            [
              "Driver applications",
              "Steps taken at your request before entering into a contract, and our legal obligations as a licensed private hire operator to verify that drivers are correctly licensed and entitled to work.",
            ],
            [
              "Keeping the website secure",
              "Our legitimate interest in protecting the site and preventing misuse.",
            ],
          ]}
        />
        <p>
          We do not send marketing and we do not build profiles. Nothing you submit is
          subject to automated decision-making.
        </p>
      </>
    ),
  },
  {
    id: "who-we-share-with",
    heading: "Who we share it with",
    content: (
      <>
        <p>
          <strong>We do not sell your data.</strong> We share it only with the suppliers
          who help us run the business, and only as far as they need it:
        </p>
        <Rows
          items={[
            [
              "Square",
              "Processes card payments when we send you a payment link. Your card details are entered on Square's own checkout and are never seen or stored by us.",
            ],
            [
              "IONOS",
              "Provides our email, and sends booking confirmations, quotes, payment links and application acknowledgements on our behalf.",
            ],
            [
              "Google",
              "We display our public Google reviews on the website. This does not involve sending Google anything about you.",
            ],
            [
              "Our hosting provider",
              "Runs the London server the website and database sit on. They do not access your data.",
            ],
          ]}
        />
        <p>
          Your booking details and any driver application documents are held on our own
          server in a London data centre, not on a third-party platform.
        </p>
        <p>
          Square is headquartered in the United States, so paying by card involves a
          transfer of your payment details outside the UK. Square makes that transfer
          under the safeguards required by UK data protection law. We do not send your
          data anywhere else outside the UK.
        </p>
        <p>
          We will also disclose information where we are legally required to — for
          example to Thurrock Council as our licensing authority, to the police, or to
          our insurers in connection with an incident.
        </p>
      </>
    ),
  },
  {
    id: "driver-documents",
    heading: "Driver application documents",
    content: (
      <>
        <p>
          Documents uploaded with a driver application are stored on our own server, not
          on a third-party service. They are never published, never linked publicly, and
          can only be opened by a signed-in member of our office staff.
        </p>
        <div className="lg-list">
          {[
            "Uploads are limited to PDFs and images, and to 10MB per file",
            "Files are stored under randomised names, so they cannot be guessed or found by URL",
            "Downloading a document requires an authenticated admin session",
            "Documents are not attached to notification emails — staff must sign in to view them",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          If you want your application and every document you uploaded permanently
          deleted, email{" "}
          <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> and we
          will remove both the application record and the files themselves.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep it",
    content: (
      <>
        <p>
          These periods are our current policy. Where a longer period is required by law,
          the legal requirement applies.
        </p>
        <Rows
          items={[
            [
              "Enquiries that did not become a booking",
              "12 months, then deleted.",
            ],
            [
              "Bookings and payment records",
              "6 years from the end of the relevant tax year, to meet HMRC record-keeping requirements.",
            ],
            [
              "Corporate account applications",
              "12 months if the account is not opened; for the life of the account plus 6 years if it is.",
            ],
            [
              "Unsuccessful driver applications",
              "6 months, then the application and all uploaded documents are deleted.",
            ],
            [
              "Successful driver applications",
              "Kept while you drive for us, and for as long as afterwards as licensing and insurance rules require.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    content: (
      <>
        <p>Under UK GDPR you have the right to:</p>
        <div className="lg-list">
          {[
            "Ask for a copy of the personal data we hold about you",
            "Have inaccurate data corrected",
            "Ask us to delete your data, where we are not required to keep it",
            "Ask us to restrict or object to how we are using it",
            "Ask for your data in a portable format",
            "Withdraw consent, where we relied on consent",
          ].map((item) => (
            <div className="lg-list-item" key={item}>{item}</div>
          ))}
        </div>
        <p>
          To exercise any of these, email{" "}
          <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> or call{" "}
          <a href="tel:01375383878">01375 383878</a>. We will respond within one month.
          There is no charge.
        </p>
        <p>
          If you are unhappy with how we have handled your data, you can complain to the
          Information Commissioner's Office at{" "}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
            ico.org.uk/make-a-complaint
          </a>{" "}
          or on 0303 123 1113. We would rather you came to us first so we can put it
          right.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    content: (
      <p>
        Our public website does not set any cookies and does not use analytics or
        advertising trackers. See our <a href="/cookie-policy">Cookie Policy</a> for the
        detail.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    content: (
      <p>
        If we change how we handle personal data we will update this page and change the
        date shown at the top. This policy was last updated on {UPDATED}.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      metaDescription="How Lakeside & Purfleet Taxis Ltd collects, uses, stores and deletes personal information for bookings, corporate accounts and driver applications."
      canonicalPath="/privacy-policy"
      updated={UPDATED}
      intro={
        <p>
          This policy covers everyone we hold information about: customers booking a
          journey, organisations opening a corporate account, and anyone applying to
          drive for us.
        </p>
      }
      sections={sections}
      related={[
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/cookie-policy", label: "Cookie Policy" },
      ]}
    />
  );
}
