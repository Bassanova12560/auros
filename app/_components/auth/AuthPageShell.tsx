import Link from "next/link";

import { AmbientShell } from "../ui/AmbientShell";
import { Footer } from "../Footer";
import { Nav } from "../Nav";

type Props = {
  children: React.ReactNode;
  backLabel?: string;
};

export function AuthPageShell({
  children,
  backLabel = "← Retour à l'accueil",
}: Props) {
  return (
    <AmbientShell>
      <Nav />
      <main className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pb-16 pt-28">
        <Link
          href="/"
          className="mb-8 self-start font-mono text-[11px] uppercase tracking-wider text-white/50 transition hover:text-white md:self-center"
        >
          {backLabel}
        </Link>
        {children}
      </main>
      <Footer />
    </AmbientShell>
  );
}
