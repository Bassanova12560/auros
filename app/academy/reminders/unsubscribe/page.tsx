import { UnsubscribeRemindersView } from "@/app/academy/_components/UnsubscribeRemindersView";
import { unsubscribeAcademyReminders } from "@/lib/academy/reminder-prefs";

export const metadata = {
  title: "Unsubscribe reminders | AUROS Academy",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function AcademyRemindersUnsubscribePage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  const ok = token ? await unsubscribeAcademyReminders(token) : false;

  return <UnsubscribeRemindersView success={ok} />;
}
