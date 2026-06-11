import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useListAdminCorporateApplications,
  getListAdminCorporateApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUSES = ["all", "new", "reviewing", "approved", "rejected", "on_hold"];
const LIMIT = 20;

const ORG_LABELS: Record<string, string> = {
  business: "Business",
  school: "School",
  council: "Council",
  nhs: "NHS",
  charity: "Charity",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  reviewing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  on_hold: "bg-muted text-muted-foreground border-border",
};

function statusBadge(status: string) {
  return STATUS_COLORS[status] ?? "bg-muted text-muted-foreground border-border";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CorporateApplications() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const params = {
    status: status === "all" ? undefined : (status as "new" | "reviewing" | "approved" | "rejected" | "on_hold"),
    page,
    limit: LIMIT,
  };

  const { data, isLoading } = useListAdminCorporateApplications(params, {
    query: { queryKey: getListAdminCorporateApplicationsQueryKey(params) },
  });

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setPage(1);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Corporate Applications | Lakeside Taxis Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-foreground">CORPORATE APPLICATIONS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data ? `${data.total} total application${data.total !== 1 ? "s" : ""}` : "Corporate account applications"}
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              status === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Monthly</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Received</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && data?.applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No corporate applications{status !== "all" ? ` with status "${status.replace("_", " ")}"` : ""} yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                data?.applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-testid="corporate-app-row"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground max-w-[200px]">
                      <div className="truncate">{app.companyName}</div>
                      <div className="text-xs text-muted-foreground">{app.city}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      <div className="text-sm">{app.contactName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[160px]">{app.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-muted/60 text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                        {ORG_LABELS[app.organisationType] ?? app.organisationType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{app.estimatedMonthlyJourneys}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(app.status)}`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/corporate/${app.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} — {data.total} application{data.total !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
