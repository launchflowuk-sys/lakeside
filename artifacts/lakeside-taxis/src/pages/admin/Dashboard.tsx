import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, XCircle, Clock, Briefcase, Archive, MessageSquare, TrendingUp } from "lucide-react";

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
  local: "Local",
  airport: "Airport",
  school_run: "School Run",
  corporate: "Corporate",
  long_distance: "Long Distance",
  other: "Other",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  const statCards = [
    { label: "Total Leads", value: stats?.total ?? 0, icon: Users, color: "text-foreground" },
    { label: "New", value: stats?.new ?? 0, icon: MessageSquare, color: "text-blue-400" },
    { label: "Quoted", value: stats?.quoted ?? 0, icon: TrendingUp, color: "text-orange-400" },
    { label: "Booked", value: stats?.booked ?? 0, icon: Briefcase, color: "text-green-400" },
    { label: "Completed", value: stats?.completed ?? 0, icon: CheckCircle, color: "text-muted-foreground" },
    { label: "Cancelled", value: stats?.cancelled ?? 0, icon: XCircle, color: "text-red-400" },
    { label: "Contacted", value: stats?.contacted ?? 0, icon: Clock, color: "text-yellow-400" },
    { label: "Archived", value: stats?.archived ?? 0, icon: Archive, color: "text-muted-foreground" },
  ];

  return (
    <AdminLayout>
      <Helmet><title>Dashboard | Lakeside Taxis Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-foreground">DASHBOARD</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of all booking requests</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" data-testid="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4" data-testid={`stat-${card.label.toLowerCase().replace(/\s/g, "-")}`}>
            {isLoading ? (
              <Skeleton className="h-8 w-12 mb-1" />
            ) : (
              <p className={`font-display font-black text-3xl ${card.color}`}>{card.value}</p>
            )}
            <p className="text-muted-foreground text-xs font-medium mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="recent-leads">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Leads</h2>
          <Link href="/admin/leads" className="text-primary text-sm hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : stats?.recentLeads.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No leads yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">#</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Journey</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Status</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors" data-testid={`lead-row-${lead.id}`}>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">#{lead.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{lead.fullName}</p>
                      <p className="text-muted-foreground text-xs">{lead.mobile}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-foreground/80">{lead.pickupLocation} → {lead.destination}</p>
                      <p className="text-muted-foreground text-xs">{journeyLabel[lead.journeyType] ?? lead.journeyType}</p>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {lead.journeyDate} {lead.journeyTime}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize ${statusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="text-primary text-xs hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
