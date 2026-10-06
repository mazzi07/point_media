$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) {
    Write-Host ""
    Write-Host "==> $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Test-LocalPort([int]$Port) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $async = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        $connected = $async.AsyncWaitHandle.WaitOne(400)

        if (-not $connected) {
            return $false
        }

        $client.EndConnect($async)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Close()
    }
}

function Convert-SecureToPlain([Security.SecureString]$SecureValue) {
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

function Encode-Command([string]$Command) {
    return [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($Command))
}

function Wait-ForUrl([string]$Url, [int]$TimeoutSeconds) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return $true
            }
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }

    return $false
}

try {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "        POINT MEDIA - AMBIENTE DEV         " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    $ConfigDir = Join-Path $env:USERPROFILE ".pointmedia"
    $ConfigPath = Join-Path $ConfigDir "dev-config.json"
    $CredentialPath = Join-Path $ConfigDir "mysql-credential.xml"

    if (-not (Test-Path $ConfigPath) -or -not (Test-Path $CredentialPath)) {
        throw "Configuracao local nao encontrada. Execute PointMedia-Setup.ps1 primeiro."
    }

    $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
    $credential = Import-Clixml $CredentialPath

    $ProjectPath = [string]$config.projectPath
    $BackendPort = [int]$config.backendPort
    $FrontendPort = [int]$config.frontendPort

    if (
        -not (Test-Path (Join-Path $ProjectPath "package.json")) -or
        -not (Test-Path (Join-Path $ProjectPath "backend\pom.xml"))
    ) {
        throw "O repositorio nao existe mais em $ProjectPath. Rode o Setup novamente."
    }

    if (-not (Get-Command mvn.cmd -ErrorAction SilentlyContinue)) {
        throw "Maven nao encontrado. Rode o Setup novamente."
    }

    if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
        throw "npm nao encontrado. Rode o Setup novamente."
    }

    if (-not (Test-Path (Join-Path $ProjectPath "node_modules"))) {
        throw "node_modules nao existe. Execute PointMedia-Setup.ps1 novamente."
    }

    Write-Step "Conferindo branch"

    Push-Location $ProjectPath
    try {
        $branch = (& git.exe branch --show-current).Trim()
        Write-Ok "Branch atual: $branch"

        if ($branch -eq "main") {
            Write-Host "[AVISO] Voce esta na MAIN. Para desenvolver, use uma branch de trabalho." -ForegroundColor Yellow
        }

        $status = (& git.exe status --short)
        if ($status) {
            Write-Host "[AVISO] Existem alteracoes locais nao commitadas." -ForegroundColor Yellow
        }
    }
    finally {
        Pop-Location
    }

    Write-Step "Conferindo portas"

    if (Test-LocalPort $BackendPort) {
        throw "A porta $BackendPort ja esta em uso. Feche o backend/processo anterior antes de iniciar."
    }

    if (Test-LocalPort $FrontendPort) {
        throw "A porta $FrontendPort ja esta em uso. Feche o Vite/processo anterior antes de iniciar."
    }

    Write-Ok "Portas $BackendPort e $FrontendPort livres."

    Write-Step "Conferindo MySQL"

    $plainPassword = Convert-SecureToPlain $credential.Password
    $env:MYSQL_PWD = $plainPassword

    try {
        & mysql.exe --protocol=TCP `
            -h ([string]$config.dbHost) `
            -P ([int]$config.dbPort) `
            -u ([string]$config.dbUser) `
            --connect-timeout=5 `
            -D ([string]$config.dbName) `
            -e "SELECT 1;" | Out-Null

        if ($LASTEXITCODE -ne 0) {
            throw "Nao foi possivel acessar o MySQL. Verifique se o servico esta ligado."
        }
    }
    finally {
        Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
    }

    Write-Ok "MySQL e banco $($config.dbName) acessiveis."

    Write-Step "Preparando backend"

    $dbUrl = "jdbc:mysql://$($config.dbHost):$($config.dbPort)/$($config.dbName)?serverTimezone=UTC&useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&useSSL=false"

    $env:SPRING_DATASOURCE_URL = $dbUrl
    $env:SPRING_DATASOURCE_USERNAME = [string]$config.dbUser
    $env:SPRING_DATASOURCE_PASSWORD = $plainPassword
    $env:PRODUCTION = "false"
    $env:SHOW_SQL = "false"
    $env:PORT = [string]$BackendPort

    Remove-Item Env:CORS_ALLOWED_ORIGINS -ErrorAction SilentlyContinue

    $bytes = New-Object byte[] 64
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()
    $env:JWT_SECRET = [Convert]::ToBase64String($bytes)

    $backendPath = Join-Path $ProjectPath "backend"
    $backendCommand = @"
`$Host.UI.RawUI.WindowTitle = 'Point Media - Backend'
Set-Location -LiteralPath '$($backendPath.Replace("'", "''"))'
Write-Host 'POINT MEDIA - BACKEND' -ForegroundColor Cyan
Write-Host 'Banco: $($config.dbName)' -ForegroundColor DarkGray
Write-Host ''
mvn.cmd spring-boot:run
"@

    $backendEncoded = Encode-Command $backendCommand

    Start-Process powershell.exe -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-EncodedCommand", $backendEncoded
    )

    # O processo do backend ja herdou as variaveis. Limpamos os segredos
    # antes de iniciar qualquer outro processo.
    Remove-Item Env:SPRING_DATASOURCE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_USERNAME -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:JWT_SECRET -ErrorAction SilentlyContinue
    Remove-Item Env:PRODUCTION -ErrorAction SilentlyContinue
    Remove-Item Env:SHOW_SQL -ErrorAction SilentlyContinue
    Remove-Item Env:PORT -ErrorAction SilentlyContinue
    Remove-Variable plainPassword -ErrorAction SilentlyContinue

    Write-Step "Iniciando frontend"

    $frontendCommand = @"
`$Host.UI.RawUI.WindowTitle = 'Point Media - Frontend'
Set-Location -LiteralPath '$($ProjectPath.Replace("'", "''"))'
Write-Host 'POINT MEDIA - FRONTEND' -ForegroundColor Cyan
Write-Host ''
npm.cmd run dev -- --host 127.0.0.1 --port $FrontendPort --strictPort
"@

    $frontendEncoded = Encode-Command $frontendCommand

    Start-Process powershell.exe -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-EncodedCommand", $frontendEncoded
    )

    Write-Step "Aguardando aplicacao"

    $backendReady = Wait-ForUrl "http://localhost:$BackendPort/api/vagas" 90
    if ($backendReady) {
        Write-Ok "Backend respondeu em http://localhost:$BackendPort"
    }
    else {
        Write-Host "[AVISO] Backend ainda nao respondeu. Confira a janela 'Point Media - Backend'." -ForegroundColor Yellow
    }

    $frontendReady = Wait-ForUrl "http://localhost:$FrontendPort" 45
    if ($frontendReady) {
        Write-Ok "Frontend respondeu em http://localhost:$FrontendPort"
        Start-Process "http://localhost:$FrontendPort"
    }
    else {
        Write-Host "[AVISO] Frontend ainda nao respondeu. Confira a janela 'Point Media - Frontend'." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "          POINT MEDIA INICIADO             " -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:$FrontendPort"
    Write-Host "Backend:  http://localhost:$BackendPort"
    Write-Host "Banco:    $($config.dbName)"
    Write-Host ""
    Write-Host "Para encerrar, pressione Ctrl+C nas janelas Backend e Frontend." -ForegroundColor DarkGray
    Write-Host "Este launcher pode ser fechado." -ForegroundColor DarkGray
}
catch {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
    Remove-Item Env:SPRING_DATASOURCE_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:JWT_SECRET -ErrorAction SilentlyContinue

    Write-Host ""
    Write-Host "NAO FOI POSSIVEL INICIAR O POINT MEDIA" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Se a configuracao mudou, execute PointMedia-Setup.ps1 novamente." -ForegroundColor Yellow
    Read-Host "Pressione ENTER para fechar"
    exit 1
}
