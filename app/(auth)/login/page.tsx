import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/lib/actions";
import { redirectIfAuthenticated } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="px-4 pb-10 pt-8 sm:px-6">
      <AuthForm
        title="Sign in"
        description="Return to your daily reflection rhythm."
        action={signIn}
        actionLabel="Sign in"
        alternateHref="/signup"
        alternateLabel="Create an account"
      />
    </div>
  );
}
