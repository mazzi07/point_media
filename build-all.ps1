$ErrorActionPreference = "Stop"

Write-Host "Building frontend..."
npm.cmd run build

Write-Host "Wiping old static directory..."
if (Test-Path "backend\src\main\resources\static") {
    Remove-Item -Recurse -Force "backend\src\main\resources\static"
}

Write-Host "Recreating static directory..."
New-Item -ItemType Directory -Path "backend\src\main\resources\static" | Out-Null

Write-Host "Copying frontend dist to backend static directory..."
Copy-Item -Path "dist\*" -Destination "backend\src\main\resources\static" -Recurse -Force

Write-Host "Building backend..."
Set-Location "backend"
try {
    # Run maven packaging
    mvn.cmd -DskipTests package
}
finally {
    Set-Location ".."
}

Write-Host "Build complete!"
