import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { getDashboardData, requireUser } from "@/lib/server-data";

export default async function TodayPage() {
  const user = await requireUser();
  const { nextSession } = await getDashboardData(user.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Quick Check-In</p>
          <h1 className="mt-2 text-3xl font-semibold">Daily Pulse</h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            Capture mood, energy, stress, and one short reflection in under two minutes.
          </p>
        </div>
        <ButtonLink href="/today/check-in" className="w-full justify-between">
          Start Check-In
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </Card>

      <Card className="flex flex-col justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Guided Session</p>
          <h1 className="mt-2 text-3xl font-semibold">Foundation 30</h1>
          <p className="mt-3 text-lg text-text">
            Session {nextSession.order}: {nextSession.title}
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            {nextSession.description} You do not need the perfect answer. Just start where you are.
          </p>
        </div>
        <ButtonLink href={`/today/session/${nextSession.order}`} className="w-full justify-between">
          Continue Session
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </Card>
    </div>
  );
}
