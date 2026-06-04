"use client";

import { AurosBreadcrumb } from "@/app/_components/AurosBreadcrumb";
import { AurosHeader } from "@/app/_components/AurosHeader";
import { useTranslations } from "@/app/_components/i18n/LocaleProvider";

import { GreenSubNav } from "./GreenSubNav";

export function GreenSiteHeader() {
  const t = useTranslations();

  return (
    <AurosHeader
      fixed={false}
      breadcrumb={
        <AurosBreadcrumb label={t.breadcrumb.green} tone="green" />
      }
      subNav={<GreenSubNav />}
    />
  );
}
