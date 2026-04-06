$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

function Write-EnvFile {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Path,
    [Parameter(Mandatory = $true)]
    [string] $Content
  )

  Set-Content -Path $Path -Value $Content.Trim() -Encoding utf8
}

$apiEnv = @"
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
BUILD_SERVICE_SECRET=nidorali-local-build-secret
BUILD_SERVICE_URL=http://localhost:3002
JWT_EXPIRES_IN=7d
JWT_SECRET=nidorali-local-jwt-secret
LOG_LEVEL=info
NIDORALI_ADMIN_BEARER_TOKEN=nidorali-local-admin
NIDORALI_SIMULATION_MODE=true
NODE_ENV=development
PORT=3001
RESEND_API_KEY=resend_local_dummy
STRIPE_SECRET_KEY=sk_test_local_dummy
STRIPE_WEBHOOK_SECRET=whsec_local_dummy
SUPABASE_SERVICE_ROLE_KEY=supabase_local_dummy
SUPABASE_URL=https://local.supabase.invalid
"@

$dashboardEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_NIDORALI_ADMIN_BEARER_TOKEN=nidorali-local-admin
NEXT_PUBLIC_NIDORALI_SIMULATION_MODE=true
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_local_dummy
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_local_anon_dummy
NEXT_PUBLIC_SUPABASE_URL=https://local.supabase.invalid
"@

$mobileEnv = @"
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_TENANT_SLUG=demo-club
"@

$buildServiceEnv = @"
BUILD_SERVICE_SECRET=nidorali-local-build-secret
BUILD_SERVICE_SIMULATION_MODE=true
EAS_TOKEN=eas_local_dummy
EXPO_PROJECT_ID=expo-local-project
MOBILE_APP_PATH=../../apps/mobile
NIDORALI_API_URL=http://localhost:3001
NODE_ENV=development
PORT=3002
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=resend_local_dummy
SIMULATION_BUILD_DELAY_MS=1000
SUPABASE_SERVICE_ROLE_KEY=supabase_local_dummy
SUPABASE_URL=https://local.supabase.invalid
"@

Write-EnvFile -Path (Join-Path $root "apps/api/.env") -Content $apiEnv
Write-EnvFile -Path (Join-Path $root "apps/dashboard/.env.local") -Content $dashboardEnv
Write-EnvFile -Path (Join-Path $root "apps/mobile/.env") -Content $mobileEnv
Write-EnvFile -Path (Join-Path $root "apps/build-service/.env") -Content $buildServiceEnv

Write-Host "Simulation locale configurée :"
Write-Host " - apps/api/.env"
Write-Host " - apps/dashboard/.env.local"
Write-Host " - apps/mobile/.env"
Write-Host " - apps/build-service/.env"
