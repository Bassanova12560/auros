"use client";

import { AurosBreadcrumb } from "@/app/_components/AurosBreadcrumb";
import { AurosHeader } from "@/app/_components/AurosHeader";
import { useTranslations } from "@/app/_components/i18n/LocaleProvider";

import { ComparatorSubNav } from "./ComparatorSubNav";

export function CompareSiteHeader() {
  const t = useTranslations();

  return (
    <AurosHeader
      breadcrumb={<AurosBreadcrumb label={t.breadcrumb.compare} />}
      subNav={<ComparatorSubNav />}
    />
  );
}
