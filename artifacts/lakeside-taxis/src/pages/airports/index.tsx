import AirportPage from "./AirportPage";

const airportData = {
  heathrow: {
    airportName: "Heathrow",
    airportCode: "LHR",
    distance: "25–30 miles",
    description: "Pre-booked Heathrow airport transfers from Thurrock, Grays and Purfleet. All terminals covered.",
    content: "Heathrow is the UK's busiest international airport and one of our most frequently requested destinations. We provide direct transfers from any address in Thurrock — Grays, Purfleet, Chafford Hundred, Tilbury and beyond — to all five Heathrow terminals (T1, T2, T3, T4, T5). Our drivers know the airport inside out and will have you at the correct terminal with time to spare. Meet and greet available on return journeys.",
  },
  gatwick: {
    airportName: "Gatwick",
    airportCode: "LGW",
    distance: "45–55 miles",
    description: "Gatwick airport transfers from Thurrock. North and South terminal. Pre-booked, reliable service.",
    content: "Gatwick is London's second-busiest airport, serving the south of England with a huge range of short and long-haul destinations. We transfer Thurrock passengers to both the North and South terminals at Gatwick, providing early morning pickups and late evening arrivals. Our drivers are familiar with Gatwick's layout and will ensure a smooth start to your journey.",
  },
  stansted: {
    airportName: "Stansted",
    airportCode: "STN",
    distance: "30–40 miles",
    description: "Stansted airport transfers from Thurrock, Grays and Purfleet. Budget airline hub with early morning runs.",
    content: "Stansted Airport is a major hub for budget airlines including Ryanair and easyJet. Many Thurrock passengers fly from Stansted, particularly for European and short-haul destinations. We're experienced with early morning Stansted departures — even 3am or 4am pickups are not unusual for us. Direct transfers from anywhere in Thurrock to Stansted's single terminal.",
  },
  luton: {
    airportName: "Luton",
    airportCode: "LTN",
    distance: "40–50 miles",
    description: "Luton airport transfers from Thurrock and Essex. Pre-booked taxi service to and from Luton.",
    content: "Luton Airport serves a wide range of European destinations and is popular with Thurrock travellers heading to holiday destinations across Spain, Greece and beyond. We provide comfortable, direct transfers from Thurrock to Luton, avoiding the stress of trains and buses with your luggage. Return transfers available — your driver will be waiting when you land.",
  },
  "london-city": {
    airportName: "London City",
    airportCode: "LCY",
    distance: "15–20 miles",
    description: "London City Airport transfers from Thurrock. Ideal for business travel across the Docklands.",
    content: "London City Airport is the closest major airport to Thurrock and is primarily used for business travel, with fast connections across Europe. Located in the Royal Docks, it's well positioned for Thurrock passengers — particularly those heading to European financial centres. Our discreet, punctual service is ideal for business travellers flying from London City.",
  },
  southend: {
    airportName: "Southend",
    airportCode: "SEN",
    distance: "25–30 miles",
    description: "Southend Airport transfers from Thurrock. Essex's own airport, conveniently close.",
    content: "London Southend Airport is Essex's own airport and one of the most convenient options for Thurrock residents. Serving popular European holiday destinations, Southend Airport offers a relaxed, uncrowded alternative to the major London airports. We provide taxi transfers from all areas of Thurrock direct to Southend Airport's terminal, and return pickups when you arrive home.",
  },
};

export function HeathrowPage() {
  const d = airportData.heathrow;
  return <AirportPage {...d} />;
}
export function GatwickPage() {
  const d = airportData.gatwick;
  return <AirportPage {...d} />;
}
export function StanstedPage() {
  const d = airportData.stansted;
  return <AirportPage {...d} />;
}
export function LutonPage() {
  const d = airportData.luton;
  return <AirportPage {...d} />;
}
export function LondonCityPage() {
  const d = airportData["london-city"];
  return <AirportPage {...d} />;
}
export function SouthendPage() {
  const d = airportData.southend;
  return <AirportPage {...d} />;
}
