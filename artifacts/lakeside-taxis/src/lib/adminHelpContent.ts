/**
 * Content for the admin help section (/admin/help).
 *
 * Written as structured blocks rather than JSX so the same source can be both
 * rendered and flattened into searchable text — otherwise the search would
 * only ever match titles, which is the difference between a help section and
 * a table of contents.
 *
 * Everything here describes what the system actually does. If a workflow
 * changes, this file changes with it.
 */

export type HelpBlock =
  | { type: "p"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "list"; items: string[] }
  | { type: "rows"; items: Array<[string, string]> }
  | { type: "note"; text: string }
  | { type: "warn"; text: string };

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  /** Extra search terms a person might type that are not in the prose. */
  keywords: string[];
  blocks: HelpBlock[];
}

export const HELP_CATEGORIES = [
  "Start here",
  "Leads",
  "Quotes & payment",
  "Applications",
  "Housekeeping",
  "When something goes wrong",
] as const;

export const HELP_ARTICLES: HelpArticle[] = [
  // ── Start here ───────────────────────────────────────────────────────────
  {
    id: "overview",
    title: "How the whole system fits together",
    category: "Start here",
    summary:
      "A map of the dashboard: where work arrives, where it goes, and which screen does what.",
    keywords: ["overview", "getting started", "modules", "map", "introduction"],
    blocks: [
      {
        type: "p",
        text: "Everything the public website collects lands in this dashboard. There are three separate streams of work, and they never mix.",
      },
      {
        type: "rows",
        items: [
          [
            "Leads",
            "Someone wanting a journey. Comes from the quote request form, the booking form on any page, or a call you log yourself. This is the main stream.",
          ],
          [
            "Corporate applications",
            "A business, school or council wanting an account with monthly billing. Comes from the corporate accounts page.",
          ],
          [
            "Driver applications",
            "Someone wanting to drive for you. Comes from the become a driver page, usually with documents attached.",
          ],
        ],
      },
      {
        type: "p",
        text: "The sidebar follows that shape. Dashboard gives you the overview, Leads is where you spend most of your time, Booked Jobs is a filtered view of leads that are confirmed, and Payment Links is for taking money for something that is not a normal journey.",
      },
      {
        type: "note",
        text: "Nothing on the public website takes a booking automatically. Every job becomes real only when someone here confirms it.",
      },
    ],
  },
  {
    id: "booking-workflow",
    title: "The booking workflow, step by step",
    category: "Start here",
    summary:
      "From a customer filling in the form to the job being paid and marked complete. Read this one first.",
    keywords: [
      "workflow",
      "process",
      "how to",
      "booking",
      "journey",
      "day to day",
      "what do i do",
    ],
    blocks: [
      {
        type: "p",
        text: "This is the path almost every job takes. Steps 4 and 5 are optional depending on how the customer wants to pay.",
      },
      {
        type: "steps",
        items: [
          "The customer fills in the quote request form on the website. A lead appears in Leads with the status New, and you get a notification email.",
          "You open the lead and check the journey. Ring or message them if anything is unclear — the Quick Contact panel has their number and a WhatsApp link. Set the status to Contacted so it is clear someone has picked it up.",
          "You agree a price. Put it in the Quoted Price field and save. If you want to send it in writing, use Send Quote to create a formal quote the customer can open on the website.",
          "If the customer wants to pay by card, create a payment link on the quote and send it to them. They pay through Square and land back on a confirmation page.",
          "If they are paying cash on the day or by bank transfer, skip the payment link. You can mark the quote paid by hand once the money arrives.",
          "Set the status to Booked and put the driver's name in Assigned Driver. The job now appears under Booked Jobs.",
          "After the journey, set the status to Completed.",
        ],
      },
      {
        type: "note",
        text: "Use Admin Notes as you go. They are internal only and the customer never sees them — they are the quickest way for whoever picks the job up next to know what has already happened.",
      },
    ],
  },

  // ── Leads ────────────────────────────────────────────────────────────────
  {
    id: "lead-statuses",
    title: "Lead statuses and what they mean",
    category: "Leads",
    summary: "What each status is for, and when to move a lead on.",
    keywords: ["status", "new", "contacted", "quoted", "booked", "completed", "cancelled", "archived"],
    blocks: [
      {
        type: "p",
        text: "The status is how you and everyone else knows what still needs doing. Keeping it honest is what makes the list useful.",
      },
      {
        type: "rows",
        items: [
          ["New", "Just arrived, nobody has touched it. These are what you work through first."],
          ["Contacted", "Someone has spoken to the customer, but there is no agreed price yet."],
          ["Quoted", "A price has been given and you are waiting on the customer."],
          ["Booked", "Confirmed and going ahead. Appears under Booked Jobs."],
          ["Completed", "The journey has happened."],
          ["Cancelled", "Not going ahead, whoever called it off."],
          ["Archived", "Not a real job — spam, a duplicate, or a test. Keeps the list clean without deleting anything."],
        ],
      },
      {
        type: "note",
        text: "Archived is usually the better choice than deleting. Deleting is permanent and also removes any quotes and email replies attached to that lead.",
      },
    ],
  },
  {
    id: "replying-to-customers",
    title: "Replying to a customer by email",
    category: "Leads",
    summary:
      "Sending a written reply from the lead screen, and where it is recorded.",
    keywords: ["email", "reply", "message", "respond", "reply history"],
    blocks: [
      {
        type: "p",
        text: "On any lead there is a reply box. Give it a subject, write the message, and optionally include a price. It goes to the email address the customer gave, from your business address, and they can reply to it normally.",
      },
      {
        type: "p",
        text: "Every reply is kept under Reply History on that lead, with who sent it and when. If a colleague has already answered, you will see it there rather than emailing them twice.",
      },
      {
        type: "warn",
        text: "If email is not configured on the server, replies will not send. See \"Emails are not being sent\" for how to tell.",
      },
    ],
  },
  {
    id: "assigning-drivers",
    title: "Recording the price and assigning a driver",
    category: "Leads",
    summary: "The two fields that turn an enquiry into a job someone can run.",
    keywords: ["driver", "assign", "price", "quoted price", "allocate"],
    blocks: [
      {
        type: "p",
        text: "Quoted Price is the agreed fare for the journey. It is free text, so write it however you normally would — £45, or £95 return.",
      },
      {
        type: "p",
        text: "Assigned Driver is just the driver's name. Once it is filled in and the status is Booked, the job shows up under Booked Jobs with the price alongside it, which is the screen to work from on the day.",
      },
    ],
  },

  // ── Quotes & payment ─────────────────────────────────────────────────────
  {
    id: "sending-a-quote",
    title: "Sending a formal quote",
    category: "Quotes & payment",
    summary:
      "Creating a quote the customer can open on the website, and what goes on it.",
    keywords: ["quote", "send quote", "price", "formal", "written quote", "LPT"],
    blocks: [
      {
        type: "p",
        text: "A quote is a page on the website the customer can open, showing the journey, the price and how to pay. Every quote gets a reference like LPT-1234 and lives at lakesidetaxi.co.uk/quote/LPT-1234.",
      },
      { type: "p", text: "When you create one you can set:" },
      {
        type: "rows",
        items: [
          ["Price", "The fare you are quoting."],
          ["What's included", "Anything worth spelling out — meet and greet, waiting time, tolls."],
          ["Payment methods", "Turn cash, card and bank transfer on or off individually."],
          ["Bank details", "Sort code, account number and account name, shown only if bank transfer is on."],
          ["Valid until", "How long the price holds."],
          ["Message", "A personal note that appears on the quote."],
        ],
      },
      {
        type: "note",
        text: "Only switch on the payment methods you actually want for that job. If you would rather not take cash on an airport run at 4am, turn it off and the customer will not be offered it.",
      },
    ],
  },
  {
    id: "customer-quote-experience",
    title: "What the customer sees when you send a quote",
    category: "Quotes & payment",
    summary: "The customer's side of a quote, so you can talk them through it.",
    keywords: ["customer", "accept", "quote page", "what they see"],
    blocks: [
      {
        type: "p",
        text: "They open the link and see the journey details, the price, what is included, and the ways they can pay. There is an Accept button.",
      },
      {
        type: "p",
        text: "Accepting marks the quote as accepted so you can see they are happy with the price. It does not take payment — that is separate, and only happens if you have sent a card payment link or they pay you another way.",
      },
      {
        type: "rows",
        items: [
          ["Pending", "Sent, not yet answered."],
          ["Accepted", "The customer has accepted the price."],
          ["Paid", "Payment received, either through Square or marked by you."],
          ["Expired", "Past its valid until date."],
          ["Cancelled", "Withdrawn."],
        ],
      },
    ],
  },
  {
    id: "card-payments",
    title: "Taking card payment with Square",
    category: "Quotes & payment",
    summary: "Creating a payment link on a quote, and what happens after they pay.",
    keywords: ["square", "card", "payment link", "pay online", "take payment"],
    blocks: [
      {
        type: "steps",
        items: [
          "Open the lead and make sure a quote exists with the right price.",
          "Create the payment link on that quote.",
          "Send the customer the link, by email or WhatsApp.",
          "They pay on Square's own checkout page — their card details never touch our website.",
          "Once paid they are returned to a confirmation page on our site, and the quote flips to Paid automatically.",
        ],
      },
      {
        type: "note",
        text: "You do not have to do anything when a payment succeeds. Square tells the system directly and the quote updates itself.",
      },
    ],
  },
  {
    id: "adhoc-payment-links",
    title: "Ad-hoc payment links",
    category: "Quotes & payment",
    summary: "Taking money for something that is not attached to a lead.",
    keywords: ["payment links", "adhoc", "ad hoc", "invoice", "charge", "one off"],
    blocks: [
      {
        type: "p",
        text: "Payment Links in the sidebar is for charging someone when there is no lead behind it — a waiting time charge, a cleaning charge, an account settling up.",
      },
      {
        type: "p",
        text: "Enter the amount and a description, optionally the customer's name and email, and create the link. Copy it and send it however suits. The list shows whether each one has been paid.",
      },
      {
        type: "warn",
        text: "Deleting a payment link here only removes our record of it. It does not cancel the link in Square, and it does not refund anything already paid. If a customer should not be able to pay a link any more, cancel it in Square as well.",
      },
    ],
  },
  {
    id: "marking-paid",
    title: "Marking a quote as paid by hand",
    category: "Quotes & payment",
    summary: "For cash and bank transfers, where Square never sees the money.",
    keywords: ["cash", "bank transfer", "mark paid", "manual", "paid"],
    blocks: [
      {
        type: "p",
        text: "Card payments through Square mark themselves as paid. Anything else does not, because nothing tells the system the money arrived.",
      },
      {
        type: "p",
        text: "When a customer pays cash on the day or the bank transfer clears, open the lead and mark the quote as paid. That keeps the records straight for the accounts.",
      },
    ],
  },

  // ── Applications ─────────────────────────────────────────────────────────
  {
    id: "corporate-applications",
    title: "Corporate account applications",
    category: "Applications",
    summary: "Businesses, schools and councils applying for monthly billing.",
    keywords: ["corporate", "business", "account", "school", "council", "nhs", "billing"],
    blocks: [
      {
        type: "p",
        text: "These come from the corporate accounts page and include the organisation's details, who to contact, expected journey volumes and how they want to be billed.",
      },
      {
        type: "rows",
        items: [
          ["New", "Just arrived."],
          ["Reviewing", "Being looked at."],
          ["Approved", "Account agreed."],
          ["Rejected", "Turned down."],
          ["On hold", "Parked for now."],
        ],
      },
      {
        type: "note",
        text: "Approving here is a record of your decision. It does not create anything automatically — setting the account up on your side is still a manual job.",
      },
    ],
  },
  {
    id: "driver-applications",
    title: "Driver applications and their documents",
    category: "Applications",
    summary:
      "Reviewing people applying to drive, and handling the documents they upload.",
    keywords: [
      "driver",
      "application",
      "recruitment",
      "dbs",
      "licence",
      "badge",
      "documents",
      "download",
    ],
    blocks: [
      {
        type: "p",
        text: "Applications come from the become a driver page. The form adapts to the applicant, so a licensed owner-driver gives you far more than someone who is not licensed yet — that is expected, not missing information.",
      },
      {
        type: "p",
        text: "The list shows at a glance whether each applicant is already licensed, whether they have their own vehicle, and how many documents they attached.",
      },
      {
        type: "rows",
        items: [
          ["New", "Just arrived."],
          ["Reviewing", "Being checked."],
          ["Interview", "Invited in for a chat."],
          ["Approved", "Taking them on."],
          ["Rejected", "Not proceeding."],
          ["On hold", "Parked, often waiting on a document."],
        ],
      },
      {
        type: "p",
        text: "Open an application to download what they uploaded — badge, DVLA licence, DBS certificate, right to work, insurance, MOT, V5C. Documents are never attached to notification emails, so you always have to sign in to see them.",
      },
      {
        type: "warn",
        text: "These are somebody's identity documents. Do not forward them on, and delete applications you are not proceeding with — deleting removes the files from the server as well as the record.",
      },
    ],
  },

  // ── Housekeeping ─────────────────────────────────────────────────────────
  {
    id: "booked-jobs",
    title: "Booked Jobs",
    category: "Housekeeping",
    summary: "The working list of confirmed journeys.",
    keywords: ["booked", "jobs", "confirmed", "diary", "today"],
    blocks: [
      {
        type: "p",
        text: "Booked Jobs is not a separate list — it is every lead whose status is Booked, showing the customer, the journey, the date and time, and the agreed price.",
      },
      {
        type: "p",
        text: "A job leaves this screen when you change its status, normally to Completed after the journey.",
      },
    ],
  },
  {
    id: "deleting-records",
    title: "Deleting records, and what goes with them",
    category: "Housekeeping",
    summary:
      "Single and bulk delete, and the things that get removed that you might not expect.",
    keywords: ["delete", "remove", "bulk", "erase", "tidy", "clean up"],
    blocks: [
      {
        type: "p",
        text: "Every table has a checkbox on each row and one in the header to select everything on the page. Select anything and a red bar appears with Delete selected. There is also a bin icon on each row for deleting just that one.",
      },
      { type: "p", text: "Deleting is permanent. There is no undo and no bin to recover from." },
      {
        type: "rows",
        items: [
          ["Deleting a lead", "Also deletes its quotes and its email reply history."],
          [
            "Deleting a driver application",
            "Also permanently erases every document they uploaded from the server.",
          ],
          [
            "Deleting a payment link",
            "Only removes our record. The link still works in Square and nothing is refunded.",
          ],
        ],
      },
      {
        type: "note",
        text: "Select all only ever selects the rows on the page you are looking at, not every record matching your filter. If you want to clear more than one page, do it a page at a time.",
      },
      {
        type: "note",
        text: "For tidying up rather than genuinely removing something, set a lead to Archived instead. It disappears from the normal view without destroying anything.",
      },
    ],
  },
  {
    id: "data-protection",
    title: "Data protection requests",
    category: "Housekeeping",
    summary:
      "What to do when someone asks for their data, or asks you to delete it.",
    keywords: ["gdpr", "data protection", "erasure", "right to be forgotten", "subject access", "ico"],
    blocks: [
      {
        type: "p",
        text: "People have a legal right to ask what you hold about them and, in most cases, to have it deleted. You have one month to respond and you cannot charge for it.",
      },
      {
        type: "steps",
        items: [
          "Find everything about them — search Leads by name or email, and check corporate and driver applications too.",
          "If they want a copy, send them what you hold.",
          "If they want it deleted, delete the records. For a driver applicant this also wipes their uploaded documents from the server.",
          "Reply to confirm what you have done.",
        ],
      },
      {
        type: "warn",
        text: "You do not have to delete records you are legally required to keep. Payment and booking records are kept for six years for HMRC. Tell the person that is why, rather than simply refusing.",
      },
    ],
  },
  {
    id: "settings-and-password",
    title: "Settings, and changing the admin password",
    category: "Housekeeping",
    summary:
      "What the Settings screen shows, and why the password is not changed there.",
    keywords: ["settings", "password", "login", "credentials", "change password", "security"],
    blocks: [
      {
        type: "p",
        text: "Settings shows your business details as they appear across the website, and which account you are signed in as. It is a reference screen — there is nothing to edit on it.",
      },
      {
        type: "warn",
        text: "The admin email and password are not stored in the dashboard and cannot be changed from it. They are set by the ADMIN_EMAIL and ADMIN_PASSWORD environment variables on the server, and re-applied every time the server restarts. Changing them means changing those variables in Coolify and redeploying — anything changed elsewhere would be overwritten on the next restart.",
      },
      {
        type: "note",
        text: "Because of that, treat the password as shared infrastructure. If someone leaves, change the variable and redeploy rather than assuming they have forgotten it.",
      },
    ],
  },

  // ── When something goes wrong ────────────────────────────────────────────
  {
    id: "emails-not-sending",
    title: "Emails are not being sent",
    category: "When something goes wrong",
    summary:
      "No notifications arriving, or a customer says they never got your reply.",
    keywords: ["email", "smtp", "not sending", "notification", "missing", "spam"],
    blocks: [
      {
        type: "p",
        text: "Email is optional on this system. The website and dashboard work perfectly well without it — leads still arrive, quotes still work — but nothing gets emailed to anyone. If notifications stopped, that is the first thing to check.",
      },
      {
        type: "steps",
        items: [
          "Check whether a new lead still appears in the dashboard. If it does, the form is fine and the problem is only email.",
          "Ask the customer to check their spam folder.",
          "If nothing is sending at all, the mail settings on the server need checking — this is a Coolify environment variable job, not something in the dashboard.",
        ],
      },
      {
        type: "note",
        text: "A failed email never loses a booking. The lead is saved before any email is attempted, which is why a mail problem never costs you work.",
      },
    ],
  },
  {
    id: "payment-link-problems",
    title: "A payment link will not create",
    category: "When something goes wrong",
    summary: "What to do when creating a card payment link fails.",
    keywords: ["square", "payment link", "failed", "error", "not working"],
    blocks: [
      {
        type: "p",
        text: "Payment links are created by Square. If one fails, it is almost always the connection to Square rather than anything about the quote.",
      },
      {
        type: "steps",
        items: [
          "Try once more — a single failure is often a momentary connection problem.",
          "Check the amount is sensible and greater than zero.",
          "If it keeps failing, take payment another way for now: cash on the day, or bank transfer using the details on the quote. The job does not have to wait.",
        ],
      },
    ],
  },
  {
    id: "document-download-problems",
    title: "A driver's document will not download",
    category: "When something goes wrong",
    summary: "When a document is listed on an application but will not open.",
    keywords: ["document", "download", "missing", "driver", "file", "404"],
    blocks: [
      {
        type: "p",
        text: "If a document is listed but will not download, the record exists while the file itself is missing from the server. That should not happen, but if it does the file cannot be recovered.",
      },
      {
        type: "p",
        text: "Ask the applicant to send it again — replying to their acknowledgement email reaches you directly.",
      },
      {
        type: "note",
        text: "If you are being asked to sign in again when you click download, your session has simply expired. Sign in and try again.",
      },
    ],
  },
];
