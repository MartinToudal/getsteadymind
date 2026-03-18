import { CheckInForm } from "@/components/check-in-form";
import { getRandomPrompt, requireUser } from "@/lib/server-data";

export default async function CheckInPage() {
  await requireUser();
  const prompt = await getRandomPrompt();

  return <CheckInForm prompt={prompt} />;
}
