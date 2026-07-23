"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050505", color: "#fff", fontFamily: "system-ui" }}>
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.2em", opacity: 0.5 }}>AUROS</p>
          <h1 style={{ marginTop: 16, fontSize: 24 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, maxWidth: 360, fontSize: 14, opacity: 0.6 }}>
            A critical error occurred. You can retry or reload the site.
            {error.digest ? ` · ${error.digest}` : null}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 28,
              borderRadius: 999,
              border: "none",
              background: "#e8e4dc",
              color: "#050505",
              padding: "12px 24px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}
