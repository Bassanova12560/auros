import { AurosBrandLockup } from "@/app/_components/AurosBrandLockup";

/** @deprecated Prefer AurosBrandLockup product="Protocol" via ContentPageLayout */
export function DeveloperBrandMark() {
  return (
    <AurosBrandLockup
      product="Protocol"
      href="/developers"
      className="mb-6"
    />
  );
}
