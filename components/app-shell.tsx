import type { ReactNode } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { signOut } from "@/lib/actions";
import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/button";

export function AppShell({
  children,
  email,
}: Readonly<{
  children: ReactNode;
  email?: string | null;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 rounded-[32px] border border-border bg-panel/70 p-4 shadow-calm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">SteadyMind</p>
          <h1 className="mt-2 text-2xl font-semibold">Daily reflection with structure.</h1>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <nav className="flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <form action={signOut} className="flex items-center gap-3">
            {email ? <span className="text-sm text-muted">{email}</span> : null}
            <Button type="submit" variant="ghost" className="h-10 px-3">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
