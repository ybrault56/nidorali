$ErrorActionPreference = "Stop"

$apiBaseUrl = "http://localhost:3001"
$buildServiceUrl = "http://localhost:3002"
$adminToken = "nidorali-local-admin"
$tenantSlug = "demo-club"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$checkoutSlug = "simulation-$timestamp"
$bundleId = "com.nidorali.simulation$timestamp"
$memberEmail = "member+$timestamp@demo.test"

function Invoke-NidoraliJson {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Method,
    [Parameter(Mandatory = $true)]
    [string] $Uri,
    [hashtable] $Headers,
    $Body
  )

  $params = @{
    Method = $Method
    Uri    = $Uri
  }

  if ($Headers) {
    $params.Headers = $Headers
  }

  if ($null -ne $Body) {
    $params.ContentType = "application/json"
    $params.Body = ($Body | ConvertTo-Json -Depth 10)
  }

  return Invoke-RestMethod @params
}

function Wait-NidoraliEndpoint {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Uri,
    [int] $Attempts = 20,
    [int] $DelaySeconds = 1
  )

  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    try {
      Invoke-NidoraliJson -Method GET -Uri $Uri | Out-Null
      return
    } catch {
      if ($attempt -eq $Attempts) {
        throw
      }

      Start-Sleep -Seconds $DelaySeconds
    }
  }
}

Write-Host "1. Vérification des health checks..."
Wait-NidoraliEndpoint -Uri "$apiBaseUrl/health"
Wait-NidoraliEndpoint -Uri "$buildServiceUrl/health"

Write-Host "2. Lecture de la configuration tenant seedée..."
$config = Invoke-NidoraliJson -Method GET -Uri "$apiBaseUrl/api/config?tenant=$tenantSlug"
if (-not $config.data.slug) {
  throw "La configuration seedée n'a pas été chargée."
}

Write-Host "3. Inscription puis connexion d'un membre mobile..."
$registerPayload = @{
  display_name = "Local Tester"
  email        = $memberEmail
  password     = "password123"
}
$registerResponse = Invoke-NidoraliJson -Method POST -Uri "$apiBaseUrl/api/auth/register" -Headers @{ "x-tenant-id" = $tenantSlug } -Body $registerPayload
$memberToken = $registerResponse.data.token.accessToken
Invoke-NidoraliJson -Method GET -Uri "$apiBaseUrl/api/members" -Headers @{
  "authorization" = "Bearer $memberToken"
  "x-tenant-id"   = $tenantSlug
} | Out-Null

Write-Host "4. Déclenchement du faux checkout..."
$checkoutPayload = @{
  app_name      = "Simulation $timestamp"
  billing_email = "billing+$timestamp@nidorali.local"
  bundle_id     = $bundleId
  plan          = "starter"
  slug          = $checkoutSlug
  tenant_config = @{
    font                 = "Inter"
    logo_url             = $null
    max_users            = 100
    module_documents     = $true
    module_forms         = $true
    module_map           = $true
    module_members       = $true
    module_messaging     = $true
    module_news          = $true
    module_notifications = $true
    module_planning      = $true
    primary_color        = "#0F62FE"
    secondary_color      = "#A7D8FF"
    splash_bg_color      = "#FFFFFF"
  }
}
$checkoutResponse = Invoke-NidoraliJson -Method POST -Uri "$apiBaseUrl/api/billing/checkout-session" -Body $checkoutPayload

Write-Host "5. Vérification du back-office admin..."
$tenantsResponse = Invoke-NidoraliJson -Method GET -Uri "$apiBaseUrl/api/admin/tenants" -Headers @{ "authorization" = "Bearer $adminToken" }
$createdTenant = $tenantsResponse.data | Where-Object { $_.slug -eq $checkoutSlug } | Select-Object -First 1
if (-not $createdTenant) {
  throw "Le tenant simulé n'a pas été créé."
}

Write-Host "6. Attente de la fin du build simulé..."
$tenantDetail = $null
for ($attempt = 0; $attempt -lt 10; $attempt++) {
  Start-Sleep -Seconds 1
  $tenantDetail = Invoke-NidoraliJson -Method GET -Uri "$apiBaseUrl/api/admin/tenants/$($createdTenant.id)" -Headers @{ "authorization" = "Bearer $adminToken" }
  if ($tenantDetail.data.buildJobs[0].status -eq "done") {
    break
  }
}

if (-not $tenantDetail -or $tenantDetail.data.buildJobs[0].status -ne "done") {
  throw "Le build simulé n'a pas atteint l'état done."
}

Write-Host "Simulation locale validée."
Write-Host " - Checkout URL: $($checkoutResponse.data.url)"
Write-Host " - Tenant créé: $($createdTenant.slug)"
Write-Host " - Build final: $($tenantDetail.data.buildJobs[0].status)"
