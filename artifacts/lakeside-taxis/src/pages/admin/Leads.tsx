import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useListAdminLeads, getListAdminLeadsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";

const STATUSES = ["all", "new", "contacted", "quoted", "booked", "completed", "cancelled", "archived"];
const JOURNEY_TYPES = ["all", "local", "airport", "school_run", "corporate", "long_distance", "other"];
const LIMIT = 20;

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    quoted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    booked: "bg-green-500/20 text-green-400 border-green-500/30",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    archived: "bg-muted/50 text-muted-foreground border-border",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border";
}

const journeyLabel: Record<string, string> = {
  local: "Local", airport: "Airport", school_run: "School Run",
  corporate: "Corporate", long_distance: "Long Distance", other: "Other",
};

export default function AdminLeads() {
  const [status, setStatus] = useState("all");
  const [journeyType, setJourneyType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListAdminLeads(
    { status: status === "all" ? undefined : status, page, limit: LIMIT },
    { query: { queryKey: getListAdminLeadsQueryKey({ status: status === "all" ? undefined : status, page, limit: LIMIT }) } }
  );

  const filteredLeads = useMemo(() => {
    if (!data?.leads) return [];
    let leads = data.leads;
    if (journeyType !== "all") {
      leads = leads.filter((l) => l.journeyType === journeyType);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      leads = leads.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.mobile.toLowerCase().includes(q) ||
          l.pickupLocation.toLowerCase().includes(q) ||
          l.destination.toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q)
      );
    }
    return leads;
  }, [data?.leads, journeyType, search]);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const handleStatusChange = (s: string) => { setStatus(s); setPage(1); };
  const handleJourneyTypeChange = (t: string) => { setJourneyType(t); setPage(1); };
  const clearSearch = () => setSearch("");

  return (
    <AdminLayout>
      <Helmet><title>Leads | Lakeside Taxis Admin</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-foreground">LEADS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data ? `${data.total} total booking requests` : "All booking requests"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, pickup, destination..."
          className="w-full bg-card border border-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          data-testid="leads-search"
        />
        {search && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3" data-testid="status-filter">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 border capitalize ${
              status === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`filter-${s}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Journey type filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
        <span className="text-xs text-muted-foreground flex-shrink-0">Type:</span>
        {JOURNEY_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => handleJourneyTypeChange(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 border ${
              journeyType === t ? "bg-primary/20 text-primary border-primary/40" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "all" ? "All types" : (journeyLabel[t] ?? t)}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !filteredLeads.length ? (
            <div className="p-10 text-center text-muted-foreground">
              {search || journeyType !== "all" ? "No leads match your filters" : "No leads found"}
            </div>
          ) : (
            <table className="w-full text-sm" data-testid="leads-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">#</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Journey</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">Date/Time</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Status</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${lead.status === "new" ? "border-l-2 border-l-blue-500" : ""}`}
                    data-testid={`lead-row-${lead.id}`}
                  >
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">#{lead.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{lead.fullName}</p>
                      <p className="text-muted-foreground text-xs">{lead.mobile}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-foreground/80 text-xs">{lead.pickupLocation} &rarr; {lead.destination}</p>
                      <span className="text-muted-foreground text-xs bg-muted/30 px-1.5 py-0.5 rounded">
                        {journeyLabel[lead.journeyType] ?? lead.journeyType}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {lead.journeyDate}<br />{lead.journeyTime}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${statusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="text-primary text-xs font-semibold hover:underline">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {data && data.total > LIMIT && (
          <div className="px-5 py-4 border-t border-border flex items-center justify-between text-sm" data-testid="pagination">
            <span className="text-muted-foreground text-xs">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, data.total)} of {data.total}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)} data-testid="prev-page">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} data-testid="next-page">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
