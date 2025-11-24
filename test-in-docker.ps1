# Run tests in Docker
Write-Host "Building and running tests in Docker..."

# Run docker compose
# --abort-on-container-exit: Stops all containers if any container was stopped.
# --exit-code-from tests: Returns the exit code of the 'tests' container.
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from tests

# Capture the exit code
$exitCode = $LASTEXITCODE

# Clean up containers
Write-Host "Cleaning up..."
docker compose -f docker-compose.test.yml down

if ($exitCode -eq 0) {
    Write-Host "Tests passed!" -ForegroundColor Green
} else {
    Write-Host "Tests failed!" -ForegroundColor Red
}

exit $exitCode
