import { useState } from "react";
import { Link } from "wouter";
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
  useGetLeadReplies, getGetLeadRepliesQueryKey,
  useCreateQuote, useGetLeadQuote, getGetLeadQuoteQueryKey,
  useMarkQuotePaid,
  useCreateQuotePaymentLink,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Phone, Mail, MessageCircle, CheckCircle2, Send, ArrowLeft, FileText, Copy, ExternalLink } from "lucide-react";

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

function getTodayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function AdminLeadDetail({ id }: { id: string }) {
  const leadId = parseInt(id || "0", 10);
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useGetAdminLead(leadId, { query: { enabled: !!leadId, queryKey: getGetAdminLeadQueryKey(leadId), staleTime: 30_000, refetchOnWindowFocus: false } });
  const { data: replies } = useGetLeadReplies(leadId, { query: { enabled: !!leadId, queryKey: getGetLeadRepliesQueryKey(leadId), staleTime: 30_000, refetchOnWindowFocus: false } });
  const { data: existingQuote } = useGetLeadQuote(leadId, { query: { enabled: !!leadId, queryKey: getGetLeadQuoteQueryKey(leadId), retry: false, staleTime: 30_000, refetchOnWindowFocus: false } });
  const updateLeadStatus = useUpdateAdminLead();
  const updateLeadNotes = useUpdateAdminLead();
  const replyToLead = useReplyToLead();
  const createQuote = useCreateQuote();
  const markQuotePaid = useMarkQuotePaid();
  const createPaymentLink = useCreateQuotePaymentLink();

  const [adminNotes, setAdminNotes] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyQuotedPrice, setReplyQuotedPrice] = useState("");
  const [savedNote, setSavedNote] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);

  const [qPrice, setQPrice] = useState("");
  const [qPriceNotes, setQPriceNotes] = useState("");
  const [qValidUntil, setQValidUntil] = useState(getTodayPlus(3));
  const [qAdminMessage, setQAdminMessage] = useState("");
  const [qPayCash, setQPayCash] = useState(true);
  const [qPayCard, setQPayCard] = useState(false);
  const [qPayBank, setQPayBank] = useState(false);
  const [qBankName, setQBankName] = useState("");
  const [qBankSort, setQBankSort] = useState("");
  const [qBankAcc, setQBankAcc] = useState("");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetAdminLeadQueryKey(leadId) });
    queryClient.invalidateQueries({ queryKey: getGetLeadRepliesQueryKey(leadId) });
    queryClient.invalidateQueries({ queryKey: getGetLeadQuoteQueryKey(leadId) });
  };

  const handleStatusChange = (status: string) => {
    updateLeadStatus.mutate({ id: leadId, data: { status: status as any } }, { onSuccess: refresh });
  };

  const handleSaveNotes = () => {
    updateLeadNotes.mutate(
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

  const handleCreateQuote = () => {
    if (!lead) return;
    createQuote.mutate({
      id: leadId,
      data: {
        price: qPrice,
        priceNotes: qPriceNotes || undefined,
        validUntil: qValidUntil,
        adminMessage: qAdminMessage || undefined,
        journeyType: lead.journeyType,
        pickupLocation: lead.pickupLocation,
        destination: lead.destination,
        viaStops: lead.viaStops || undefined,
        journeyDate: lead.journeyDate,
        journeyTime: lead.journeyTime,
        returnRequired: lead.returnRequired ? "yes" : "no",
        returnDate: lead.returnDate || undefined,
        returnTime: lead.returnTime || undefined,
        passengers: lead.passengers,
        customerName: lead.fullName,
        customerEmail: lead.email,
        customerMobile: lead.mobile,
        paymentCash: qPayCash ? "yes" : "no",
        paymentCard: qPayCard ? "yes" : "no",
        paymentBankTransfer: qPayBank ? "yes" : "no",
        bankAccountName: qBankName || undefined,
        bankSortCode: qBankSort || undefined,
        bankAccountNumber: qBankAcc || undefined,
      }
    }, {
      onSuccess: () => {
        setShowQuoteForm(false);
        refresh();
      }
    });
  };

  const handleMarkPaid = () => {
    markQuotePaid.mutate({ id: leadId }, { onSuccess: refresh });
  };

  const handleCreatePaymentLink = () => {
    if (!existingQuote) return;
    createPaymentLink.mutate({ id: leadId, quoteId: existingQuote.id }, { onSuccess: refresh });
  };

  const copyQuoteLink = (ref: string) => {
    const url = `${window.location.origin}/quote/${ref}`;
    navigator.clipboard.writeText(url);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const copyPaymentLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPaymentLink(true);
    setTimeout(() => setCopiedPaymentLink(false), 2000);
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
      <Helmet><title>{`Lead #${lead.id} | Lakeside Taxis Admin`}</title></Helmet>
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

          {/* Quote Panel */}
          <div className="bg-card border border-border rounded-xl p-5" data-testid="quote-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Customer Quote
              </h2>
              {!existingQuote && !showQuoteForm && (
                <Button size="sm" onClick={() => setShowQuoteForm(true)} className="bg-primary text-primary-foreground font-semibold">
                  Create Quote
                </Button>
              )}
            </div>

            {existingQuote && (
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Quote Reference</p>
                      <p className="font-display font-black text-xl text-primary tracking-wide">{existingQuote.quoteRef}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${
                      existingQuote.status === "paid" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                      existingQuote.status === "accepted" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      existingQuote.status === "expired" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      existingQuote.status === "cancelled" ? "bg-muted text-muted-foreground border-border" :
                      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}>{existingQuote.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                    <div>
                      <p className="text-muted-foreground text-xs">Price</p>
                      <p className="font-bold text-foreground">{existingQuote.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Valid Until</p>
                      <p className="font-semibold text-foreground">{existingQuote.validUntil}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => copyQuoteLink(existingQuote.quoteRef)}
                  >
                    {copiedRef ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link</>}
                  </Button>
                  <a
                    href={`/quote/${existingQuote.quoteRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Button>
                  </a>
                </div>

                {(existingQuote.status === "pending" || existingQuote.status === "accepted") && (
                  <div className="bg-muted/20 rounded-lg p-3 border border-border">
                    {existingQuote.squarePaymentLinkUrl ? (
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground font-semibold">Online Payment Link</p>
                        <a href={existingQuote.squarePaymentLinkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline break-all">
                          {existingQuote.squarePaymentLinkUrl}
                        </a>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => copyPaymentLink(existingQuote.squarePaymentLinkUrl!)}
                        >
                          {copiedPaymentLink ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link</>}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCreatePaymentLink}
                          disabled={createPaymentLink.isPending}
                          className="w-full"
                          data-testid="btn-create-payment-link"
                        >
                          {createPaymentLink.isPending ? "Generating Link..." : "Generate Online Payment Link (Square)"}
                        </Button>
                        {createPaymentLink.isError && (
                          <p className="text-red-400 text-xs mt-1">Failed to create payment link. Check Square is configured.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {(existingQuote.status === "accepted" || existingQuote.status === "paid") && existingQuote.acceptedAt && (
                  <p className="text-green-400 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Accepted by customer on {new Date(existingQuote.acceptedAt).toLocaleDateString("en-GB", { dateStyle: "full" })}
                  </p>
                )}
                {existingQuote.status === "paid" && existingQuote.paidAt && (
                  <p className="text-blue-400 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Payment received on {new Date(existingQuote.paidAt).toLocaleDateString("en-GB", { dateStyle: "full" })}
                  </p>
                )}
                {existingQuote.status === "accepted" && (
                  <div>
                    <Button
                      size="sm"
                      onClick={handleMarkPaid}
                      disabled={markQuotePaid.isPending}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                      data-testid="btn-mark-paid"
                    >
                      {markQuotePaid.isPending ? "Marking as Paid..." : "Mark Payment Received"}
                    </Button>
                    <p className="text-muted-foreground text-xs mt-1.5">For cash, bank transfer, or any payment confirmed outside the system.</p>
                    {markQuotePaid.isError && (
                      <p className="text-red-400 text-xs mt-1">Failed to mark as paid. Please try again.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {showQuoteForm && !existingQuote && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Price <span className="text-red-400">*</span></Label>
                    <Input value={qPrice} onChange={e => setQPrice(e.target.value)} placeholder="e.g. £95" className="mt-1 text-sm" data-testid="quote-price" />
                  </div>
                  <div>
                    <Label className="text-xs">Valid Until <span className="text-red-400">*</span></Label>
                    <Input type="date" value={qValidUntil} onChange={e => setQValidUntil(e.target.value)} className="mt-1 text-sm" data-testid="quote-valid-until" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Price Notes (optional)</Label>
                  <Input value={qPriceNotes} onChange={e => setQPriceNotes(e.target.value)} placeholder="e.g. Includes meet & greet, waiting time" className="mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Message to Customer (optional)</Label>
                  <Textarea value={qAdminMessage} onChange={e => setQAdminMessage(e.target.value)} placeholder="Any personal message to include on the quote..." rows={3} className="mt-1 text-sm resize-none" />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Payment Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
                      <input type="checkbox" checked={qPayCash} onChange={e => setQPayCash(e.target.checked)} className="accent-yellow-400" />
                      Cash on the day
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
                      <input type="checkbox" checked={qPayCard} onChange={e => setQPayCard(e.target.checked)} className="accent-yellow-400" />
                      Card payment
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
                      <input type="checkbox" checked={qPayBank} onChange={e => setQPayBank(e.target.checked)} className="accent-yellow-400" />
                      Bank transfer
                    </label>
                  </div>
                </div>

                {qPayBank && (
                  <div className="bg-muted/20 rounded-lg p-3 space-y-2 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold">Bank Transfer Details</p>
                    <div>
                      <Label className="text-xs">Account Name</Label>
                      <Input value={qBankName} onChange={e => setQBankName(e.target.value)} placeholder="e.g. Lakeside & Purfleet Taxis Ltd" className="mt-1 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Sort Code</Label>
                        <Input value={qBankSort} onChange={e => setQBankSort(e.target.value)} placeholder="00-00-00" className="mt-1 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Account Number</Label>
                        <Input value={qBankAcc} onChange={e => setQBankAcc(e.target.value)} placeholder="12345678" className="mt-1 text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateQuote}
                    disabled={!qPrice || !qValidUntil || createQuote.isPending}
                    className="flex-1 bg-primary text-primary-foreground font-semibold"
                    data-testid="btn-create-quote"
                  >
                    {createQuote.isPending ? "Creating..." : "Create Quote"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuoteForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
                {createQuote.isError && (
                  <p className="text-red-400 text-xs">Failed to create quote. Please try again.</p>
                )}
              </div>
            )}

            {!existingQuote && !showQuoteForm && (
              <p className="text-muted-foreground text-sm">No quote created yet. Click "Create Quote" to generate a shareable quote link for this customer.</p>
            )}
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
                  disabled={lead.status === s || updateLeadStatus.isPending}
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
            {updateLeadStatus.isError && (
              <p className="text-red-400 text-xs mt-2">Failed to update status. Please try again.</p>
            )}
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
                disabled={updateLeadNotes.isPending}
                size="sm"
                className="w-full bg-primary text-primary-foreground"
                data-testid="btn-save-notes"
              >
                {savedNote ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Saved</> : updateLeadNotes.isPending ? "Saving..." : "Save Changes"}
              </Button>
              {updateLeadNotes.isError && (
                <p className="text-red-400 text-xs">Failed to save changes. Please try again.</p>
              )}
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
