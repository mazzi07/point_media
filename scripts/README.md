# Scripts de desenvolvimento — Point Media

Esta pasta contém scripts para facilitar a configuração e a execução local do projeto por integrantes do grupo.

## Requisitos

Antes de usar os scripts, instale:

- Git
- Node.js 24 LTS
- Java JDK 17
- Apache Maven 3.9+
- MySQL Server 8.x

Docker Desktop é opcional para desenvolvimento local.

> Recomendação: evite instalar MySQL Server e WAMP/MariaDB ao mesmo tempo para não criar conflito de porta. O padrão do grupo é MySQL Server na porta `3306`.

## Primeira configuração

Execute apenas uma vez por máquina:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Setup.ps1
```

O script:

- verifica Git, Node, npm, Java, Maven e MySQL;
- valida as versões principais do ambiente;
- pede host, porta, usuário e senha do MySQL;
- cria o banco `point_media_talent_bank` caso ele ainda não exista;
- salva a configuração local fora do repositório;
- salva a senha do MySQL criptografada pelo Windows;
- executa `npm ci`;
- roda lint e build do frontend;
- roda o build Maven do backend;
- mostra a branch atual e avisa se houver alterações locais.

A senha do MySQL não é salva no Git.

## Uso diário

Depois que o Setup tiver sido executado com sucesso, use apenas:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Dev.ps1
```

O script:

- carrega a configuração local desta máquina;
- verifica a branch atual;
- avisa se você estiver na `main`;
- verifica se as portas `8080` e `5173` estão livres;
- testa a conexão com o MySQL;
- gera um JWT secreto temporário;
- inicia o backend Spring Boot;
- inicia o frontend Vite;
- aguarda os serviços responderem;
- abre o navegador automaticamente.

## URLs locais

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

API pública de teste:

```text
http://localhost:8080/api/vagas
```

## Configuração local

Os dados específicos de cada máquina ficam fora do repositório:

```text
%USERPROFILE%\.pointmedia\dev-config.json
%USERPROFILE%\.pointmedia\mysql-credential.xml
```

`dev-config.json` guarda apenas configurações locais, como:

- caminho do projeto;
- host e porta do MySQL;
- nome do banco;
- usuário do banco;
- portas do backend e frontend.

`mysql-credential.xml` armazena a senha usando a criptografia do Windows/PowerShell.

Esse arquivo só pode ser descriptografado pelo mesmo usuário do Windows na mesma máquina.

Para trocar senha, banco, usuário ou caminho do projeto, execute novamente:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Setup.ps1
```

## Fluxo Git recomendado

Não desenvolva diretamente na `main`.

Antes de criar uma nova funcionalidade:

```powershell
git checkout main
git pull --ff-only origin main
git checkout -b feature/nome-da-funcionalidade
git push -u origin feature/nome-da-funcionalidade
```

Antes de começar a trabalhar:

```powershell
git status
git pull
```

Antes de commit ou push:

```powershell
npm.cmd run lint
npm.cmd run build

cd backend
mvn.cmd -DskipTests package
cd ..

git diff --check
git status
```

## Se algo parar de funcionar

### Porta 8080 ou 5173 ocupada

Feche instâncias antigas do Spring Boot ou Vite e execute novamente o script de desenvolvimento.

### MySQL inacessível

Confirme que o serviço MySQL está ligado:

```powershell
mysql -u root -p
```

Se a senha ou configuração mudou, rode novamente o Setup.

### Dependências do frontend mudaram

Se `package-lock.json` mudou após um `git pull`, rode:

```powershell
npm.cmd ci
```

Ou execute novamente o Setup.

### Java, Maven, Node ou MySQL não encontrado

O programa não está instalado ou não está configurado no `PATH`.

Corrija a instalação e execute novamente:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Setup.ps1
```

## Docker

Docker não é necessário para o desenvolvimento diário.

Ele pode ser usado para:

- validar a imagem final;
- testar comportamento de release;
- executar a aplicação em ambiente isolado;
- facilitar demonstrações em máquinas que não vão alterar código.
