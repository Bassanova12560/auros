"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getNavHub, type NavHubGroup } from "@/lib/nav-hub";
import { EASE_OUT_EXPO } from "@/lib/motion";

import { AurosButton } from "./AurosButton";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";
import { useLocale, useTranslations } from "./i18n/LocaleProvider";

export type AurosHeaderVariant = "pill" | "bar";

type AurosHeaderProps = {
  variant?: AurosHeaderVariant;
  breadcrumb?: ReactNode;
  subNav?: ReactNode;
  /** When false, header stays in document flow (e.g. green zone). */
  fixed?: boolean;
};

function MegaPanel({
  group,
  onNavigate,
}: {
  group: NavHubGroup;
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {group.items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="rounded-lg px-3 py-2.5 transition hover:bg-white/[0.06]"
        >
          <p className="text-sm font-medium text-white">{item.title}</p>
          <p className="mt-0.5 text-xs leading-snug text-white/45">
            {item.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function AurosHeader({
  variant = "bar",
  breadcrumb,
  subNav,
  fixed = variant === "bar",
}: AurosHeaderProps) {
  const t = useTranslations();
  const { locale } = useLocale();
  const hub = getNavHub(locale);
  const { isSignedIn, isLoaded } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<NavHubGroup["id"] | null>(
    null
  );
  const [mobileSection, setMobileSection] = useState<NavHubGroup["id"] | null>(
    "dossier"
  );
  const [scrolled, setScrolled] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const [stackHeight, setStackHeight] = useState(0);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMega = useCallback(() => setActiveGroup(null), []);
  const openMega = useCallback((id: NavHubGroup["id"]) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveGroup(id);
  }, []);
  const softCloseMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveGroup(null), 160);
  }, []);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > (variant === "pill" ? 24 : 8));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!fixed || !stackRef.current) return;
    const el = stackRef.current;
    const measure = () => setStackHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixed, breadcrumb, subNav, activeGroup]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMega();
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMega]);

  const active = hub.groups.find((g) => g.id === activeGroup) ?? null;

  const authControls = (
    <>
      <LanguageSwitcher />
      {isLoaded && isSignedIn ? (
        <UserButton
          appearance={{
            elements: { avatarBox: "h-8 w-8" },
          }}
        />
      ) : (
        <AurosButton
          href="/sign-in"
          variant="ghost"
          showArrow={false}
          className="hidden !px-3 !py-2 !text-xs lg:inline-flex"
        >
          {t.nav.login}
        </AurosButton>
      )}
      <AurosButton
        href="/wizard"
        variant="primary"
        className="hidden !px-4 !py-2.5 !text-xs sm:inline-flex"
      >
        {hub.primaryCta}
      </AurosButton>
    </>
  );

  const desktopTriggers = (
    <div
      className="hidden items-center gap-1 lg:flex"
      onMouseLeave={softCloseMega}
    >
      {hub.groups.map((group) => {
        const isOn = activeGroup === group.id;
        return (
          <button
            key={group.id}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              isOn
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white"
            }`}
            aria-expanded={isOn}
            aria-controls={panelId}
            onMouseEnter={() => openMega(group.id)}
            onFocus={() => openMega(group.id)}
            onClick={() =>
              setActiveGroup((cur) => (cur === group.id ? null : group.id))
            }
          >
            {group.label}
          </button>
        );
      })}
    </div>
  );

  const megaDropdown =
    active && variant === "bar" ? (
      <div
        id={panelId}
        className="hidden border-b border-white/[0.08] bg-void/98 backdrop-blur-xl lg:block"
        onMouseEnter={() => activeGroup && openMega(activeGroup)}
        onMouseLeave={softCloseMega}
      >
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-base text-white">{active.label}</p>
              <p className="mt-0.5 text-xs text-white/45">{active.blurb}</p>
            </div>
            <Link
              href="/discover"
              onClick={closeMega}
              className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70"
            >
              {hub.exploreAll} →
            </Link>
          </div>
          <MegaPanel group={active} onNavigate={closeMega} />
        </div>
      </div>
    ) : null;

  /** Pill landing: floating panel under header */
  const pillMega =
    active && variant === "pill" ? (
      <div
        id={panelId}
        className="absolute left-1/2 top-full z-50 mt-3 hidden w-[min(92vw,880px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-void/95 p-5 shadow-none backdrop-blur-xl lg:block"
        onMouseEnter={() => activeGroup && openMega(activeGroup)}
        onMouseLeave={softCloseMega}
      >
        <div className="mb-3">
          <p className="font-display text-sm text-white">{active.label}</p>
          <p className="text-xs text-white/45">{active.blurb}</p>
        </div>
        <MegaPanel group={active} onNavigate={closeMega} />
      </div>
    ) : null;

  const menuButton = (
    <button
      type="button"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center lg:hidden"
      onClick={() => {
        closeMega();
        setDrawerOpen((v) => !v);
      }}
      aria-expanded={drawerOpen}
      aria-label={hub.openMenu}
    >
      <span
        className={`absolute h-px w-5 bg-white transition-all duration-500 ${
          drawerOpen ? "rotate-45" : "-translate-y-1.5"
        }`}
      />
      <span
        className={`absolute h-px w-5 bg-white transition-all ${
          drawerOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute h-px w-5 bg-white transition-all duration-500 ${
          drawerOpen ? "-rotate-45" : "translate-y-1.5"
        }`}
      />
    </button>
  );

  const headerInner =
    variant === "pill" ? (
      <div className="relative w-full max-w-5xl">
        <nav
          className={`flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-500 md:gap-4 md:px-5 ${
            scrolled
              ? "border-white/10 bg-void/80 backdrop-blur-xl"
              : "border-white/[0.06] bg-white/[0.02] backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            onClick={closeMega}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/auros-logo.svg"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-[2px] ring-1 ring-white/15"
            />
            <span className="font-display text-xs font-semibold tracking-[0.35em] text-white">
              AUROS
            </span>
          </Link>
          {desktopTriggers}
          <div className="flex items-center gap-2 md:gap-3">
            {authControls}
            {menuButton}
          </div>
        </nav>
        {pillMega}
      </div>
    ) : (
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled || !fixed
            ? "border-white/[0.08] bg-void/95 backdrop-blur-xl"
            : "border-white/[0.06] bg-void/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:gap-4 md:px-6 md:py-3.5 md:pt-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            onClick={closeMega}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/auros-logo.svg"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-[2px] ring-1 ring-white/15"
            />
            <span className="font-display text-xs font-semibold tracking-[0.35em] text-white">
              AUROS
            </span>
          </Link>
          <div className="min-w-0 flex-1 justify-center lg:flex">
            {desktopTriggers}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            {authControls}
            {menuButton}
          </div>
        </div>
        {megaDropdown}
      </div>
    );

  const mobileDrawer = (
    <AnimatePresence>
      {drawerOpen ? (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-void lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={hub.openMenu}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p className="font-display text-xs tracking-[0.35em] text-white">
              AUROS
            </p>
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-wider text-white/50"
              onClick={() => setDrawerOpen(false)}
            >
              {hub.close}
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-3 py-2 scrollbar-none">
            {hub.groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setMobileSection(g.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                  mobileSection === g.id
                    ? "bg-white text-void"
                    : "bg-white/[0.06] text-white/55"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <LanguageSwitcher className="mb-4" />
            {isLoaded && isSignedIn ? (
              <div className="mb-4">
                <UserButton />
              </div>
            ) : (
              <AurosButton
                href="/sign-in"
                variant="ghost"
                showArrow={false}
                className="mb-4 !px-0"
                onClick={() => setDrawerOpen(false)}
              >
                {t.nav.login}
              </AurosButton>
            )}

            {hub.groups
              .filter((g) => g.id === mobileSection)
              .map((group) => (
                <div key={group.id}>
                  <p className="mb-3 text-xs text-white/45">{group.blurb}</p>
                  <ul className="space-y-1">
                    {group.items.map((item, i) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.03 + i * 0.03,
                          ease: EASE_OUT_EXPO,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          className="block rounded-xl border border-transparent px-3 py-3 hover:border-white/10 hover:bg-white/[0.04]"
                        >
                          <p className="font-display text-lg text-white">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-white/45">
                            {item.description}
                          </p>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">
              <AurosButton
                href="/wizard"
                className="w-full sm:w-auto"
                onClick={() => setDrawerOpen(false)}
              >
                {hub.primaryCta}
              </AurosButton>
              <AurosButton
                href="/developers/shield"
                variant="ghost"
                showArrow={false}
                className="w-full sm:w-auto"
                onClick={() => setDrawerOpen(false)}
              >
                {hub.secondaryCta}
              </AurosButton>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  const stack = (
    <>
      {headerInner}
      {breadcrumb}
      {subNav}
    </>
  );

  if (variant === "pill") {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-[max(1rem,env(safe-area-inset-top))] md:px-4 md:pt-5">
          {headerInner}
        </header>
        {mobileDrawer}
      </>
    );
  }

  if (!fixed) {
    return (
      <header className="z-40">
        {stack}
        {mobileDrawer}
      </header>
    );
  }

  return (
    <>
      <header ref={stackRef} className="fixed top-0 left-0 right-0 z-50">
        {stack}
      </header>
      {stackHeight > 0 ? (
        <div aria-hidden className="shrink-0" style={{ height: stackHeight }} />
      ) : null}
      {mobileDrawer}
    </>
  );
}
