"use client";

import { motion } from "framer-motion";

import { useTranslations } from "./i18n/LocaleProvider";
import { BezelCard } from "./ui/BezelCard";
import { SectionHeader } from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

const SPANS = ["md:col-span-2", "", "", "md:col-span-2"] as const;
const FEATURED = [true, false, false, false] as const;

export function AssetUniverse() {
  const t = useTranslations();
  const au = t.assetUniverse;

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={au.eyebrow}
          title={au.title}
          subtitle={au.subtitle}
          align="left"
        />

        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.08)}
        >
          {au.cards.map((asset, i) => (
            <motion.div
              key={asset.title}
              variants={fadeUp}
              className={SPANS[i]}
            >
              {FEATURED[i] ? (
                <BezelCard innerClassName="p-8">
                  <CardContent asset={asset} />
                </BezelCard>
              ) : (
                <div className="card-flat h-full">
                  <CardContent asset={asset} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CardContent({
  asset,
}: {
  asset: {
    title: string;
    desc: string;
    stat: string;
    statLabel: string;
  };
}) {
  return (
    <>
      <h3 className="font-display text-xl font-semibold text-white">
        {asset.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{asset.desc}</p>
      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <p className="font-display text-xl font-semibold text-white">
          {asset.stat}
        </p>
        <p className="mt-1 font-mono text-[10px] text-white/35">
          {asset.statLabel}
        </p>
      </div>
    </>
  );
}
