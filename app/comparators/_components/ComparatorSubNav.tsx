"use client";

import { ComparatorNavDropdown } from "@/app/comparators/_components/ComparatorNavDropdown";

export function ComparatorSubNav() {
  return (
    <div className="border-b border-white/[0.06] bg-void/90 px-4 py-2 backdrop-blur-md md:px-6">
      <div className="mx-auto flex max-w-6xl items-center">
        <ComparatorNavDropdown />
      </div>
    </div>
  );
}
