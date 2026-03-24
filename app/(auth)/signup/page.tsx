import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/lib/actions";
import { redirectIfAuthenticated } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <div className="px-4 pb-10 pt-8 sm:px-6">
      <AuthForm
        title="Create account"
        description="Begin with a simple daily check-in, then go deeper when it feels useful."
        action={signUp}
        actionLabel="Create account"
        alternateHref="/login"
        alternateLabel="Already have an account?"
      />
    </div>
  );
}
