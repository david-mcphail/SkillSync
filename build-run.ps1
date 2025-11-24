Param(
    [string]$ComposeFile = "docker-compose.dev.yml",
    [switch]$Rebuild
)

Write-Host "Running docker compose build and up..."

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed or not on PATH."
    exit 1
}

# Check compose file
if (-not (Test-Path $ComposeFile)) {
    Write-Host "Compose file '$ComposeFile' not found."
    exit 1
}

# Rebuild logic
if ($Rebuild) {
    Write-Host "Rebuilding images..."
    docker compose -f $ComposeFile build --no-cache
}
else {
    Write-Host "Building images..."
    docker compose -f $ComposeFile build
}

# Bring the stack up
Write-Host "Starting containers..."
docker compose -f $ComposeFile up -d

# Show status
Write-Host "`nContainer status:"
docker compose -f $ComposeFile ps
