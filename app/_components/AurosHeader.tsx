"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { AurosButton } from "./AurosButton";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";
import { useTranslations } from "./i18n/LocaleProvider";
import { EASE_OUT_EXPO } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/estimate", key: "score" as const },
  { href: "/wizard", key: "tokenize" as const },
  { href: "/dashboard", key: "dossiers" as const },
  { href: "/jurisdictions?from=nav", key: "jurisdictions" as const },
  { href: "/green", key: "green" as const },
  { href: "/partners", key: "partners" as const },
  { href: "/copilot", key: "copilot" as const },
] as const;

export type AurosHeaderVariant = "pill" | "bar";

type AurosHeaderProps = {
  variant?: AurosHeaderVariant;
  breadcrumb?: ReactNode;
  subNav?: ReactNode;
  /** When false, header stays in document flow (e.g. green zone). */
  fixed?: boolean;
};

export function AurosHeader({
  variant = "bar",
  breadcrumb,
  subNav,
  fixed = variant === "bar",
}: AurosHeaderProps) {
  const t = useTranslations();
  const { isSignedIn, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const [stackHeight, setStackHeight] = useState(0);

  const links = NAV_LINKS.map((link) => ({
    href: link.href,
    label: t.nav[link.key],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (variant === "pill" ? 24 : 8));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!fixed || !stackRef.current) return;
    const el = stackRef.current;
    const measure = () => setStackHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixed, breadcrumb, subNav]);

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
          className="hidden !px-4 !py-2 !text-xs md:inline-flex"
        >
          {t.nav.login}
        </AurosButton>
      )}
      <AurosButton
        href="/wizard"
        variant="primary"
        className="hidden !px-4 !py-2.5 !text-xs md:inline-flex"
      >
        {t.nav.start}
      </AurosButton>
    </>
  );

  const navLinks = links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="text-sm text-muted transition hover:text-white"
    >
      {link.label}
    </Link>
  ));

  const headerInner =
    variant === "pill" ? (
      <nav
        className={`flex w-full max-w-4xl items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-500 md:gap-4 md:px-5 ${
          scrolled
            ? "border-white/10 bg-void/80 backdrop-blur-xl"
            : "border-white/[0.06] bg-white/[0.02] backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          className="font-display text-xs font-semibold tracking-[0.35em] text-white"
        >
          AUROS
        </Link>

        <div className="hidden items-center gap-5 lg:gap-6 md:flex">
          {navLinks}
          {authControls}
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t.nav.menu}
        >
          <span
            className={`absolute h-px w-5 bg-white transition-all duration-500 ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-white transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-white transition-all duration-500 ${
              open ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </nav>
    ) : (
      <div
        className={`border-b transition-colors duration-300 ${
          scrolled || !fixed
            ? "border-white/[0.08] bg-void/95 backdrop-blur-xl"
            : "border-white/[0.06] bg-void/90 backdrop-blur-md md:border-white/[0.06]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:gap-4 md:px-6 md:py-4 md:pt-4">
          <Link
            href="/"
            className="font-display text-xs font-semibold tracking-[0.35em] text-white"
          >
            AUROS
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:gap-5 xl:flex">
            {navLinks}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            {authControls}
          </div>

          <button
            type="button"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t.nav.menu}
          >
            <span
              className={`absolute h-px w-5 bg-white transition-all duration-500 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-white transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-white transition-all duration-500 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>
    );

  const mobileMenu = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-void/95 backdrop-blur-xl xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-1 flex-col justify-center gap-3 px-10 pt-24">
            <LanguageSwitcher className="mb-4 self-start" />
            {isLoaded && isSignedIn ? (
              <div className="mb-4 self-start">
                <UserButton />
              </div>
            ) : (
              <AurosButton
                href="/sign-in"
                variant="ghost"
                showArrow={false}
                className="mb-2 self-start !px-0"
                onClick={() => setOpen(false)}
              >
                {t.nav.login}
              </AurosButton>
            )}
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ease: EASE_OUT_EXPO }}
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl text-white"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <AurosButton
              href="/wizard"
              className="mt-6 self-start"
              onClick={() => setOpen(false)}
            >
              {t.nav.start}
            </AurosButton>
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
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-6">
          {headerInner}
        </header>
        {mobileMenu}
      </>
    );
  }

  if (!fixed) {
    return (
      <header className="z-40">
        {stack}
        {mobileMenu}
      </header>
    );
  }

  return (
    <>
      <header
        ref={stackRef}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {stack}
      </header>
      {stackHeight > 0 ? (
        <div aria-hidden className="shrink-0" style={{ height: stackHeight }} />
      ) : null}
      {mobileMenu}
    </>
  );
}
