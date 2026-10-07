# Point Media - Banco de Talentos

Plataforma web de banco de talentos da Point Media. O sistema conecta candidatos a oportunidades, permitindo que os candidatos criem contas, montem seus currículos, realizem quizzes técnicos para obtenção de selos (badges) e se candidatem a vagas. Por outro lado, a equipe de RH/Admin pode gerenciar vagas e analisar o banco de candidatos.

---

## 🌟 Funcionalidades Atuais

- **Autenticação**: Login/cadastro com JWT em cookie HttpOnly e senhas com BCrypt.
- **Currículo**: Criação e edição do currículo do candidato.
- **Geração de PDF**: Exportação do currículo do candidato para PDF.
- **Vagas**: Consulta e listagem de vagas disponíveis.
- **Candidaturas**: Submissão de aplicações para as vagas abertas.
- **Quizzes**: Testes técnicos com tentativas únicas.
- **Ranking**: Classificação gamificada de candidatos com base no desempenho.
- **Badges**: Conquista de selos de competência técnica mediante aprovação em quizzes.
- **Notificações**: Notificações internas (eventos do sistema e envio administrativo).
- **Painel Administrativo**: Gestão de vagas e visualização do banco de talentos.
- **UI UX**: Tema dinâmico (Dark / Light mode).

---

## 🎭 Perfis de Acesso (Roles)

O sistema possui uma divisão estrita de responsabilidades:

### 👤 Candidato
O Candidato é o usuário final externo. Ele **pode**:
- Criar e editar o próprio currículo.
- Candidatar-se a vagas.
- Consultar suas candidaturas.
- Responder quizzes técnicos.
- Receber selos (badges) baseados em resultados.
- Participar do ranking geral de candidatos.
- Utilizar todos os recursos voltados para o perfil de candidato.

### 🛡️ Admin (RH)
O Administrador gerencia a plataforma. Ele **pode**:
- Acessar o painel administrativo.
- Visualizar e analisar o banco completo de candidatos.
- Gerenciar vagas (criar, editar, excluir).
- Utilizar recursos e ferramentas administrativas da plataforma.

O Admin **NÃO PODE**:
- Criar um currículo pessoal de candidato na sua conta.
- Candidatar-se a vagas.
- Responder quizzes como se fosse um candidato.
- Gerar resultados ou adquirir badges para si mesmo.
- Participar do ranking.
- Aparecer no banco de talentos listado como candidato.

*(Não confunda o Admin com um "candidato com permissões extras". As entidades de negócio são mutuamente exclusivas nas operações diárias da plataforma).*

---

## 🛠️ Tecnologias (Stack)

Principais bibliotecas e frameworks do projeto:

**Frontend:**
- React 19
- Vite 8
- Chakra UI 2
- React Router 7
- TanStack Query 5
- React Hook Form 7
- Zod 4
- html2pdf.js
- Emotion & Framer Motion
- React Icons

**Backend:**
- Java 17
- Spring Boot 3.5
- Spring Security
- Spring Data JPA
- Flyway 11 (Migrations automáticas)
- MySQL 8
- JJWT 0.12.6
- Maven 3.9+

**Infra:**
- Docker
- Git / GitHub
- PowerShell (Scripts de automação local)

---

## ⚙️ Pré-requisitos Oficiais

O ambiente padronizado da equipe requer:

1. **Git**
2. **Node.js 24 LTS**
3. **Java JDK 17** (Versão oficial. *Não utilize Java 21 como padrão*).
4. **Apache Maven 3.9+**
5. **MySQL Server 8.x** (Instalação padrão rodando na porta 3306).
6. **VS Code** (ou IDE equivalente).

> ⚠️ **Atenção:** Evite a instalação paralela de WampServer/MariaDB caso já tenha o MySQL Server. Disputas pela porta `3306` causam falhas silenciosas de conexão. O fluxo oficial utiliza exclusivamente o MySQL 8.

---

## 🚀 Início Rápido (Quick Start)

Desenvolvemos scripts unificados para automatizar o ambiente. No Windows, o fluxo recomendado de desenvolvimento utiliza os scripts PowerShell incluídos no projeto.

### Primeira Vez (Configuração)
Executado apenas uma vez ao clonar o projeto ou se precisar trocar as credenciais:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Setup.ps1
```
*(Valida requisitos, cria o banco e baixa dependências. Parâmetros locais são salvos em `%USERPROFILE%\.pointmedia\dev-config.json` fora do Git. A credencial do banco utiliza o mecanismo local `PSCredential/Export-Clixml` do PowerShell associado ao seu usuário do Windows).*

### Uso Diário (Desenvolvimento)
Execute sempre que for iniciar seu dia de trabalho:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Dev.ps1
```
*(Carrega a configuração, inicia o Spring Boot e o Vite simultaneamente e abre o navegador).*

### Build Completo
Para gerar o build completo e o artefato executável de release (`.jar`):
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Build.ps1
```

> **Artefatos Gerados:** A pasta `backend/src/main/resources/static` é preenchida automaticamente pelo build do frontend para embutir o React no JAR final. Ela NÃO é a fonte do frontend e NÃO deve ser versionada no Git. O código-fonte real do frontend permanece em `src/`.

> **Para saber mais sobre como os scripts funcionam:** Leia [scripts/README.md](scripts/README.md).

---

## 📂 Estrutura do Repositório

```text
point_media/
├── backend/                           # Código-fonte Java (Spring Boot)
├── src/                               # Código-fonte React (Frontend)
├── docs/                              # Documentações adicionais
├── scripts/                           # Scripts locais de automação e build
│   ├── PointMedia-Setup.ps1           # Script de configuração do ambiente
│   ├── PointMedia-Dev.ps1             # Script de desenvolvimento diário
│   ├── PointMedia-Build.ps1           # Script de build unificado
│   └── README.md                      # Documentação dos scripts
├── Dockerfile                         # Configuração Docker (Multi-stage)
├── package.json                       # Dependências Node
├── vite.config.js                     # Config do Vite
└── README.md                          # Esta documentação
```

---

## 🔧 Configuração Manual / Troubleshooting

Este é o fluxo manual. **Para desenvolvimento normal, use os scripts.**
Se você precisar rodar os serviços manualmente sem o PowerShell:

1. **Crie o Banco de Dados:**
   No MySQL, execute: `CREATE DATABASE IF NOT EXISTS point_media_talent_bank;`
2. **Inicie o Backend:**
   No terminal, forneça as variáveis de ambiente e inicie o Maven:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

**Variáveis de Ambiente (`application.properties`)**
| Variável | Descrição |
|---|---|
| `JWT_SECRET` | Obrigatória. Chave para assinar os tokens JWT. |
| `SPRING_DATASOURCE_URL` | Padrão: `jdbc:mysql://localhost:3306/point_media_talent_bank...` |
| `SPRING_DATASOURCE_USERNAME` | Padrão: `root` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco local, se exigida. |
| `CORS_ALLOWED_ORIGINS` | Vazia localmente; obrigatória em produção (origens exatas). |
| `PRODUCTION` | `true` ativa envio de cookies `Secure` (requer HTTPS real). |
| `SHOW_SQL` | Padrão `false`. `true` apenas para diagnóstico. |
| `PORT` | Porta do backend (padrão 8080). |
3. **Inicie o Frontend:**
   Em outro terminal:
   ```bash
   npm ci
   npm run dev
   ```

---

## 🗄️ Banco de Dados e Flyway (Migrations)

O projeto usa Flyway para controle de versão do banco. Nenhuma alteração de schema deve ser feita manualmente; crie um novo arquivo de migração na pasta do backend.

**Importante sobre V9 e Restrições de Quizzes:**
A migração V9 introduz proteção de tentativa única e consistência de snapshot. Ela já foi devidamente **validada** no ambiente de release local em uma instância real de MySQL 8.
Se você for aplicar a migração V9 a uma base *antiga já existente* (que contém dados), utilize o preflight abaixo antes de iniciar a aplicação para identificar duplicidades que travariam a migração:

```sql
SELECT usuario_id, quiz_id, COUNT(*) AS quantidade
FROM resultados_quiz
GROUP BY usuario_id, quiz_id
HAVING COUNT(*) > 1;
```

**Sistema de Quizzes (Scoring):**
- 1 acerto equivale a **100 pontos**.
- A quantidade correta de acertos é absoluta.
- `total_perguntas` age como um snapshot imutável de quando o quiz foi realizado.
- O cálculo da porcentagem é feito via: `(acertos * 100.0) / total_perguntas`. Não utilize o campo `nota` (pontos) para derivar porcentagens.

---

## 🐳 Docker

Docker **não é** o fluxo principal de desenvolvimento. Ele é utilizado estritamente para empacotamento, teste de release local e execução conteinerizada.

**Para empacotar:**
```bash
docker build -t pointmedia .
```

O container compila o frontend e o backend em um único JAR executável. Se você for rodá-lo localmente apontando para o MySQL do host, será necessário utilizar `host.docker.internal` (ou o gateway compatível), pois o `localhost` dentro do container não é a sua máquina.

---

## ✅ Release Validation (Validado Localmente)

Já foram validados no ambiente de release local (Docker + MySQL 8 real + JAR unificado):

- Migrações completas do Flyway (V1–V9).
- Frontend consolidado servido pelo Spring Boot (Integração de roteamento).
- Autenticação JWT.
- Autorização baseada em papéis (CANDIDATO vs ADMIN).
- CORS local testado.
- Criação, leitura/edição e exportação de currículo.
- Fluxos de gestão de vagas.
- Geração de Candidatura (evitando duplicidades).
- Sistema de Quiz (tentativa única e consistência de snapshot `total_perguntas`).
- Ranking gamificado e geração de Badges / Notificações internas.
- Fluxos principais do painel administrativo.
- Tratamento de acessos: `401 Unauthorized` para recursos sem autenticação e `403 Forbidden` quando o usuário não possui a role necessária.

---

## 🚧 Produção — Requisitos Pendentes

O ambiente de produção real precisa das seguintes configurações antes da exposição pública da plataforma:

1. **`JWT_SECRET`:** Deve ser gerado criptograficamente e injetado via variável de ambiente estável.
2. **CORS (`CORS_ALLOWED_ORIGINS`):** Origens reais permitidas devem ser configuradas de forma explícita.
3. **HTTPS / `PRODUCTION=true`:** O sistema deve estar protegido por HTTPS. A variável `PRODUCTION=true` ativa o envio de cookies `Secure`.
4. **Segurança Administrativa:** Trocar a senha do Admin semeado pela V2 e confirmar que a senha genérica não funciona mais.
5. **Políticas Legais:** Publicar Termos de Uso e Política de Privacidade.
6. **Limitações Conhecidas (CSRF):** O sistema utiliza cookies HttpOnly/SameSite e CORS com origens restritas. Essas medidas não substituem uma proteção CSRF dedicada. A necessidade e o desenho dessa proteção devem ser revisados antes da publicação pública.

---

## 📌 Comandos de Qualidade

Antes de abrir Pull Requests ou avaliar sua branch, verifique seu ambiente com:

- **Lint do React:** `npm run lint`
- **Build do React:** `npm run build`
- **Teste Limpo do Backend:** `cd backend` seguido de `mvn clean test`
- **Build Unificado Local:** `powershell -ExecutionPolicy Bypass -File .\scripts\PointMedia-Build.ps1`
- **Integridade do Git:** `git diff --check`

Para visões estendidas do que iremos evoluir no sistema ao longo dos próximos meses, consulte [Plano de Evolução](docs/PLANO_DE_EVOLUCAO.md).
