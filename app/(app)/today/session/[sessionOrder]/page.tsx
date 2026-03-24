import { notFound } from "next/navigation";
import { GuidedSessionForm } from "@/components/guided-session-form";
import { getSessionByOrder, requireUser } from "@/lib/server-data";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionOrder: string }>;
}) {
  await requireUser();
  const { sessionOrder } = await params;
  const session = await getSessionByOrder(Number(sessionOrder));

  if (!session) {
    notFound();
  }

  const nextSessionOrder = session.order < 30 ? session.order + 1 : null;

  return <GuidedSessionForm session={session} nextSessionOrder={nextSessionOrder} />;
}
