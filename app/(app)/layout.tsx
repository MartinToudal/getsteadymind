import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentPathname, getReentryState, requireUser } from "@/lib/server-data";

export const dynamic = "force-dynamic";
const REENTRY_BYPASS_COOKIE = "steadymind_reentry_bypass";

export default async function ProtectedLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = await getCurrentPathname();
  const user = await requireUser(pathname || "/home");
  const reentry = await getReentryState(user.id);
  const cookieStore = await cookies();
  const reentryBypass = cookieStore.get(REENTRY_BYPASS_COOKIE)?.value === "1";
  const canUseQuickReflection = reentryBypass && pathname.startsWith("/today/check-in");

  if (reentry.isInactive && !canUseQuickReflection) {
    redirect("/reentry");
  }

  return <AppShell email={user.email}>{children}</AppShell>;
}
