import { SignIn } from "@clerk/nextjs";
import { AUTH_ROUTES } from "@/config/routes";

export default function SignInPage() {
  return (
    <div className="flex min-h-[90dvh] items-center justify-center p-6 bg-background">
      <SignIn 
        path={AUTH_ROUTES.SIGN_IN}
        routing="path" 
        signUpUrl={AUTH_ROUTES.SIGN_UP}
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
