import AreaPage from "./AreaPage";

const areaData: Record<string, {
  areaName: string;
  postcode?: string;
  description: string;
  content: string;
}> = {
  grays: {
    areaName: "Grays",
    postcode: "RM17, RM20",
    description: "Reliable local taxis in Grays, Thurrock. Local journeys, airport transfers and more.",
    content: "Grays is the largest town in Thurrock and our home patch. We know every road, every postcode and every shortcut. Whether you need a taxi to Grays station, a run to Lakeside, or an early morning Heathrow departure, our drivers are ready. Serving Grays town centre, Chafford Hundred, West Thurrock and all surrounding areas.",
  },
  purfleet: {
    areaName: "Purfleet",
    postcode: "RM19",
    description: "Local taxis in Purfleet, Essex. Airport transfers, local runs and corporate travel.",
    content: "Purfleet sits on the Thames between Grays and the London border. Our Purfleet taxi service covers the residential areas, the retail parks and easy access to the Dartford Crossing for London-bound journeys. Ideal for airport transfers, corporate travel and local runs across Thurrock.",
  },
  "chafford-hundred": {
    areaName: "Chafford Hundred",
    postcode: "RM16",
    description: "Taxis in Chafford Hundred. Chafford Hundred station, Lakeside and airport transfers.",
    content: "Chafford Hundred is a modern residential area in Thurrock with excellent rail links from Chafford Hundred station. We provide taxis across the estate and beyond, including runs to Lakeside shopping centre, Grays town centre, and direct airport transfers to Heathrow and Gatwick.",
  },
  tilbury: {
    areaName: "Tilbury",
    postcode: "RM18",
    description: "Local taxis in Tilbury, Essex. Tilbury Town, Tilbury Docks, airport transfers.",
    content: "Tilbury is a town with a proud history on the banks of the Thames. Our local taxi service covers Tilbury Town, Tilbury Docks, Chadwell St Mary and surrounding villages. We provide reliable journeys for local travel, airport transfers and long-distance runs.",
  },
  "south-ockendon": {
    areaName: "South Ockendon",
    postcode: "RM15",
    description: "Taxis in South Ockendon. Local and airport taxi service across RM15.",
    content: "South Ockendon is a large residential area in the south of Thurrock. Our taxi service covers the whole area including North Stifford, Belhus and surrounding roads. With easy access to the M25, we're well positioned for airport transfers to Heathrow, Stansted and beyond.",
  },
  aveley: {
    areaName: "Aveley",
    postcode: "RM15",
    description: "Local taxis in Aveley, Essex. Reliable taxis from Aveley to Grays, Lakeside and airports.",
    content: "Aveley is a village in Thurrock with a strong community spirit. Our taxi service serves Aveley village and the surrounding areas, offering local runs to Grays and Lakeside as well as airport transfers and long-distance journeys. A friendly, local service from your local taxi company.",
  },
  "west-thurrock": {
    areaName: "West Thurrock",
    postcode: "RM20",
    description: "Taxis in West Thurrock. Lakeside, Grays border, RM20. Airport transfers available.",
    content: "West Thurrock is home to the Lakeside shopping and entertainment complex and sits alongside Grays in the west of the borough. Whether you're heading to Lakeside, to Grays station or to Heathrow airport, our West Thurrock taxi service provides reliable, pre-booked transport.",
  },
  "stanford-le-hope": {
    areaName: "Stanford-le-Hope",
    postcode: "SS17",
    description: "Taxis in Stanford-le-Hope. Local taxi service and airport transfers from SS17.",
    content: "Stanford-le-Hope is a town in the east of Thurrock, well connected by rail. Our taxi service covers Stanford-le-Hope town centre, Corringham Road and the surrounding villages. We provide local runs, airport transfers and long-distance journeys from Stanford-le-Hope.",
  },
  corringham: {
    areaName: "Corringham",
    postcode: "SS17",
    description: "Taxis in Corringham, Essex. Local taxi and airport transfer service from Corringham.",
    content: "Corringham is a town in east Thurrock, neighbouring Stanford-le-Hope. Our taxi service covers Corringham village, Fobbing Road and surrounding areas. We offer local runs across Thurrock, airport transfers to all major London airports, and corporate travel for local businesses.",
  },
};

export function GraysPage() {
  const d = areaData["grays"];
  return <AreaPage areaName={d.areaName} areaSlug="grays" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function PurfleetPage() {
  const d = areaData["purfleet"];
  return <AreaPage areaName={d.areaName} areaSlug="purfleet" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function ChaffordHundredPage() {
  const d = areaData["chafford-hundred"];
  return <AreaPage areaName={d.areaName} areaSlug="chafford-hundred" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function TilburyPage() {
  const d = areaData["tilbury"];
  return <AreaPage areaName={d.areaName} areaSlug="tilbury" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function SouthOckendonPage() {
  const d = areaData["south-ockendon"];
  return <AreaPage areaName={d.areaName} areaSlug="south-ockendon" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function AveleyPage() {
  const d = areaData["aveley"];
  return <AreaPage areaName={d.areaName} areaSlug="aveley" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function WestThurrockPage() {
  const d = areaData["west-thurrock"];
  return <AreaPage areaName={d.areaName} areaSlug="west-thurrock" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function StanfordLeHopePage() {
  const d = areaData["stanford-le-hope"];
  return <AreaPage areaName={d.areaName} areaSlug="stanford-le-hope" postcode={d.postcode} description={d.description} content={d.content} />;
}
export function CorringhamPage() {
  const d = areaData["corringham"];
  return <AreaPage areaName={d.areaName} areaSlug="corringham" postcode={d.postcode} description={d.description} content={d.content} />;
}
