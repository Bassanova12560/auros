/** Optional Google Sheets / webhook mirror for marketplace listings. */

type ListingPayload = {
  id: string;
  actorName: string;
  side: string;
  energyType: string;
  volumeKwh: number;
  pricePerKwh: number;
  city: string;
};

export async function notifyGreenMarketSheets(payload: ListingPayload): Promise<void> {
  const url = process.env.GREEN_MARKET_SHEETS_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "auros-green-market",
        submittedAt: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (err) {
    console.warn("[notifyGreenMarketSheets]", err);
  }
}
