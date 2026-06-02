import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/app/_components/auth/AuthPageShell";

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUp
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            headerTitle: "Créer un compte AUROS",
            headerSubtitle: "Enregistrez vos dossiers et envoyez votre demande à AUROS",
          },
        }}
      />
    </AuthPageShell>
  );
}
