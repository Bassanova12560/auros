# Batch 11 live page checks - trust i18n, pricing, green blog featured, wizard phases, compare dedup
param([string]$Base = "https://auros-delta.vercel.app")

$headers = @{ "Cache-Control" = "no-cache" }

function Test-Html([string]$Html, [string]$Pattern) {
  if ($Html -match $Pattern) { "Y" } else { "N" }
}

function Fetch([string]$Path) {
  (Invoke-WebRequest -Uri "$Base$Path" -Headers $headers -UseBasicParsing).Content
}

Write-Host "Batch 11 page verification - $Base`n"

$html = Fetch "/trust"
Write-Host "1 /trust howWeWork=$(Test-Html $html 'Comment nous travaillons') caseStudy=$(Test-Html $html 'Exemples de parcours')"

$html = Fetch "/pricing"
Write-Host "2 /pricing tiers=$(Test-Html $html 'Recommand') starter=$(Test-Html $html 'Starter')"

$html = Fetch "/green/blog"
Write-Host "3 /green/blog featured=$(Test-Html $html '\. la une|Featured|Destacado') readCta=$(Test-Html $html 'Lire l''article|Read article|Leer art')"

$html = Fetch "/wizard"
Write-Host "4 /wizard phases=$(Test-Html $html 'L''actif|Strat.gie|Conformit|R.cap') phaseParam=$(Test-Html $html 'phase=')"

$html = Fetch "/wizard?phase=strategie"
Write-Host "5 /wizard?phase=strategie strategie=$(Test-Html $html 'Strat.gie')"

$html = Fetch "/compare"
Write-Host "6 /compare uniqueCount=$(Test-Html $html 'produits uniques|unique product|productos .nicos')"

Write-Host "`nDone."
