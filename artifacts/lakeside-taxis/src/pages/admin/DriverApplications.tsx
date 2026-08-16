import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import {
  listDriverApplications,
  listDriverApplicationsKey,
} from "@/lib/driverApplicationsApi";

const STATUSES = ["all", "new", "reviewing", "interview", "approved", "rejected", "on_hold"];
const LIMIT = 20;

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  reviewing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  interview: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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

export default function DriverApplications() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: listDriverApplicationsKey(status, page),
    queryFn: () => listDriverApplications(status, page, LIMIT),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  const handleStatusChange = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Driver Applications | Lakeside Taxis Admin</title>
      </Helmet>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-black text-3xl text-foreground">
            DRIVER APPLICATIONS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data
              ? `${data.total} total application${data.total !== 1 ? "s" : ""}`
              : "Applications from the become a driver page"}
          </p>
        </div>
      </div>

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

      {isError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error instanceof Error ? error.message : "Could not load applications."}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Applicant</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Licensed</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Vehicle</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Docs</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold text-xs tracking-wide">Received</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && data?.applications.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No driver applications
                    {status !== "all" ? ` with status "${status.replace("_", " ")}"` : ""} yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                data?.applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-testid="driver-app-row"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground max-w-[200px]">
                      <div className="truncate">{app.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {app.city ?? app.postcode}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      <div className="text-sm">{app.phone}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {app.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          app.isLicensed
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-muted/60 text-muted-foreground border-border"
                        }`}
                      >
                        {app.isLicensed ? "Licensed" : "Not yet"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {app.hasOwnVehicle ? "Own vehicle" : "Wants to rent"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {app.documentCount ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(app.status)}`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/driver-applications/${app.id}`}>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
