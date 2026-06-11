import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useListAdminLeads, getListAdminLeadsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

const STATUSES = ["all", "new", "contacted", "quoted", "booked", "completed", "cancelled", "archived"];
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
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListAdminLeads(
    { status: status === "all" ? undefined : status, page, limit: LIMIT },
    { query: { queryKey: getListAdminLeadsQueryKey({ status: status === "all" ? undefined : status, page, limit: LIMIT }) } }
  );

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <AdminLayout>
      <Helmet><title>Leads | Lakeside Taxis Admin</title></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-white">LEADS</h1>
          <p className="text-muted-foreground text-sm mt-1">All booking requests</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5" data-testid="status-filter">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 border capitalize ${
              status === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`filter-${s}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">{[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !data?.leads.length ? (
            <div className="p-10 text-center text-muted-foreground">No leads found</div>
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
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors" data-testid={`lead-row-${lead.id}`}>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">#{lead.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{lead.fullName}</p>
                      <p className="text-muted-foreground text-xs">{lead.mobile}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-foreground/80 text-xs">{lead.pickupLocation} &rarr; {lead.destination}</p>
                      <p className="text-muted-foreground text-xs">{journeyLabel[lead.journeyType] ?? lead.journeyType}</p>
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
