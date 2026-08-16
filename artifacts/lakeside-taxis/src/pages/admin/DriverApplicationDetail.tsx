import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import {
  getDriverApplication,
  driverApplicationKey,
  updateDriverApplication,
  deleteDriverApplication,
  documentDownloadUrl,
  formatFileSize,
  DRIVER_DOCUMENT_LABELS,
  RIGHT_TO_WORK_LABELS,
} from "@/lib/driverApplicationsApi";

const STATUSES = ["new", "reviewing", "interview", "approved", "rejected", "on_hold"];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-border/40 last:border-0 sm:flex-row sm:gap-4">
      <span className="text-xs text-muted-foreground sm:w-48 sm:shrink-0 sm:pt-0.5">{label}</span>
      <span className="text-sm text-foreground break-words">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-4">
      <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function DriverApplicationDetail() {
  const [, params] = useRoute("/admin/driver-applications/:id");
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const id = Number(params?.id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: driverApplicationKey(id),
    queryFn: () => getDriverApplication(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Only seed the notes box from the server once the record arrives, so an
  // in-progress edit is never overwritten by a background refetch.
  useEffect(() => {
    if (data) setNotes(data.adminNotes ?? "");
  }, [data?.id]);

  const updateMutation = useMutation({
    mutationFn: (body: { status?: string; adminNotes?: string | null }) =>
      updateDriverApplication(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverApplicationKey(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "driver-applications"] });
      setSavedMessage("Saved");
      window.setTimeout(() => setSavedMessage(null), 2500);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDriverApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "driver-applications"] });
      navigate("/admin/driver-applications");
    },
  });

  function handleDelete() {
    const confirmed = window.confirm(
      "Permanently delete this application and all its uploaded documents? This cannot be undone.",
    );
    if (confirmed) deleteMutation.mutate();
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </AdminLayout>
    );
  }

  if (isError || !data) {
    return (
      <AdminLayout>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error instanceof Error ? error.message : "Application not found."}
        </div>
        <Link href="/admin/driver-applications">
          <Button variant="outline" size="sm" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to applications
          </Button>
        </Link>
      </AdminLayout>
    );
  }

  const address = [data.addressLine, data.city, data.postcode].filter(Boolean).join(", ");

  return (
    <AdminLayout>
      <Helmet>
        <title>{data.fullName} | Driver Application | Lakeside Taxis Admin</title>
      </Helmet>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <Link href="/admin/driver-applications">
            <button className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to applications
            </button>
          </Link>
          <h1 className="font-display font-black text-3xl text-foreground">
            {data.fullName.toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Applied {new Date(data.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedMessage && (
            <span className="text-xs text-green-400 font-semibold">{savedMessage}</span>
          )}
          <select
            className="bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground"
            value={data.status}
            onChange={(e) => updateMutation.mutate({ status: e.target.value })}
            disabled={updateMutation.isPending}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Section title="Contact">
        <Row label="Phone" value={<a href={`tel:${data.phone}`} className="text-primary">{data.phone}</a>} />
        <Row label="Email" value={<a href={`mailto:${data.email}`} className="text-primary">{data.email}</a>} />
        <Row label="Address" value={address} />
        <Row
          label="Right to work"
          value={RIGHT_TO_WORK_LABELS[data.rightToWork] ?? data.rightToWork}
        />
      </Section>

      <Section title="Licensing">
        <Row
          label="Private hire licence"
          value={data.isLicensed ? "Yes — already licensed" : "Not yet licensed"}
        />
        {data.isLicensed && (
          <>
            <Row label="Issuing council" value={data.licenceAuthority} />
            <Row label="Badge number" value={data.phLicenceNumber} />
            <Row label="Badge expiry" value={data.phLicenceExpiry} />
          </>
        )}
        <Row label="DVLA licence number" value={data.dvlaLicenceNumber} />
        <Row label="Years held" value={data.dvlaYearsHeld} />
        <Row label="Penalty points" value={data.penaltyPoints} />
      </Section>

      <Section title="Vehicle & availability">
        <Row
          label="Own vehicle"
          value={data.hasOwnVehicle ? "Yes" : "No — would want to rent"}
        />
        <Row label="Vehicle details" value={data.vehicleDetails} />
        <Row label="Experience" value={data.yearsExperience} />
        <Row label="Availability" value={data.availability} />
        <Row label="Heard about us via" value={data.howHeard} />
        <Row label="Additional notes" value={data.additionalInfo} />
      </Section>

      <Section title={`Documents (${data.documents.length})`}>
        {data.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No documents were uploaded with this application.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-sm text-foreground font-medium">
                    {DRIVER_DOCUMENT_LABELS[doc.docType] ?? doc.docType}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {doc.originalFilename} · {formatFileSize(doc.sizeBytes)}
                  </div>
                </div>
                <a href={documentDownloadUrl(data.id, doc.id)} download>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Internal notes">
        <textarea
          className="w-full min-h-[120px] rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-foreground"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes about this applicant — interview date, outcome, anything outstanding."
        />
        <Button
          size="sm"
          className="mt-3"
          disabled={updateMutation.isPending}
          onClick={() => updateMutation.mutate({ adminNotes: notes })}
        >
          {updateMutation.isPending ? "Saving…" : "Save notes"}
        </Button>
      </Section>

      <div className="bg-card border border-red-500/30 rounded-lg p-5">
        <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-2">
          Delete application
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          Permanently removes this application and deletes every uploaded document from
          the server. Use this for data protection requests.
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {deleteMutation.isPending ? "Deleting…" : "Delete permanently"}
        </Button>
        {deleteMutation.isError && (
          <p className="mt-2 text-sm text-red-400">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Could not delete this application."}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
