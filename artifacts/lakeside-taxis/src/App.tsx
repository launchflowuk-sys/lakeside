import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Only the homepage is bundled eagerly. Every other route is a separate chunk
 * fetched on navigation.
 *
 * The whole site previously shipped as one ~730kB script, so a visitor landing
 * on a town page downloaded the admin dashboard, the quote viewer and all
 * nineteen other pages before anything rendered. Most arrivals are organic
 * search hitting exactly one page and then calling us — they should pay for
 * that page only.
 */
import Home from "@/pages/Home";

// Public
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const LocalTaxis = lazy(() => import("@/pages/LocalTaxis"));
const AirportTransfers = lazy(() => import("@/pages/AirportTransfers"));
const CorporateAccounts = lazy(() => import("@/pages/CorporateAccounts"));
const SchoolRuns = lazy(() => import("@/pages/SchoolRuns"));
const LongDistanceTravel = lazy(() => import("@/pages/LongDistanceTravel"));
const CruiseTerminalTransfers = lazy(() => import("@/pages/CruiseTerminalTransfers"));
const AreasCovered = lazy(() => import("@/pages/AreasCovered"));
const QuoteRequest = lazy(() => import("@/pages/QuoteRequest"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const QuotePage = lazy(() => import("@/pages/QuotePage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Area pages
const GraysPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.GraysPage })));
const PurfleetPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.PurfleetPage })));
const ChaffordHundredPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.ChaffordHundredPage })));
const TilburyPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.TilburyPage })));
const SouthOckendonPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.SouthOckendonPage })));
const AveleyPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.AveleyPage })));
const WestThurrockPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.WestThurrockPage })));
const StanfordLeHopePage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.StanfordLeHopePage })));
const CorringhamPage = lazy(() => import("@/pages/areas").then((m) => ({ default: m.CorringhamPage })));

// Airport pages
const HeathrowPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.HeathrowPage })));
const GatwickPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.GatwickPage })));
const StanstedPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.StanstedPage })));
const LutonPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.LutonPage })));
const LondonCityPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.LondonCityPage })));
const SouthendPage = lazy(() => import("@/pages/airports").then((m) => ({ default: m.SouthendPage })));

// Legal
const PrivacyPolicy = lazy(() => import("@/pages/legal/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/legal/Terms"));
const CookiePolicy = lazy(() => import("@/pages/legal/CookiePolicy"));

// Admin — never fetched by a public visitor.
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("@/pages/admin/Leads"));
const AdminLeadDetail = lazy(() => import("@/pages/admin/LeadDetail"));
const AdminBooked = lazy(() => import("@/pages/admin/Booked"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminCorporateApplications = lazy(() => import("@/pages/admin/CorporateApplications"));
const AdminCorporateApplicationDetail = lazy(() => import("@/pages/admin/CorporateApplicationDetail"));
const AdminPaymentLinks = lazy(() => import("@/pages/admin/PaymentLinks"));

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

/**
 * Deliberately empty. A spinner here would flash on every navigation and count
 * as a layout shift; chunks are small enough that a blank frame is shorter and
 * quieter than a loader appearing and disappearing.
 */
function RouteFallback() {
  return <div style={{ minHeight: "60vh" }} aria-busy="true" />;
}

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
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
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
        <Route path="/tilbury-cruise-terminal" component={CruiseTerminalTransfers} />
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
        <Route path="/quote/:ref" component={QuotePage} />
        <Route path="/quote" component={QuotePage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/cookie-policy" component={CookiePolicy} />

        {/* Admin */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/leads/:id">{(params) => <AdminLeadDetail key={params?.id} id={params?.id ?? ""} />}</Route>
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/booked" component={AdminBooked} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/corporate/:id" component={AdminCorporateApplicationDetail} />
        <Route path="/admin/corporate" component={AdminCorporateApplications} />
        <Route path="/admin/payment-links" component={AdminPaymentLinks} />
        <Route path="/admin" component={AdminDashboard} />

        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </>
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
