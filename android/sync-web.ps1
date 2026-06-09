$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$destination = Join-Path $PSScriptRoot "app\src\main\assets"
$files = @(
  "index.html",
  "overview.html",
  "progress.html",
  "programs.html",
  "recommendation.html",
  "task.html",
  "styles.css",
  "app.js",
  "category.html",
  "level-1.html",
  "level-2.html",
  "level-3.html"
)

New-Item -ItemType Directory -Force -Path $destination | Out-Null

foreach ($file in $files) {
  Copy-Item -Path (Join-Path $root $file) -Destination $destination -Force
}

Write-Host "Synced web assets to $destination"
