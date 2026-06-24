# Lanceur de test de charge k6.
# Charge automatiquement les variables depuis .env puis lance le scénario.
#
# Utilisation (depuis la racine du projet) :
#   .\load-tests\run.ps1                       # test de lecture (par défaut)
#   .\load-tests\run.ps1 load-tests\checkout.js  # autre script
#
# Si PowerShell bloque l'exécution du script, lance-le ainsi :
#   powershell -ExecutionPolicy Bypass -File load-tests\run.ps1

param(
  [string]$Script = "load-tests/read-drivers.js"
)

$ErrorActionPreference = "Stop"

# Repérer le binaire k6 (PATH ou chemin d'installation par défaut)
$k6 = (Get-Command k6 -ErrorAction SilentlyContinue).Source
if (-not $k6) { $k6 = "C:\Program Files\k6\k6.exe" }
if (-not (Test-Path $k6)) {
  Write-Error "k6 introuvable. Installe-le avec : winget install --id GrafanaLabs.k6"
  exit 1
}

# Charger les variables depuis .env
$envFile = ".env"
if (-not (Test-Path $envFile)) {
  Write-Error "Fichier .env introuvable. Lance ce script depuis la racine du projet."
  exit 1
}

$cfg = @{}
Get-Content $envFile | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
  $kv = $_ -split '=', 2
  $cfg[$kv[0].Trim()] = $kv[1].Trim().Trim('"').Trim("'")
}

Write-Host "k6      : $k6"
Write-Host "Script  : $Script"
Write-Host "Supabase: $($cfg['VITE_SUPABASE_URL'])"
Write-Host "Lancement du test de charge...`n"

& $k6 run `
  --env VITE_SUPABASE_URL=$($cfg['VITE_SUPABASE_URL']) `
  --env VITE_SUPABASE_ANON_KEY=$($cfg['VITE_SUPABASE_ANON_KEY']) `
  $Script
