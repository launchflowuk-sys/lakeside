import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { Settings2, Mail, Phone, Globe } from "lucide-react";

export default function AdminSettings() {
  const { data: me } = useGetAdminMe({ query: { queryKey: getGetAdminMeQueryKey(), retry: false, staleTime: Infinity, refetchOnWindowFocus: false } });

  return (
    <AdminLayout>
      <Helmet><title>Settings | Lakeside Taxis Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-foreground">SETTINGS</h1>
        <p className="text-muted-foreground text-sm mt-1">System configuration</p>
      </div>
      <div className="max-w-2xl space-y-5">
        {/* Account */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" /> Account
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-muted-foreground text-xs mb-1">Name</p><p className="font-semibold text-foreground">{me?.name}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Email</p><p className="font-semibold text-foreground">{me?.email}</p></div>
            <div><p className="text-muted-foreground text-xs mb-1">Role</p><p className="font-semibold text-foreground capitalize">{me?.role}</p></div>
          </div>
        </div>
        {/* Business */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Business Details</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex gap-2"><Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><p className="text-muted-foreground text-xs">Phone</p><p className="text-foreground">01375 383878</p></div></div>
            <div className="flex gap-2"><Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><p className="text-muted-foreground text-xs">WhatsApp</p><p className="text-foreground">07879 956275</p></div></div>
            <div className="flex gap-2"><Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><p className="text-muted-foreground text-xs">Email</p><p className="text-foreground">info@lakesidetaxi.co.uk</p></div></div>
            <div className="flex gap-2"><Globe className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /><div><p className="text-muted-foreground text-xs">Location</p><p className="text-foreground">Thurrock, Essex</p></div></div>
          </div>
        </div>
        {/* Email */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Email Notifications
          </h2>
          <p className="text-muted-foreground text-sm mb-3">
            Email notifications are configured via environment variables on the server. Set the following environment variables to enable email:
          </p>
          <ul className="space-y-1.5 text-sm font-mono text-foreground/70">
            {["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "ADMIN_EMAIL"].map((v) => (
              <li key={v} className="bg-muted/30 px-3 py-1.5 rounded text-xs">{v}</li>
            ))}
          </ul>
        </div>
        {/* Default password note */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
          <p className="text-yellow-400 font-semibold mb-1">Default credentials</p>
          <p className="text-foreground/70">Default admin login: <span className="font-mono">admin@lakesidetaxi.co.uk</span> / <span className="font-mono">admin123</span></p>
          <p className="text-foreground/60 text-xs mt-1">Change the admin password before going live.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
