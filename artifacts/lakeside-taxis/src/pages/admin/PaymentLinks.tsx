import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListAdminPaymentLinks, getListAdminPaymentLinksQueryKey,
  useCreateAdminPaymentLink,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Copy, CheckCircle2, Link as LinkIcon } from "lucide-react";

function formatPence(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function AdminPaymentLinks() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useListAdminPaymentLinks({
    query: { queryKey: getListAdminPaymentLinksQueryKey(), staleTime: 15_000, refetchOnWindowFocus: false },
  });
  const createLink = useCreateAdminPaymentLink();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCreate = () => {
    const pounds = parseFloat(amount);
    if (isNaN(pounds) || pounds <= 0) return;
    const pence = Math.round(pounds * 100);

    createLink.mutate({
      data: {
        amount: pence,
        description,
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
      },
    }, {
      onSuccess: () => {
        setAmount("");
        setDescription("");
        setCustomerName("");
        setCustomerEmail("");
        queryClient.invalidateQueries({ queryKey: getListAdminPaymentLinksQueryKey() });
      },
    });
  };

  const copyLink = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <Helmet><title>Payment Links | Lakeside Taxis Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-foreground">PAYMENT LINKS</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a Square payment link for any amount — not tied to a specific booking</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-primary" /> Create Payment Link
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <Label className="text-xs">Amount (£) <span className="text-red-400">*</span></Label>
            <Input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 50.00" className="mt-1 text-sm" data-testid="input-payment-amount" />
          </div>
          <div>
            <Label className="text-xs">Customer Name (optional)</Label>
            <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. John Smith" className="mt-1 text-sm" />
          </div>
        </div>
        <div className="mb-3">
          <Label className="text-xs">Description <span className="text-red-400">*</span></Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this payment for?" rows={2} className="mt-1 text-sm resize-none" />
        </div>
        <div className="mb-4">
          <Label className="text-xs">Customer Email (optional — sends the link automatically if filled)</Label>
          <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@example.com" className="mt-1 text-sm" />
        </div>
        <Button
          onClick={handleCreate}
          disabled={!amount || !description || createLink.isPending}
          className="bg-primary text-primary-foreground font-semibold"
          data-testid="btn-create-adhoc-payment-link"
        >
          {createLink.isPending ? "Creating..." : "Create Payment Link"}
        </Button>
        {createLink.isError && (
          <p className="text-red-400 text-xs mt-2">Failed to create payment link. Check Square is configured.</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !data?.paymentLinks?.length ? (
            <div className="p-16 text-center">
              <LinkIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No payment links created yet</p>
            </div>
          ) : (
            <table className="w-full text-sm" data-testid="payment-links-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Description</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Customer</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Amount</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs">Status</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {data.paymentLinks.map((link) => (
                  <tr key={link.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-foreground/80">{link.description}</td>
                    <td className="px-5 py-3">
                      <p className="text-foreground text-xs">{link.customerName ?? "—"}</p>
                      <p className="text-muted-foreground text-xs">{link.customerEmail ?? ""}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">{formatPence(link.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${
                        link.status === "paid" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}>{link.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      {link.squarePaymentLinkUrl && (
                        <Button size="sm" variant="outline" onClick={() => copyLink(link.id, link.squarePaymentLinkUrl!)}>
                          {copiedId === link.id ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link</>}
                        </Button>
                      )}
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
