-- Watchlist one-click unsubscribe token

alter table public.green_portfolio_watchlists
  add column if not exists unsubscribe_token text;

create unique index if not exists green_portfolio_watchlists_unsub_uidx
  on public.green_portfolio_watchlists (unsubscribe_token)
  where unsubscribe_token is not null;
