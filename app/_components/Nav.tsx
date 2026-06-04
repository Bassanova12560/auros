"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "./i18n/LanguageSwitcher";
import { useTranslations } from "./i18n/LocaleProvider";
import { PrimaryButton } from "./ui/PrimaryButton";
import { EASE_OUT_EXPO } from "@/lib/motion";

export function Nav() {
  const t = useTranslations();
  const { isSignedIn, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/estimate", label: t.nav.score },
    { href: "/wizard", label: t.nav.tokenize },
    { href: "/dashboard", label: t.nav.dossiers },
    { href: "/jurisdictions?from=nav", label: t.nav.jurisdictions },
    { href: "/partners", label: t.nav.partners },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-6">
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

          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            {isLoaded && isSignedIn ? (
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
            ) : (
              <Link
                href="/sign-in"
                className="text-sm text-white/80 transition hover:text-white"
              >
                {t.nav.login}
              </Link>
            )}
          </div>

          <div className="hidden md:block">
            <PrimaryButton href="/wizard" className="!py-2.5 !text-xs">
              {t.nav.start}
            </PrimaryButton>
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
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-void/95 backdrop-blur-xl md:hidden"
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
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-white/70"
                >
                  {t.nav.login}
                </Link>
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
              <PrimaryButton href="/wizard" className="mt-6">
                {t.nav.start}
              </PrimaryButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
