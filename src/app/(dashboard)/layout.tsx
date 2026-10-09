import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { GlobalSearch } from "@/components/layout/global-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase);
  const isAdmin = profile?.role === "admin";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background">
        <SidebarNav isAdmin={isAdmin} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-3 pl-11 md:pl-0">
              <Breadcrumb />
            </div>
            <div className="flex items-center gap-3">
              <GlobalSearch />
              <ThemeToggle />
              {profile ? <UserMenu profile={profile} /> : null}
            </div>
          </header>
          <main className="flex-1 px-4 py-5 md:px-6">
            <div className="animate-in">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
