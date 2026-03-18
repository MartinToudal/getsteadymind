import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const user = await getCurrentUser();
  redirect(user ? "/home" : "/login");
}
