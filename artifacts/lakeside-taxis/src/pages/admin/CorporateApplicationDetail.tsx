import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useGetAdminCorporateApplication,
  getGetAdminCorporateApplicationQueryKey,
  useUpdateAdminCorporateApplication,
  useDeleteAdminCorporateApplication,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Save } from "lucide-react";

const STATUSES = [
  { value: "new", label: "New", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "reviewing", label: "Reviewing", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "approved", label: "Approved", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "on_hold", label: "On hold", color: "bg-muted text-muted-foreground border-border" },
] as const;

const ORG_LABELS: Record<string, string> = {
  business: "Private Business",
  school: "School / Academy",
  council: "Local Council",
  nhs: "NHS / Healthcare",
  charity: "Charity / Nonprofit",
  other: "Other",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground text-xs font-medium w-44 shrink-0 pt-0.5">{label}</span>
      <span className="text-foreground text-sm flex-1 break-words">{value}</span>
    </div>
  );
}

interface Props {
  params: { id: string };
}

export default function CorporateApplicationDetail({ params }: Props) {
  const id = parseInt(params.id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: app, isLoading } = useGetAdminCorporateApplication(id, {
    query: { queryKey: getGetAdminCorporateApplicationQueryKey(id) },
  });

  const update = useUpdateAdminCorporateApplication();
  const del = useDeleteAdminCorporateApplication();

  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (app) {
      setStatus(app.status);
      setAdminNotes(app.adminNotes ?? "");
      setAssignedTo(app.assignedTo ?? "");
    }
  }, [app]);

  const handleSave = () => {
    update.mutate(
      { id, data: { status: status as typeof STATUSES[number]["value"], adminNotes: adminNotes || null, assignedTo: assignedTo || null } },
      {
        onSuccess: () => {
          setSaved(true);
          queryClient.invalidateQueries({ queryKey: getGetAdminCorporateApplicationQueryKey(id) });
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this corporate application? This cannot be undone.")) return;
    del.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["listAdminCorporateApplications"] });
          setLocation("/admin/corporate");
        },
      }
    );
  };

  const statusInfo = STATUSES.find((s) => s.value === (app?.status ?? "new"));

  return (
    <AdminLayout>
      <Helmet>
        <title>{app ? `${app.companyName} | Corporate | Lakeside Taxis Admin` : "Corporate Application | Lakeside Taxis Admin"}</title>
      </Helmet>

      {/* Back + header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/corporate">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <>
                <h1 className="font-display font-black text-2xl text-foreground uppercase">
                  {app?.companyName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {statusInfo && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  )}
                  <span className="text-muted-foreground text-xs">
                    Application #{app?.id} · Received {app ? formatDate(app.createdAt) : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={del.isPending}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      ) : app ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: application details ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organisation */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Organisation</h2>
              </div>
              <div className="px-5 py-2">
                <Row label="Company name" value={app.companyName} />
                <Row label="Organisation type" value={ORG_LABELS[app.organisationType] ?? app.organisationType} />
                <Row label="Address" value={app.companyAddress} />
                <Row label="City" value={app.city} />
                <Row label="Postcode" value={app.postcode} />
                <Row label="Website" value={app.website} />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Contact Details</h2>
              </div>
              <div className="px-5 py-2">
                <Row label="Contact name" value={app.contactName} />
                <Row label="Job title" value={app.jobTitle} />
                <Row label="Email" value={app.email} />
                <Row label="Phone" value={app.phone} />
              </div>
            </div>

            {/* Transport requirements */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Transport Requirements</h2>
              </div>
              <div className="px-5 py-2">
                <Row label="Est. monthly journeys" value={app.estimatedMonthlyJourneys} />
                <Row label="Journey types" value={app.journeyTypes?.split(",").join(", ")} />
                <Row label="Passenger numbers" value={app.numberOfPassengers} />
                <Row label="Preferred billing" value={app.preferredBilling} />
                <Row label="Start date" value={app.contractStartDate} />
                <Row label="Existing provider" value={app.existingProviderDetails} />
                <Row label="Additional requirements" value={app.additionalRequirements} />
              </div>
            </div>
          </div>

          {/* ── Right: admin controls ── */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Application Status</h2>
              </div>
              <div className="p-5 space-y-3">
                {STATUSES.map((s) => (
                  <label
                    key={s.value}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      status === s.value ? `${s.color} border-current` : "border-border bg-muted/10 hover:bg-muted/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      checked={status === s.value}
                      onChange={() => setStatus(s.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm font-semibold">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Admin notes */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/20">
                <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Admin Notes</h2>
              </div>
              <div className="p-5 space-y-4">
                <textarea
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  rows={5}
                  placeholder="Internal notes about this application…"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Assigned to
                  </label>
                  <input
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    type="text"
                    placeholder="e.g. Admin or driver name"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={handleSave}
                  disabled={update.isPending}
                >
                  <Save className="w-4 h-4" />
                  {saved ? "Saved ✓" : update.isPending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-card border border-border rounded-lg p-5 space-y-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Quick actions</h2>
              <a
                href={`mailto:${app.email}?subject=Your%20corporate%20account%20application%20%E2%80%93%20Lakeside%20Taxis`}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-border bg-muted/10 hover:bg-muted/30 transition-colors text-sm font-medium text-foreground"
              >
                Email applicant
                <span className="text-xs text-muted-foreground truncate max-w-[120px] text-right">{app.email}</span>
              </a>
              <a
                href={`tel:${app.phone}`}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-border bg-muted/10 hover:bg-muted/30 transition-colors text-sm font-medium text-foreground"
              >
                Call applicant
                <span className="text-xs text-muted-foreground">{app.phone}</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          Application not found.{" "}
          <Link href="/admin/corporate" className="text-primary hover:underline">
            Back to list
          </Link>
        </div>
      )}
    </AdminLayout>
  );
}
