$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) {
    Write-Host ""
    Write-Host "==> $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Warn([string]$Text) {
    Write-Host "[AVISO] $Text" -ForegroundColor Yellow
}

function Find-ProjectPath {
    $candidates = @()

    if ($PSScriptRoot) {
        $candidates += $PSScriptRoot
        $candidates += (Split-Path -Parent $PSScriptRoot)
    }

    $candidates += "C:\Projetos\point_media"

    foreach ($candidate in ($candidates | Select-Object -Unique)) {
        if (
            $candidate -and
            (Test-Path (Join-Path $candidate "package.json")) -and
            (Test-Path (Join-Path $candidate "backend\pom.xml"))
        ) {
            return (Resolve-Path $candidate).Path
        }
    }

    Write-Host ""
    $custom = Read-Host "Digite o caminho completo do repositorio Point Media"

    if (
        -not (Test-Path (Join-Path $custom "package.json")) -or
        -not (Test-Path (Join-Path $custom "backend\pom.xml"))
    ) {
        throw "Nao encontrei package.json e backend\pom.xml nesse caminho."
    }

    return (Resolve-Path $custom).Path
}

function Require-Command([string]$Command, [string]$FriendlyName) {
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "$FriendlyName nao foi encontrado no PATH. Instale/configure antes de continuar."
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

function Get-JavaVersionLine {
    # java -version escreve no STDERR em algumas distribuicoes.
    # Via cmd.exe capturamos a saida como texto comum, sem o PowerShell
    # interpreta-la como erro quando ErrorActionPreference = Stop.
    $lines = & cmd.exe /d /c "java -version 2>&1"
    if ($LASTEXITCODE -ne 0 -or -not $lines) {
        throw "Nao foi possivel obter a versao do Java."
    }
    return [string]($lines | Select-Object -First 1)
}

try {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "       POINT MEDIA - SETUP DE DEV          " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Execute este script apenas na primeira configuracao" -ForegroundColor DarkGray
    Write-Host "ou quando quiser trocar as configuracoes locais." -ForegroundColor DarkGray

    $ProjectPath = Find-ProjectPath
    Write-Ok "Repositorio encontrado em $ProjectPath"

    Write-Step "Verificando dependencias"

    Require-Command "git.exe" "Git"
    Require-Command "node.exe" "Node.js"
    Require-Command "npm.cmd" "npm"
    Require-Command "java.exe" "Java"
    Require-Command "mvn.cmd" "Apache Maven"
    Require-Command "mysql.exe" "MySQL Client"

    $gitVersion = (& git.exe --version) -join " "
    $nodeVersion = (& node.exe -p "process.versions.node").Trim()
    $npmVersion = (& npm.cmd -v).Trim()
    $javaVersion = Get-JavaVersionLine
    $mavenVersion = (& mvn.cmd -version | Select-Object -First 1) -join ""
    $mysqlVersion = (& mysql.exe --version) -join " "

    Write-Ok $gitVersion
    Write-Ok "Node $nodeVersion"
    Write-Ok "npm $npmVersion"
    Write-Ok $javaVersion
    Write-Ok $mavenVersion
    Write-Ok $mysqlVersion

    $nodeParts = $nodeVersion.Split(".")
    $nodeMajor = [int]$nodeParts[0]
    $nodeMinor = [int]$nodeParts[1]

    $nodeCompatible = (
        ($nodeMajor -eq 20 -and $nodeMinor -ge 19) -or
        ($nodeMajor -eq 22 -and $nodeMinor -ge 12) -or
        ($nodeMajor -gt 22)
    )

    if (-not $nodeCompatible) {
        throw "Node $nodeVersion nao atende ao Vite atual. Use Node 24 LTS (recomendado)."
    }

    if ($nodeMajor -ne 24) {
        Write-Warn "O projeto aceita esta versao, mas o padrao oficial do grupo e Node 24 LTS."
    }

    if ($javaVersion -notmatch 'version "17(\.|")') {
        Write-Warn "O padrao oficial do projeto e Java 17."
    }

    Write-Step "Configurando MySQL local"

    $dbHost = Read-Host "Host do MySQL [localhost]"
    if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

    $dbPortInput = Read-Host "Porta do MySQL [3306]"
    if ([string]::IsNullOrWhiteSpace($dbPortInput)) {
        $dbPort = 3306
    }
    else {
        $dbPort = [int]$dbPortInput
    }

    $dbUser = Read-Host "Usuario do MySQL [root]"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }

    $dbName = Read-Host "Banco do Point Media [point_media_talent_bank]"
    if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "point_media_talent_bank" }

    if ($dbName -notmatch '^[A-Za-z0-9_]+$') {
        throw "Nome de banco invalido. Use apenas letras, numeros e underscore."
    }

    $securePassword = Read-Host "Senha do MySQL para $dbUser" -AsSecureString
    $plainPassword = Convert-SecureToPlain $securePassword

    $env:MYSQL_PWD = $plainPassword
    try {
        & mysql.exe --protocol=TCP -h $dbHost -P $dbPort -u $dbUser --connect-timeout=5 -e "SELECT VERSION();" | Out-Null

        if ($LASTEXITCODE -ne 0) {
            throw "Nao foi possivel conectar ao MySQL com os dados informados."
        }

        Write-Ok "Conexao com MySQL funcionando."

        $createDbSql = "CREATE DATABASE IF NOT EXISTS ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        & mysql.exe --protocol=TCP -h $dbHost -P $dbPort -u $dbUser -e $createDbSql

        if ($LASTEXITCODE -ne 0) {
            throw "Nao foi possivel criar/verificar o banco $dbName."
        }

        Write-Ok "Banco $dbName pronto."
    }
    finally {
        Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
        Remove-Variable plainPassword -ErrorAction SilentlyContinue
    }

    Write-Step "Salvando configuracao local fora do Git"

    $ConfigDir = Join-Path $env:USERPROFILE ".pointmedia"
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null

    $ConfigPath = Join-Path $ConfigDir "dev-config.json"
    $CredentialPath = Join-Path $ConfigDir "mysql-credential.xml"

    $config = [ordered]@{
        projectPath  = $ProjectPath
        dbHost       = $dbHost
        dbPort       = $dbPort
        dbName       = $dbName
        dbUser       = $dbUser
        backendPort  = 8080
        frontendPort = 5173
    }

    $config | ConvertTo-Json | Set-Content -Path $ConfigPath -Encoding UTF8

    $credential = New-Object System.Management.Automation.PSCredential($dbUser, $securePassword)
    $credential | Export-Clixml -Path $CredentialPath

    Write-Ok "Configuracao: $ConfigPath"
    Write-Ok "Senha criptografada pelo Windows: $CredentialPath"
    Write-Host "A senha nao fica dentro do repositorio." -ForegroundColor DarkGray
    Write-Host "O arquivo de credencial so pode ser descriptografado pelo mesmo usuario do Windows nesta maquina." -ForegroundColor DarkGray

    Write-Step "Instalando dependencias do frontend"

    Push-Location $ProjectPath
    try {
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw "npm ci falhou." }

        Write-Step "Rodando lint do frontend"
        & npm.cmd run lint
        if ($LASTEXITCODE -ne 0) { throw "Lint falhou." }

        Write-Step "Testando build do frontend"
        & npm.cmd run build
        if ($LASTEXITCODE -ne 0) { throw "Build do frontend falhou." }
    }
    finally {
        Pop-Location
    }

    Write-Step "Testando build do backend"

    Push-Location (Join-Path $ProjectPath "backend")
    try {
        & mvn.cmd -DskipTests package
        if ($LASTEXITCODE -ne 0) { throw "Build Maven falhou." }
    }
    finally {
        Pop-Location
    }

    Write-Step "Conferindo Git"

    Push-Location $ProjectPath
    try {
        $branch = (& git.exe branch --show-current).Trim()
        $status = (& git.exe status --short)

        Write-Ok "Branch atual: $branch"

        if ($status) {
            Write-Warn "Existem alteracoes locais no repositorio:"
            $status | ForEach-Object { Write-Host "  $_" }
        }
        else {
            Write-Ok "Working tree limpa."
        }
    }
    finally {
        Pop-Location
    }

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "            SETUP CONCLUIDO                " -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "No uso diario, execute apenas:" -ForegroundColor White
    Write-Host "  PointMedia-Dev.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Nao e necessario configurar banco, JWT ou variaveis novamente." -ForegroundColor DarkGray
}
catch {
    Write-Host ""
    Write-Host "SETUP INTERROMPIDO" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrija o item acima e execute PointMedia-Setup.ps1 novamente." -ForegroundColor Yellow
    Read-Host "Pressione ENTER para fechar"
    exit 1
}
