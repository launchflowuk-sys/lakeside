import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import LocalTaxis from "@/pages/LocalTaxis";
import AirportTransfers from "@/pages/AirportTransfers";
import CorporateAccounts from "@/pages/CorporateAccounts";
import SchoolRuns from "@/pages/SchoolRuns";
import LongDistanceTravel from "@/pages/LongDistanceTravel";
import AreasCovered from "@/pages/AreasCovered";
import QuoteRequest from "@/pages/QuoteRequest";
import ThankYou from "@/pages/ThankYou";

// Area pages
import {
  GraysPage,
  PurfleetPage,
  ChaffordHundredPage,
  TilburyPage,
  SouthOckendonPage,
  AveleyPage,
  WestThurrockPage,
  StanfordLeHopePage,
  CorringhamPage,
} from "@/pages/areas";

// Airport pages
import {
  HeathrowPage,
  GatwickPage,
  StanstedPage,
  LutonPage,
  LondonCityPage,
  SouthendPage,
} from "@/pages/airports";

// Legal pages
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import Terms from "@/pages/legal/Terms";
import CookiePolicy from "@/pages/legal/CookiePolicy";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLeads from "@/pages/admin/Leads";
import AdminLeadDetail from "@/pages/admin/LeadDetail";
import AdminBooked from "@/pages/admin/Booked";
import AdminSettings from "@/pages/admin/Settings";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/local-taxis" component={LocalTaxis} />
      <Route path="/airport-transfers" component={AirportTransfers} />
      <Route path="/airport-transfers/heathrow" component={HeathrowPage} />
      <Route path="/airport-transfers/gatwick" component={GatwickPage} />
      <Route path="/airport-transfers/stansted" component={StanstedPage} />
      <Route path="/airport-transfers/luton" component={LutonPage} />
      <Route path="/airport-transfers/london-city" component={LondonCityPage} />
      <Route path="/airport-transfers/southend" component={SouthendPage} />
      <Route path="/corporate-accounts" component={CorporateAccounts} />
      <Route path="/school-runs" component={SchoolRuns} />
      <Route path="/long-distance-travel" component={LongDistanceTravel} />
      <Route path="/areas-covered" component={AreasCovered} />
      <Route path="/areas/grays" component={GraysPage} />
      <Route path="/areas/purfleet" component={PurfleetPage} />
      <Route path="/areas/chafford-hundred" component={ChaffordHundredPage} />
      <Route path="/areas/tilbury" component={TilburyPage} />
      <Route path="/areas/south-ockendon" component={SouthOckendonPage} />
      <Route path="/areas/aveley" component={AveleyPage} />
      <Route path="/areas/west-thurrock" component={WestThurrockPage} />
      <Route path="/areas/stanford-le-hope" component={StanfordLeHopePage} />
      <Route path="/areas/corringham" component={CorringhamPage} />
      <Route path="/quote-request" component={QuoteRequest} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookie-policy" component={CookiePolicy} />

      {/* Admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/leads/:id" component={AdminLeadDetail} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/booked" component={AdminBooked} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
