"use client";

import { AurosBreadcrumb } from "@/app/_components/AurosBreadcrumb";
import { AurosHeader } from "@/app/_components/AurosHeader";
import { useTranslations } from "@/app/_components/i18n/LocaleProvider";

export function AcademySiteHeader() {
  const t = useTranslations();

  return (
    <AurosHeader
      breadcrumb={<AurosBreadcrumb label={t.breadcrumb.academy} />}
    />
  );
}
