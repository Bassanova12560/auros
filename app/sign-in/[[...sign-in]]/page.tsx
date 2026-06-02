import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/app/_components/auth/AuthPageShell";

export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignIn
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            headerTitle: "Connexion à AUROS",
            headerSubtitle: "Accédez à vos dossiers et exports PDF",
          },
        }}
      />
    </AuthPageShell>
  );
}
