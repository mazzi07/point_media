# Scripts de Automação — Point Media

Esta pasta contém os scripts em PowerShell oficiais do projeto. Eles foram desenhados para padronizar e facilitar a execução local para todos os desenvolvedores.

## 🛠️ Visão Geral

Os scripts disponíveis são:

1. `PointMedia-Setup.ps1` (Configuração inicial)
2. `PointMedia-Dev.ps1` (Uso diário)
3. `PointMedia-Build.ps1` (Empacotamento completo)

> **Importante:** Todos os scripts devem ser executados no **PowerShell**, preferencialmente na raiz do projeto, utilizando a flag de liberação de execução local:
> `powershell -ExecutionPolicy Bypass -File .\scripts\NomeDoScript.ps1`

---

## 1. PointMedia-Setup.ps1 (Primeira Configuração)

**Quando usar?**
Apenas uma vez, ao clonar o projeto pela primeira vez na sua máquina ou quando você alterar a senha/porta do seu banco de dados local.

**O que ele faz?**
- Verifica a existência de todos os pré-requisitos: Git, Node.js, npm, Java, Maven e MySQL.
- Valida se você está rodando as versões corretas (Node 24 LTS, Java 17).
- Solicita suas configurações locais de banco (usuário, senha, porta).
- Cria o banco `point_media_talent_bank` no seu MySQL caso ele ainda não exista.
- Criptografa a sua senha e salva localmente (fora do repositório) no seu perfil do Windows.
- Executa a instalação limpa das dependências (`npm ci`).
- Faz um teste preliminar de build (lint e build frontend, package backend).

**Segurança Local:**
A configuração e credenciais são salvas nos diretórios:
- `%USERPROFILE%\.pointmedia\dev-config.json`
- `%USERPROFILE%\.pointmedia\mysql-credential.xml`

A senha é protegida pelo `PSCredential` e `Export-Clixml`, usando a criptografia nativa do Windows (DPAPI). Ela fica atrelada unicamente ao seu usuário do Windows na sua máquina.

---

## 2. PointMedia-Dev.ps1 (Uso Diário)

**Quando usar?**
Todos os dias, sempre que for começar a desenvolver.

**O que ele faz?**
- Consome a configuração e as credenciais geradas pelo *Setup*.
- Verifica se você não está programando na branch `main` por engano.
- Confirma que as portas de rede (8080 e 5173) não estão ocupadas por sessões antigas travadas.
- Testa a conexão com o MySQL de forma transparente.
- Gera em memória um `JWT_SECRET` seguro descartável exclusivo para o seu ciclo de testes local daquele dia.
- Inicia o servidor do Spring Boot e o servidor Vite do React de forma paralela.
- Aguarda a inicialização e abre automaticamente o navegador.

---

## 3. PointMedia-Build.ps1 (Empacotamento)

**Quando usar?**
Quando precisar gerar a versão unificada local (JAR) contendo frontend e backend juntos, replicando o comportamento esperado no servidor final ou contêiner.

**O que ele faz?**
- Executa o build de produção do frontend Vite.
- Substitui de forma segura o conteúdo da pasta transitória `backend/src/main/resources/static`.
- Transfere o diretório `dist/` do React para dentro dos resources do Spring Boot.
- Realiza a compilação limpa do Maven (`mvn clean package`), ignorando testes momentaneamente para agilidade.
- Gera o `.jar` final unificado e auto-executável na pasta `backend/target/`.

---

## 🛟 Troubleshooting Comum

- **Erro de "Execução de Scripts Desabilitada":**
  O Windows bloqueia scripts `.ps1` por padrão. Certifique-se de iniciar o comando com `powershell -ExecutionPolicy Bypass -File ...`.
- **A porta 8080 ou 5173 já está em uso:**
  Geralmente acontece se o terminal foi fechado sem encerrar o script de desenvolvimento anterior (Ctrl+C). Mate as instâncias persistentes de Java/Node no Gerenciador de Tarefas e tente novamente.
- **MySQL inacessível:**
  Confirme que o serviço nativo do MySQL está rodando no Windows. Se você trocou a senha do seu banco de dados via Workbench/CLI, lembre-se de rodar novamente o `PointMedia-Setup.ps1` para sincronizar a credencial salva.
- **Dependências desatualizadas no frontend:**
  Se alguém modificou o `package.json` remotamente e você obteve isso no seu `git pull`, feche o servidor diário e rode um `npm ci` manual ou re-execute o *Setup*.
