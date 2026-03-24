"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 py-2 text-center text-sm transition",
        isActive ? "bg-accentSoft text-accent" : "text-muted hover:text-text",
      )}
    >
      {label}
    </Link>
  );
}
