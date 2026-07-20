"use client";

import { useEffect, useState } from "react";

export const PROTOCOL_PREMIUM_KEY_STORAGE = "auros_protocol_premium_key";

export function useProtocolPremiumKey() {
  const [apiKey, setApiKeyState] = useState("");

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(PROTOCOL_PREMIUM_KEY_STORAGE) ??
        sessionStorage.getItem("auros_chargeflow_console_key");
      if (stored) setApiKeyState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  function setApiKey(value: string) {
    setApiKeyState(value);
    try {
      if (value.trim()) {
        sessionStorage.setItem(PROTOCOL_PREMIUM_KEY_STORAGE, value.trim());
      }
    } catch {
      /* ignore */
    }
  }

  return { apiKey, setApiKey };
}
