import { redirect } from "next/navigation";
import { Card } from "@/components/card";
import { ReentryForm } from "@/components/reentry-form";
import { formatDate } from "@/lib/utils";
import { getReentryState, requireUser } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function ReentryPage() {
  const user = await requireUser();
  const reentry = await getReentryState(user.id);

  if (!reentry.isInactive) {
    redirect("/home");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
      <Card className="w-full p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Welcome back</p>
        <h1 className="mt-3 text-4xl font-semibold">Let&apos;s take a quick moment to reset.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          It has been {reentry.daysSinceLastActivity} days since your last reflection.
        </p>
        {reentry.latestActivityAt ? (
          <p className="mt-2 text-sm leading-7 text-muted">
            Last activity: {formatDate(reentry.latestActivityAt)}
          </p>
        ) : null}
        <ReentryForm />
      </Card>
    </div>
  );
}
