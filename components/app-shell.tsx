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
      <header className="mb-6 flex flex-col gap-5 rounded-[32px] border border-border bg-panel/70 p-4 shadow-calm backdrop-blur sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">SteadyMind</p>
          <h1 className="mt-2 max-w-md text-[1.9rem] font-semibold leading-tight sm:text-2xl">Daily reflection with structure.</h1>
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0 sm:pb-0">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <form action={signOut} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {email ? <span className="text-sm text-muted break-all sm:break-normal">{email}</span> : null}
            <Button type="submit" variant="ghost" className="h-10 w-full px-3 sm:w-auto">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
