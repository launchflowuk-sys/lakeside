import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminLead, getGetAdminLeadQueryKey,
  useUpdateAdminLead,
  useReplyToLead,
  useGetLeadReplies, getGetLeadRepliesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Phone, Mail, MessageCircle, CheckCircle2, Send, ArrowLeft } from "lucide-react";

const STATUSES = ["new", "contacted", "quoted", "booked", "completed", "cancelled", "archived"];

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

export default function AdminLeadDetail() {
  const [, params] = useRoute("/admin/leads/:id");
  const leadId = parseInt(params?.id ?? "0", 10);
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useGetAdminLead(leadId, { query: { enabled: !!leadId, queryKey: getGetAdminLeadQueryKey(leadId) } });
  const { data: replies } = useGetLeadReplies(leadId, { query: { enabled: !!leadId, queryKey: getGetLeadRepliesQueryKey(leadId) } });
  const updateLead = useUpdateAdminLead();
  const replyToLead = useReplyToLead();

  const [adminNotes, setAdminNotes] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyQuotedPrice, setReplyQuotedPrice] = useState("");
  const [savedNote, setSavedNote] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetAdminLeadQueryKey(leadId) });
    queryClient.invalidateQueries({ queryKey: getGetLeadRepliesQueryKey(leadId) });
  };

  const handleStatusChange = (status: string) => {
    updateLead.mutate({ id: leadId, data: { status: status as any } }, { onSuccess: refresh });
  };

  const handleSaveNotes = () => {
    updateLead.mutate(
      { id: leadId, data: { adminNotes: adminNotes || lead?.adminNotes || undefined, quotedPrice: quotedPrice || lead?.quotedPrice || undefined, assignedDriver: assignedDriver || lead?.assignedDriver || undefined, bookingReference: bookingRef || lead?.bookingReference || undefined } },
      { onSuccess: () => { refresh(); setSavedNote(true); setTimeout(() => setSavedNote(false), 2000); } }
    );
  };

  const handleReply = () => {
    replyToLead.mutate(
      { id: leadId, data: { subject: replySubject, message: replyMessage, quotedPrice: replyQuotedPrice || null } },
      {
        onSuccess: () => {
          setReplySubject("");
          setReplyMessage("");
          setReplyQuotedPrice("");
          refresh();
        }
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">Lead not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet><title>Lead #{lead.id} | Lakeside Taxis Admin</title></Helmet>
      <div className="mb-5 flex items-center gap-3">
        <Link href="/admin/leads">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display font-black text-2xl text-foreground">Lead #{lead.id}</h1>
          <p className="text-muted-foreground text-xs">Received {new Date(lead.createdAt).toLocaleDateString("en-GB", { dateStyle: "full" })}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="customer-details">
            <h2 className="font-semibold text-foreground mb-4">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Full Name</p>
                <p className="font-semibold text-foreground">{lead.fullName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Mobile</p>
                <a href={`tel:${lead.mobile}`} className="font-semibold text-primary flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {lead.mobile}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Email</p>
                <a href={`mailto:${lead.email}`} className="font-semibold text-primary flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Preferred Contact</p>
                <span className="font-semibold text-foreground capitalize">{lead.preferredContactMethod}</span>
              </div>
            </div>
          </div>

          {/* Journey */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="journey-details">
            <h2 className="font-semibold text-foreground mb-4">Journey Details</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Journey Type</p>
                <p className="font-semibold text-foreground">{journeyLabel[lead.journeyType] ?? lead.journeyType}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Passengers</p>
                <p className="font-semibold text-foreground">{lead.passengers}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Pickup</p>
                <p className="font-semibold text-foreground">{lead.pickupLocation}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Destination</p>
                <p className="font-semibold text-foreground">{lead.destination}</p>
              </div>
              {lead.viaStops && <div>
                <p className="text-muted-foreground text-xs mb-1">Via Stops</p>
                <p className="font-semibold text-foreground">{lead.viaStops}</p>
              </div>}
              <div>
                <p className="text-muted-foreground text-xs mb-1">Date &amp; Time</p>
                <p className="font-semibold text-foreground">{lead.journeyDate} at {lead.journeyTime}</p>
              </div>
              {lead.returnRequired && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Return</p>
                  <p className="font-semibold text-foreground">{lead.returnDate} at {lead.returnTime}</p>
                </div>
              )}
              {lead.luggage && <div>
                <p className="text-muted-foreground text-xs mb-1">Luggage</p>
                <p className="font-semibold text-foreground">{lead.luggage}</p>
              </div>}
              <div>
                <p className="text-muted-foreground text-xs mb-1">Child Seats</p>
                <p className="font-semibold text-foreground">{lead.childSeatsRequired ? "Yes" : "No"}</p>
              </div>
              {lead.accessibilityRequirements && <div>
                <p className="text-muted-foreground text-xs mb-1">Accessibility</p>
                <p className="font-semibold text-foreground">{lead.accessibilityRequirements}</p>
              </div>}
              {lead.additionalNotes && <div className="sm:col-span-2">
                <p className="text-muted-foreground text-xs mb-1">Additional Notes</p>
                <p className="font-semibold text-foreground">{lead.additionalNotes}</p>
              </div>}
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="reply-form">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" /> Reply to Customer
            </h2>
            <div className="space-y-3">
              <div>
                <Label>Subject</Label>
                <Input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="e.g. Re: Your booking request"
                  className="mt-1"
                  data-testid="reply-subject"
                />
              </div>
              <div>
                <Label>Quoted Price (optional)</Label>
                <Input
                  value={replyQuotedPrice}
                  onChange={(e) => setReplyQuotedPrice(e.target.value)}
                  placeholder="e.g. £45"
                  className="mt-1"
                  data-testid="reply-price"
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your reply to the customer..."
                  className="mt-1 resize-none"
                  data-testid="reply-message"
                />
              </div>
              <Button
                onClick={handleReply}
                disabled={!replySubject || !replyMessage || replyToLead.isPending}
                className="bg-primary text-primary-foreground font-semibold w-full"
                data-testid="btn-send-reply"
              >
                <Send className="w-4 h-4 mr-2" />
                {replyToLead.isPending ? "Sending..." : "Send Reply"}
              </Button>
              {replyToLead.isSuccess && (
                <p className="text-green-400 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Reply sent</p>
              )}
            </div>
          </div>

          {/* Reply History */}
          {replies && replies.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5" data-testid="reply-history">
              <h2 className="font-semibold text-foreground mb-4">Reply History</h2>
              <div className="space-y-4">
                {replies.map((r) => (
                  <div key={r.id} className="border-l-2 border-primary/30 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-foreground text-sm">{r.subject}</p>
                      <p className="text-muted-foreground text-xs">{new Date(r.sentAt).toLocaleString("en-GB")}</p>
                    </div>
                    {r.quotedPrice && <p className="text-primary text-xs font-semibold mb-1">Quoted: {r.quotedPrice}</p>}
                    <p className="text-foreground/70 text-sm whitespace-pre-line">{r.message}</p>
                    <p className="text-muted-foreground text-xs mt-1">Sent by {r.sentBy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="status-panel">
            <h2 className="font-semibold text-foreground mb-3">Status</h2>
            <div className="mb-3">
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border capitalize ${statusBadge(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            <div className="space-y-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={lead.status === s || updateLead.isPending}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                    lead.status === s
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                  data-testid={`status-btn-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="admin-notes-panel">
            <h2 className="font-semibold text-foreground mb-3">Admin Notes</h2>
            <div className="space-y-3">
              <Textarea
                value={adminNotes || lead.adminNotes || ""}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes..."
                rows={3}
                className="resize-none text-sm"
                data-testid="input-admin-notes"
              />
              <div>
                <Label className="text-xs">Quoted Price</Label>
                <Input
                  value={quotedPrice || lead.quotedPrice || ""}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. £45"
                  className="mt-1 text-sm"
                  data-testid="input-quoted-price"
                />
              </div>
              <div>
                <Label className="text-xs">Assigned Driver</Label>
                <Input
                  value={assignedDriver || lead.assignedDriver || ""}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  placeholder="Driver name"
                  className="mt-1 text-sm"
                  data-testid="input-driver"
                />
              </div>
              <div>
                <Label className="text-xs">Booking Reference</Label>
                <Input
                  value={bookingRef || lead.bookingReference || ""}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g. LT-2024-001"
                  className="mt-1 text-sm"
                  data-testid="input-booking-ref"
                />
              </div>
              <Button
                onClick={handleSaveNotes}
                disabled={updateLead.isPending}
                size="sm"
                className="w-full bg-primary text-primary-foreground"
                data-testid="btn-save-notes"
              >
                {savedNote ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Saved</> : updateLead.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Contact Shortcuts */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Quick Contact</h2>
            <div className="space-y-2">
              <a href={`tel:${lead.mobile}`} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/80 hover:text-primary bg-muted/20 rounded-lg transition-colors" data-testid="quick-call-btn">
                <Phone className="w-4 h-4" /> Call {lead.fullName.split(" ")[0]}
              </a>
              <a href={`https://wa.me/${lead.mobile.replace(/\s+/g, "")}`} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-400 hover:text-green-300 bg-muted/20 rounded-lg transition-colors" data-testid="quick-whatsapp-btn">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/80 hover:text-primary bg-muted/20 rounded-lg transition-colors" data-testid="quick-email-btn">
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
