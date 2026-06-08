$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $PSScriptRoot "Steppa\Web"
$files = @(
  "index.html",
  "styles.css",
  "app.js",
  "level-1.html",
  "level-2.html",
  "level-3.html"
)

New-Item -ItemType Directory -Force -Path $destination | Out-Null

foreach ($file in $files) {
  Copy-Item -Path (Join-Path $root $file) -Destination $destination -Force
}

Write-Host "Synced web assets to $destination"
