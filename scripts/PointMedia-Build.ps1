$ErrorActionPreference = "Stop"

Push-Location -LiteralPath $PSScriptRoot
try {
    Write-Host "Building frontend..."
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build failed (exit code $LASTEXITCODE)."
    }

    $projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
    $staticPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "backend\src\main\resources\static"))
    # Confere o caminho absoluto antes de apagar arquivos recursivamente.
    if (-not $staticPath.StartsWith($projectRoot.TrimEnd('\') + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Static directory must be inside the project root."
    }

    Write-Host "Wiping old static directory..."
    if (Test-Path -LiteralPath $staticPath) {
        Remove-Item -LiteralPath $staticPath -Recurse -Force
    }

    Write-Host "Recreating static directory..."
    New-Item -ItemType Directory -Path $staticPath | Out-Null

    Write-Host "Copying frontend dist to backend static directory..."
    Copy-Item -Path (Join-Path $projectRoot "dist\*") -Destination $staticPath -Recurse -Force

    Write-Host "Building backend..."
    Push-Location -LiteralPath (Join-Path $projectRoot "backend")
    try {
        mvn.cmd clean -DskipTests package
        if ($LASTEXITCODE -ne 0) {
            throw "Backend build failed (exit code $LASTEXITCODE)."
        }
    }
    finally {
        Pop-Location
    }

    Write-Host "Build complete!"
}
finally {
    Pop-Location
}
