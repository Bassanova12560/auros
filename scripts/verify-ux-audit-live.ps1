# UX audit live checks — https://auros-delta.vercel.app
param([string]$Base = "https://auros-delta.vercel.app")

$headers = @{ "Cache-Control" = "no-cache" }

function Test-Html([string]$Html, [string]$Pattern) {
  if ($Html -match $Pattern) { "Y" } else { "N" }
}

function Fetch([string]$Path) {
  (Invoke-WebRequest -Uri "$Base$Path" -Headers $headers -UseBasicParsing).Content
}

Write-Host "UX audit live verification — $Base`n"

$html = Fetch "/compare"
Write-Host "1 /compare header: Score=$(Test-Html $html 'href="/estimate"') Tokeniser=$(Test-Html $html 'Tokeniser') Demarrer=$(Test-Html $html 'D.marrer') isolated=$(Test-Html $html 'AUROScompare')"

$html = Fetch "/green"
Write-Host "2 /green header: Score=$(Test-Html $html 'href="/estimate"') auros.app=$(Test-Html $html 'auros\.app') Demarrer=$(Test-Html $html 'D.marrer')"

$html = Fetch "/"
Write-Host "3 / home: AllerPlusLoin=$(Test-Html $html 'Aller plus loin') CommentCaMarche=$(Test-Html $html 'Comment .a marche') CreerDossier=$(Test-Html $html 'Cr.er mon dossier') Estimer=$(Test-Html $html 'Estimer')"

$html = Fetch "/how-it-works"
Write-Host "4 /how-it-works: ~2min=$(Test-Html $html '~2 min') ~8min=$(Test-Html $html '~8 min') 48h=$(Test-Html $html '48h') faq=$(Test-Html $html 'how-faq-panel-0')"

$html = Fetch "/compare"
$twitterPattern = 'twitter:card" content="([^"]*)"'
$twitter = if ($html -match $twitterPattern) { $matches[1] } else { "missing" }
Write-Host "5 og: compare=$(Test-Html $html 'og:image.*compare') twitter=$twitter"
$html = Fetch "/green"
Write-Host "   green og:image=$(Test-Html $html 'og:image.*green')"

$html = Fetch "/green"
$siteNamePattern = 'og:site_name" content="([^"]*)"'
$siteName = if ($html -match $siteNamePattern) { $matches[1] } else { "missing" }
Write-Host "6 green hub og: siteName=$siteName descFR=$(Test-Html $html 'Place de march')"

$html = Fetch "/trust"
Write-Host "7 /trust SSR: MiCA=$(Test-Html $html 'MiCA-ready') faq=$(Test-Html $html 'trust-faq-panel-0')"

$html = Fetch "/"
$idx = $html.IndexOf("Classes d")
$idx2 = $html.IndexOf("AUROS Green")
$afterStats = if ($idx2 -gt $idx -and $idx -gt 0) { "Y" } else { "N" }
Write-Host "8 home Green cross-sell after stats: $afterStats"
