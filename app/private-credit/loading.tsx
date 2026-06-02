import { getComparatorMessages } from "@/lib/comparators/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export default function PrivateCreditLoading() {
  const m = getComparatorMessages(DEFAULT_LOCALE);
  return (
    <main className="px-6 pb-4 pt-24 md:pt-28">
      <p className="font-mono text-[10px] text-white/30">{m.loading}</p>
    </main>
  );
}
