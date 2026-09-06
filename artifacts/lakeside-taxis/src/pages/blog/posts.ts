/**
 * Blog content.
 *
 * Posts are structured data, not free HTML. Every post renders through the one
 * template in BlogPost.tsx, so a new post can never introduce its own type
 * scale, its own spacing or its own idea of what a callout looks like — it
 * fills in the same slots the other posts fill in.
 *
 * Adding a post: append an entry here. The route, the index card, the cover
 * graphic, the schema and the sitemap entry all follow from this object.
 * Remember to add the URL to public/sitemap.xml and public/llms.txt.
 */

/** Chooses which of the shared cover graphics a post carries. See BlogCover.tsx. */
export type CoverVariant = "airport" | "cruise" | "school";

export interface PostSection {
  heading: string;
  /** Paragraphs. Rendered in order, above the list and note. */
  body: string[];
  /** Optional structured points — rendered as the hairline-divided row list. */
  list?: { title: string; text: string }[];
  /** Optional single highlighted aside, closing the section. */
  note?: { title: string; text: string };
}

export interface BlogPost {
  slug: string;
  /** On-page <h1>. */
  title: string;
  /** <title> — carries the brand suffix. */
  metaTitle: string;
  metaDescription: string;
  category: string;
  cover: CoverVariant;
  /** ISO date, used for schema, <time> and display. */
  published: string;
  readMinutes: number;
  /** Index card summary. */
  excerpt: string;
  /** Hero standfirst. */
  lede: string;
  /** The "short answer" box directly under the cover. */
  keyPoints: string[];
  sections: PostSection[];
  faq: { q: string; a: string }[];
  related: { label: string; href: string; desc: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "how-early-leave-thurrock-heathrow-flight",
    title: "How early should you leave Thurrock for a Heathrow flight?",
    metaTitle:
      "How Early to Leave Thurrock for a Heathrow Flight | Lakeside & Purfleet Taxis",
    metaDescription:
      "A practical guide to timing an airport transfer from Grays, Purfleet and Thurrock to Heathrow — how to work backwards from your check-in time and why the Dartford Crossing decides everything.",
    category: "Airport travel",
    cover: "airport",
    published: "2026-09-02",
    readMinutes: 6,
    excerpt:
      "Most people time their airport run from the wrong end. Here's how to work backwards from check-in — and why the M25 between Thurrock and Heathrow is the part that catches everybody out.",
    lede: "Getting the pickup time right is the difference between a calm morning and a sprint through Terminal 5. Here's how we work it out for customers travelling from Grays, Purfleet and the rest of Thurrock.",
    keyPoints: [
      "Work backwards from the check-in desk, never forwards from your front door.",
      "For a Heathrow flight from Thurrock, most passengers should be leaving three to four hours before departure.",
      "The M25 anticlockwise via the Dartford Crossing is the single biggest variable — treat it as the reason for your buffer, not an excuse to skip it.",
      "Book the night before at the latest. The 3am and 4am slots go first, and they go early.",
    ],
    sections: [
      {
        heading: "Start at the check-in desk, not your front door",
        body: [
          "The most common mistake we see is planning the journey forwards — someone looks up the drive time, adds a bit, and sets an alarm. It feels sensible and it goes wrong constantly, because the drive is only one of four things that has to happen before you sit down on the plane.",
          "Work the other way instead. Start at your departure time and subtract, in order: the time the gate closes, the time you need for security and passport control, the time the airline wants you at check-in, and only then the drive itself. What's left is when the taxi should be outside your house.",
        ],
        list: [
          {
            title: "Airline check-in guidance",
            text: "Short-haul carriers typically ask for two hours before departure, long-haul for three. That advice is on your booking confirmation — use their number, not a general rule.",
          },
          {
            title: "Bag drop and security",
            text: "Hold luggage means joining the bag-drop queue before security, which at Heathrow in a school holiday can be the slowest part of the whole morning.",
          },
          {
            title: "Terminal walking time",
            text: "Heathrow's terminals are large. Getting from the drop-off point to your gate is a genuine ten to twenty minutes, more at T5 with a transit train.",
          },
          {
            title: "The drive from Thurrock",
            text: "Only now does the road time come into it — and it's the part with the widest range between best case and bad case.",
          },
        ],
      },
      {
        heading: "The Dartford Crossing is the variable that decides everything",
        body: [
          "There's no route from Thurrock to Heathrow that avoids the M25, and the anticlockwise run means the Dartford Crossing sits right at the start of your journey. At three in the morning it's a non-event. At seven on a weekday it can add a very long time to a journey that otherwise takes barely over an hour.",
          "This is why we don't quote a single drive time for Heathrow. The honest answer is that the same journey has two quite different durations depending on when you set off, and the buffer you build in is really a buffer against the crossing and the M25 approach to the M4.",
          "If your flight is a mid-morning or lunchtime departure, that's the one to be generous with. You're travelling straight into the peak, and no local knowledge makes stationary traffic move.",
        ],
        note: {
          title: "The rule we actually give people",
          text: "For a short-haul Heathrow departure from Thurrock, aim to be collected around three hours before your flight — and closer to four if you're checking in bags, travelling with children, or departing between 6am and 10am. If that feels like too much, it is exactly the amount that stops a bad traffic morning turning into a missed flight.",
        },
      },
      {
        heading: "The early hours are the easy part — and the part people get wrong",
        body: [
          "The 3am and 4am departures are, counter-intuitively, the simplest journeys we do. The roads are empty, the crossing is clear, and the drive is about as predictable as it ever gets. What goes wrong at that hour is never traffic — it's the booking.",
          "Those slots are finite. Every firm in the area has a limited number of drivers willing to start at half past two in the morning, and on a Saturday in August they are all spoken for well in advance. Ringing round at 9pm the night before for a 3am pickup is a genuinely difficult position to be in, and it's an avoidable one.",
          "Book the early runs as soon as you've booked the flight. It costs nothing to have it in the diary, and it means the driver knows your address, your terminal and your flight number long before the morning itself.",
        ],
      },
      {
        heading: "Fixed price beats a meter on an airport run",
        body: [
          "An airport transfer is exactly the kind of journey where a meter works against you. The fare becomes a function of the traffic, which means the worse your morning goes, the more you pay at the end of it — and you have no idea what the number will be until you're standing outside departures.",
          "Every airport transfer we quote is a fixed price agreed before you travel. If the M25 is having a bad day, that's our problem to absorb, not a surprise added to your fare. It also means you can budget the trip properly when you're booking the flight rather than guessing.",
          "We cover Heathrow, Gatwick, Stansted, Luton, London City and Southend from across Thurrock, and the same working-backwards logic applies to all of them — only the drive times and the pinch points change.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does it take to drive from Grays to Heathrow?",
        a: "Off-peak and overnight it's a straightforward run. In weekday morning traffic the same journey can take considerably longer, because the M25 anticlockwise via the Dartford Crossing is the only realistic route. We quote on the time of day you're actually travelling rather than a single average.",
      },
      {
        q: "How far in advance should I book an airport taxi?",
        a: "As soon as your flight is booked, particularly for departures before 6am. Early-hours slots are limited and they fill first during school holidays and bank holiday weekends.",
      },
      {
        q: "Will I pay more if we get stuck in traffic?",
        a: "No. Airport transfers are quoted at a fixed price agreed before you travel, so heavy traffic doesn't change what you pay.",
      },
      {
        q: "Do you cover airports other than Heathrow?",
        a: "Yes — Gatwick, Stansted, Luton, London City and Southend, plus return transfers with flight arrival monitoring.",
      },
    ],
    related: [
      {
        label: "Heathrow transfers",
        href: "/airport-transfers/heathrow",
        desc: "Fixed-price transfers from Thurrock to all Heathrow terminals.",
      },
      {
        label: "All airport transfers",
        href: "/airport-transfers",
        desc: "Heathrow, Gatwick, Stansted, Luton, London City and Southend.",
      },
      {
        label: "Taxis in Grays",
        href: "/areas/grays",
        desc: "Local journeys and airport runs across RM17 and RM20.",
      },
    ],
  },

  {
    slug: "tilbury-cruise-terminal-transfer-guide",
    title: "Sailing from Tilbury: getting to the cruise terminal without the stress",
    metaTitle:
      "Tilbury Cruise Terminal Transfer Guide | Lakeside & Purfleet Taxis",
    metaDescription:
      "How to plan your transfer to London International Cruise Terminal at Tilbury — boarding windows, cruise luggage, the return leg, and why a fixed-price door-to-ship transfer beats parking.",
    category: "Cruise transfers",
    cover: "cruise",
    published: "2026-08-26",
    readMinutes: 5,
    excerpt:
      "Your boarding window isn't your departure time, cruise luggage isn't airline luggage, and the return leg is the one everybody forgets to book. A practical guide to sailing out of Tilbury.",
    lede: "London International Cruise Terminal sits on our doorstep in Tilbury, and we run transfers to it all year. These are the things that make the difference between arriving relaxed and arriving flustered.",
    keyPoints: [
      "Your boarding window is a scheduled slot, not a deadline — arriving hours early doesn't get you on board sooner.",
      "Cruise luggage is heavier and bulkier than airline luggage. Say what you're bringing when you book the vehicle.",
      "Book the return leg at the same time as the outbound. It's the one people forget, and you'll be booking it while at sea otherwise.",
      "For a two-week cruise, a door-to-ship transfer usually works out better than leaving a car at the terminal.",
    ],
    sections: [
      {
        heading: "Your boarding window is not your departure time",
        body: [
          "Cruise lines don't board everybody at once. You'll be given a boarding window — a slot, usually an hour or two wide — and the whole terminal operation is built around people arriving inside their own slot rather than all at 9am.",
          "This trips up people who are used to flying, where earlier is generally better. At a cruise terminal, turning up three hours before your window doesn't get you on board any faster. It gets you a long wait in a terminal building with your bags.",
          "Plan the transfer to land you comfortably inside your window with room for traffic, and no more than that. When you book with us, give us the window rather than the sailing time — it's the number the whole day should be built around.",
        ],
      },
      {
        heading: "Cruise luggage is a different problem to airline luggage",
        body: [
          "People pack differently for a cruise. Two weeks away, formal nights, and no strict weight limit at the pier means large hard cases rather than airline carry-ons — and often more of them per person than anyone quite admits when booking a car.",
          "It's worth being honest about this at the quote stage. A family of four with eight full-size cases and a couple of hand-luggage bags is a bigger vehicle than a family of four going to Stansted, and the time to establish that is when we're arranging the booking rather than when the driver is standing on your drive looking at the pile.",
        ],
        list: [
          {
            title: "Count the cases, not the people",
            text: "Tell us how many bags as well as how many passengers. Vehicle size is decided by the luggage far more often than by the headcount.",
          },
          {
            title: "Mobility aids and wheelchairs",
            text: "Mention these when you book so the right vehicle is allocated rather than assumed.",
          },
          {
            title: "Multiple pickup addresses",
            text: "Travelling with family from another address? We can build multi-stop pickups into a single transfer instead of running two cars.",
          },
        ],
      },
      {
        heading: "The return leg is the one everybody forgets",
        body: [
          "Disembarkation morning is not the moment you want to be arranging transport. You've come off a ship with all your luggage, alongside a few thousand other people doing the same thing, usually early, usually tired.",
          "Book the return at the same time as the outbound. We track the ship's arrival, so if you dock late the pickup moves with it rather than leaving you paying for a driver who's been sitting there since six.",
          "For the return we meet you inside the terminal with a name board rather than waiting in a car park and hoping you find us — which matters most on exactly the morning when nobody has the patience for a phone call about which exit you're standing at.",
        ],
        note: {
          title: "Give us the ship, not just the time",
          text: "Ship name and sailing date are more useful to us than an arrival time you were quoted months ago. Schedules shift, and knowing the vessel means we can check where it actually is on the day.",
        },
      },
      {
        heading: "Transfer or park at the terminal?",
        body: [
          "For a short cruise with one or two people close by, driving and parking can be perfectly reasonable. For a two-week sailing with a full car of passengers and luggage, the maths usually goes the other way once you total up the parking fee for the whole trip.",
          "The other half of the argument isn't financial. It's that you finish your holiday by being dropped at your own front door rather than by locating your car, loading it, and driving home tired. On disembarkation morning that's worth more than it sounds when you're booking in January.",
          "We collect from anywhere in the UK for Tilbury sailings, not just Thurrock — the local runs from Grays, Purfleet and Chafford Hundred are simply the ones we do most.",
        ],
      },
    ],
    faq: [
      {
        q: "How early should I arrive at Tilbury cruise terminal?",
        a: "Aim to arrive within the boarding window your cruise line gave you, with enough margin for traffic. Arriving well before your window generally means waiting in the terminal rather than boarding early.",
      },
      {
        q: "Can you collect us from outside Essex for a Tilbury cruise?",
        a: "Yes. We collect from any UK address for transfers to London International Cruise Terminal, at a fixed price agreed before travel.",
      },
      {
        q: "What happens if our ship docks late on the way back?",
        a: "We monitor the ship's arrival and move the pickup to match, so a late docking doesn't cost you a missed transfer.",
      },
      {
        q: "Will the driver help with cruise luggage?",
        a: "Yes, and we allocate the vehicle based on the number of bags you tell us about — so let us know the case count when you book, not on the day.",
      },
    ],
    related: [
      {
        label: "Cruise terminal transfers",
        href: "/tilbury-cruise-terminal",
        desc: "Door-to-ship transfers to London International Cruise Terminal.",
      },
      {
        label: "Taxis in Tilbury",
        href: "/areas/tilbury",
        desc: "Local taxis across Tilbury Town, the docks and Chadwell St Mary.",
      },
      {
        label: "Long distance travel",
        href: "/long-distance-travel",
        desc: "UK-wide journeys at a fixed price agreed up front.",
      },
    ],
  },

  {
    slug: "school-run-taxi-thurrock-what-to-check",
    title: "Booking a school run taxi in Thurrock: what to check before you commit",
    metaTitle:
      "School Run Taxi in Thurrock — What to Check | Lakeside & Purfleet Taxis",
    metaDescription:
      "Putting your child in a taxi every morning is a bigger decision than a one-off booking. The questions worth asking any Thurrock firm about drivers, licensing, cover arrangements and pricing.",
    category: "School runs",
    cover: "school",
    published: "2026-08-18",
    readMinutes: 5,
    excerpt:
      "A regular school run is a standing arrangement involving your child, not a one-off booking. These are the questions worth asking any firm before you set it up — including us.",
    lede: "Handing over the morning run is a bigger decision than booking a taxi to the station. Here's what to ask, what a good answer sounds like, and how we do it.",
    keyPoints: [
      "Ask who is driving — by name — and whether it's the same person every day.",
      "Check the firm and its drivers are licensed private hire with the local authority.",
      "Ask what happens on a sick day, an INSET day and a snow day before you need to know.",
      "The price should be fixed and weekly, not metered per journey.",
    ],
    sections: [
      {
        heading: "Ask who is actually driving",
        body: [
          "For a one-off airport run it barely matters which driver turns up. For a school run it is the entire question. You're arranging for the same person to collect your child every weekday morning for a term, and the answer to \"who will that be?\" should be a name, not a shrug about whoever is free.",
          "A firm that rotates whoever is available across a regular school booking is telling you something about how they treat it. Children — younger ones especially — settle far better with one familiar driver, and a driver who does the same run daily knows the route, the road closures, and what your child looks like at the school gate.",
          "It's also fair to ask about DBS checks, and any firm doing school work regularly should be able to answer without hesitation. We introduce you to your driver before the first run rather than sending a stranger to your door on day one.",
        ],
      },
      {
        heading: "Check the licensing, properly",
        body: [
          "Private hire in England is licensed at council level — the vehicle, the driver and the operator all hold separate licences. For a firm operating across Thurrock that means licensing with the local authority, and it's a reasonable thing to ask about directly.",
          "Licensed private hire must be pre-booked through the operator. That's not a technicality; it's the mechanism that means there's a record of who was driving your child and when. An arrangement made informally with a driver, outside the operator's booking system, doesn't have that.",
          "If a firm is vague about licensing, that's your answer. It should be the easiest question of the conversation.",
        ],
        list: [
          {
            title: "Ask about the operator licence",
            text: "The company itself must hold one — not just the individual drivers.",
          },
          {
            title: "Ask about the driver",
            text: "Licensed private hire driver, and what background checking the firm does for school work.",
          },
          {
            title: "Ask about the vehicle",
            text: "Licensed and tested, with the appropriate seating and child restraints for your child's age.",
          },
          {
            title: "Keep it inside the booking system",
            text: "Arrange changes through the office rather than privately with the driver, so the journey stays on the record.",
          },
        ],
      },
      {
        heading: "Find out what happens when things change",
        body: [
          "The school year is full of exceptions. INSET days, sickness, half terms, a snow day, an after-school club that runs late, a change of address halfway through the year. The question isn't whether these will happen — it's what the arrangement does when they do.",
          "Ask specifically: what if my child is off sick on Tuesday? Am I charged? How much notice do you need? What happens if the school closes at short notice? A firm that's done this before will have straightforward answers, because they've handled every one of those before.",
          "Our own arrangement is flexible around holidays, INSET days and schedule changes, and if there's ever a problem the answer is to ring the office directly rather than working it out with the driver on the pavement.",
        ],
        note: {
          title: "One number, not a chain of messages",
          text: "The point of using an operator rather than an informal arrangement is that on a morning when something has gone wrong, there is an office to ring that can actually change what happens next.",
        },
      },
      {
        heading: "The price should be fixed, and weekly",
        body: [
          "A school run is the same journey, at the same time, on the same days. There is no good reason for it to be metered, and a metered fare on a regular run means your weekly cost changes every time the traffic does.",
          "Ask for a fixed weekly price for the route, agreed before the first run. That way it's a household cost you can plan around like any other, rather than a variable line that spikes in November when it's dark and wet.",
          "It also makes it easy to compare firms honestly, because you're comparing one number for the same work rather than trying to guess how each one's meter will behave in term time.",
        ],
      },
    ],
    faq: [
      {
        q: "Will the same driver do the school run every day?",
        a: "That's how a regular school run should work, and it's how we arrange ours — we introduce you to your driver before the first run so your child isn't meeting a stranger on day one.",
      },
      {
        q: "What happens if my child is off sick?",
        a: "Let the office know and we'll adjust. Our school run arrangements are flexible around sickness, INSET days, holidays and schedule changes.",
      },
      {
        q: "How is a school run priced?",
        a: "As a fixed weekly price for the route, agreed before the first run, rather than a meter that changes with the traffic.",
      },
      {
        q: "Which areas do you cover for school runs?",
        a: "Across Thurrock — Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope and Corringham.",
      },
    ],
    related: [
      {
        label: "School run service",
        href: "/school-runs",
        desc: "Regular morning and afternoon runs at a fixed weekly price.",
      },
      {
        label: "Areas we cover",
        href: "/areas-covered",
        desc: "Every town and area we serve across Thurrock and Essex.",
      },
      {
        label: "Local taxis",
        href: "/local-taxis",
        desc: "Everyday journeys across Thurrock, day and night.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Newest first — the index and the "more posts" rail both read in this order. */
export const POSTS_BY_DATE: BlogPost[] = [...POSTS].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
