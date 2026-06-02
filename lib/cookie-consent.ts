export const COOKIE_ACCEPTED_KEY = "auros_cookies_accepted";
export const COOKIE_DECLINED_KEY = "auros_cookies_declined";

export type CookieChoice = "accepted" | "declined" | null;

export function readCookieChoice(): CookieChoice {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem(COOKIE_ACCEPTED_KEY) === "1") return "accepted";
    if (localStorage.getItem(COOKIE_DECLINED_KEY) === "1") return "declined";
  } catch {
    // ignore
  }
  return null;
}

export function saveCookieChoice(choice: "accepted" | "declined") {
  try {
    if (choice === "accepted") {
      localStorage.setItem(COOKIE_ACCEPTED_KEY, "1");
      localStorage.removeItem(COOKIE_DECLINED_KEY);
    } else {
      localStorage.setItem(COOKIE_DECLINED_KEY, "1");
      localStorage.removeItem(COOKIE_ACCEPTED_KEY);
    }
  } catch {
    // ignore
  }
}

export function analyticsAllowed(): boolean {
  return readCookieChoice() === "accepted";
}
