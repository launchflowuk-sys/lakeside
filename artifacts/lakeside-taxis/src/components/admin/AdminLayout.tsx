import { Link, useLocation } from "wouter";
import { useAdminLogout, useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, CheckSquare, Settings, LogOut, Menu, X, Car, Building2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/booked", label: "Booked Jobs", icon: CheckSquare },
  { href: "/admin/corporate", label: "Corporate", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: me, isLoading, isError } = useGetAdminMe({
    query: {
      queryKey: getGetAdminMeQueryKey(),
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  });
  const logout = useAdminLogout();

  useEffect(() => {
    if (isLoading) return;
    if (me) return;
    if (isError) {
      setLocation("/admin/login");
      return;
    }
    if (!me) setLocation("/admin/login");
  }, [me, isLoading, isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(getGetAdminMeQueryKey(), null);
        setLocation("/admin/login");
      },
    });
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-200 lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `} data-testid="admin-sidebar">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sidebar-foreground font-bold text-xs leading-tight">LAKESIDE TAXIS</p>
              <p className="text-primary text-xs">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            {me && (
              <div className="mb-3 px-3">
                <p className="text-sidebar-foreground text-xs font-semibold">{me.name}</p>
                <p className="text-muted-foreground text-xs">{me.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/50 flex items-center px-4 lg:px-6 gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="admin-mobile-menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {navItems.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
            </p>
          </div>
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            View website &rarr;
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
