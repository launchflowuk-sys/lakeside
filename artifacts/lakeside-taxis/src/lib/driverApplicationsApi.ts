/**
 * Driver application admin calls.
 *
 * Hand-written rather than generated: these endpoints are deliberately not in
 * the OpenAPI spec, because the public side of this feature uses multipart
 * uploads that Orval's generated hooks do not model well, and adding them
 * would mean regenerating every existing hook in the client for one feature.
 */

export interface DriverApplicationDocument {
  id: number;
  docType: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface DriverApplicationSummary {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine: string | null;
  city: string | null;
  postcode: string;
  rightToWork: string;
  isLicensed: boolean;
  licenceAuthority: string | null;
  phLicenceNumber: string | null;
  phLicenceExpiry: string | null;
  dvlaLicenceNumber: string | null;
  dvlaYearsHeld: string | null;
  penaltyPoints: string | null;
  hasOwnVehicle: boolean;
  vehicleDetails: string | null;
  yearsExperience: string | null;
  availability: string | null;
  howHeard: string | null;
  additionalInfo: string | null;
  adminNotes: string | null;
  assignedTo: string | null;
  documentCount?: number;
}

export interface DriverApplicationDetail extends DriverApplicationSummary {
  documents: DriverApplicationDocument[];
}

export interface DriverApplicationListResponse {
  applications: DriverApplicationSummary[];
  total: number;
  page: number;
  limit: number;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && typeof body.error === "string") message = body.error;
    } catch {
      // Keep the status-based message.
    }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function listDriverApplicationsKey(status: string, page: number) {
  return ["admin", "driver-applications", { status, page }] as const;
}

export function driverApplicationKey(id: number) {
  return ["admin", "driver-application", id] as const;
}

export function listDriverApplications(
  status: string,
  page: number,
  limit: number,
): Promise<DriverApplicationListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status !== "all") params.set("status", status);
  return request<DriverApplicationListResponse>(`/api/admin/driver-applications?${params}`);
}

export function getDriverApplication(id: number): Promise<DriverApplicationDetail> {
  return request<DriverApplicationDetail>(`/api/admin/driver-applications/${id}`);
}

export function updateDriverApplication(
  id: number,
  body: { status?: string; adminNotes?: string | null; assignedTo?: string | null },
): Promise<DriverApplicationSummary> {
  return request<DriverApplicationSummary>(`/api/admin/driver-applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteDriverApplication(id: number): Promise<void> {
  return request<void>(`/api/admin/driver-applications/${id}`, { method: "DELETE" });
}

export function documentDownloadUrl(applicationId: number, documentId: number): string {
  return `/api/admin/driver-applications/${applicationId}/documents/${documentId}/download`;
}

export const DRIVER_DOCUMENT_LABELS: Record<string, string> = {
  ph_driver_licence: "Private hire driver licence",
  dvla_licence: "DVLA driving licence",
  dbs_certificate: "DBS certificate",
  right_to_work: "Right to work document",
  proof_of_address: "Proof of address",
  insurance: "Insurance certificate",
  mot: "MOT certificate",
  v5c: "V5C logbook",
  cv: "CV",
  other: "Other document",
};

export const RIGHT_TO_WORK_LABELS: Record<string, string> = {
  uk_citizen: "UK citizen",
  settled_status: "Settled / pre-settled status",
  visa_with_right_to_work: "Visa with right to work",
  other: "Other",
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
