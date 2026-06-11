import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLogin, useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: me } = useGetAdminMe({ query: { queryKey: getGetAdminMeQueryKey(), retry: false } });
  const login = useAdminLogin();

  useEffect(() => {
    if (me) setLocation("/admin");
  }, [me, setLocation]);

  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const handleSubmit = form.handleSubmit((data) => {
    login.mutate(
      { data },
      {
        onSuccess: (user) => {
          queryClient.setQueryData(getGetAdminMeQueryKey(), user);
          setLocation("/admin");
        },
      }
    );
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login | Lakeside & Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display font-black text-3xl text-white mb-1">ADMIN LOGIN</h1>
          <p className="text-muted-foreground text-sm">Lakeside & Purfleet Taxis</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="mt-1"
                placeholder="admin@lakesidetaxis.co.uk"
                data-testid="input-admin-email"
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className="mt-1"
                data-testid="input-admin-password"
              />
              {form.formState.errors.password && (
                <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            {login.isError && (
              <p className="text-destructive text-sm bg-destructive/10 rounded-lg p-3">Invalid email or password.</p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold"
              disabled={login.isPending}
              data-testid="btn-admin-login"
            >
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Restricted area. Authorised personnel only.
        </p>
      </div>
    </div>
  );
}
