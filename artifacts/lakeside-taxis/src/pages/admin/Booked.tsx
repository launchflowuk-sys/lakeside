import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useListAdminLeads, getListAdminLeadsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export default function AdminBooked() {
  const { data, isLoading } = useListAdminLeads(
    { status: "booked", limit: 50 },
    { query: { queryKey: getListAdminLeadsQueryKey({ status: "booked", limit: 50 }), staleTime: 30_000, refetchOnWindowFocus: false } }
  );

  return (
    <AdminLayout>
      <Helmet><title>Booked Jobs | Lakeside Taxis Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-foreground">BOOKED JOBS</h1>
        <p className="text-muted-foreground text-sm mt-1">Confirmed bookings</p>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !data?.leads.length ? (
            <div className="p-16 text-center">
              <CheckCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No booked jobs yet</p>
            </div>
          ) : (
            <table className="w-full text-sm" data-testid="booked-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">#</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Journey</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Date/Time</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs hidden sm:table-cell">Price</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors" data-testid={`booked-row-${lead.id}`}>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">#{lead.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{lead.fullName}</p>
                      <p className="text-muted-foreground text-xs">{lead.mobile}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-foreground/80 text-xs">{lead.pickupLocation} &rarr; {lead.destination}</p>
                    </td>
                    <td className="px-5 py-3 text-foreground/80 text-xs">
                      {lead.journeyDate}<br />{lead.journeyTime}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <p className="text-green-400 font-semibold text-sm">{lead.quotedPrice ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="text-primary text-xs font-semibold hover:underline">View</Link>
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
