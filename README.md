# 🎯 Point Media — Banco de Talentos

> **Projeto de TCC** — FATEC Tatuí | Análise e Desenvolvimento de Sistemas  
> Plataforma web de banco de talentos para a empresa **Point Media**, conectando candidatos qualificados às melhores oportunidades da empresa.

---

## 📋 Sobre o Projeto

O **Point Media Talent Bank** é uma aplicação web fullstack que funciona como um **banco de talentos interno** da empresa Point Media (empresa real de mídia digital atuante desde 2017). A plataforma permite que candidatos criem perfis profissionais, realizem quizzes técnicos e sejam avaliados por recrutadores.

### Funcionalidades Principais

| Módulo | Descrição |
|--------|-----------|
| 🔐 **Autenticação** | Login/cadastro com JWT via cookies HttpOnly + BCrypt |
| 📄 **Currículo** | Wizard de 3 etapas (dados básicos → experiência → habilidades) |
| 💼 **Vagas** | Listagem de vagas internas com filtros por área e busca |
| 🧠 **Quizzes** | Avaliações técnicas com timer, correção automática e ranking |
| 🏆 **Ranking** | Ranking global de candidatos com pódio e pontuação |
| 🔔 **Notificações** | Admin pode enviar notificações para candidatos específicos |
| 👨‍💼 **Painel Admin** | Visualização de candidatos, filtros e envio de notificações |
| 🌗 **Tema** | Suporte a Dark Mode e Light Mode |

### Papéis Atuais (Roles)
- **CANDIDATO**: Papel padrão ao realizar o registro público. Pode acessar vagas, fazer quizzes e criar currículo.
- **ADMIN**: Recrutador. Pode acessar o painel administrativo, visualizar candidatos e enviar notificações.

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.x | Biblioteca de UI |
| Vite | 8.x | Build tool / dev server |
| Chakra UI | 2.x | Design system / componentes |
| React Router DOM | 7.x | Roteamento SPA |
| TanStack React Query | 5.x | Cache e gerenciamento de estado servidor |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 4.x | Validação de schemas |
| html2pdf.js | 0.14.x | Geração de currículo em PDF |

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.5.x | Framework web |
| Spring Security | - | Autenticação e autorização |
| Spring Data JPA | - | ORM / acesso a dados |
| MySQL | 8.x | Banco de dados relacional |
| Flyway | 11.x | Migrations do banco de dados |
| JJWT | 0.12.6 | Geração/validação de JWT |
| Maven | - | Gerenciador de dependências |

---

## 📁 Estrutura do Projeto

```
point_media/
├── 📂 backend/                        # API Spring Boot (Java)
│   ├── pom.xml                        # Dependências Maven
│   └── 📂 src/main/
│       ├── 📂 java/com/pointmedia/auth/
│       │   ├── AuthApplication.java   # Classe principal
│       │   ├── 📂 config/
│       │   │   ├── SecurityConfig.java
│       │   │   └── SpaWebConfig.java  # Roteamento SPA (fallback pro index.html)
│       │   ├── 📂 controller/         # Endpoints REST (Auth, Curriculo, Quizzes, Vagas, Admin)
│       │   ├── 📂 model/              # Entidades JPA (Usuario, Curriculo, etc.)
│       │   ├── 📂 repository/         # Spring Data Repositories
│       │   └── 📂 security/           # Configuração JWT e Filtros
│       └── 📂 resources/
│           ├── application.properties # Configurações da aplicação
│           └── 📂 db/migration/       # Flyway SQL migrations (V1 a V9)
│
├── 📂 src/                            # Frontend React
│   ├── main.jsx                       # Entry point
│   ├── App.jsx                        # Rotas e layout principal
│   ├── 📂 assets/                     # Logo e imagens
│   ├── 📂 context/                    # Contextos (AuthContext)
│   ├── 📂 services/                   # Integrações com API
│   ├── 📂 components/                 # Componentes genéricos e UI modular (ex: vagas, admin)
│   └── 📂 pages/                      # Views de páginas completas (Home, Vagas, AdminPage)
│
├── 📂 docs/                           # Documentações adicionais (Plano de Evolução, Apresentação)
├── build-all.ps1                      # Script de build Windows unificado
├── Dockerfile                         # Configuração Docker (Multi-stage)
├── vite.config.js                     # Config do Vite
└── package.json
```

---

## 🚀 Como Rodar o Projeto (Desenvolvimento)

O fluxo de desenvolvimento normal envolve rodar o backend no Spring Boot e o frontend pelo Vite simultaneamente.

### Pré-requisitos
- **Node.js** 18+ e npm
- **Java JDK** 17+
- **Maven** 3.8+
- **MySQL** 8.x (via WampServer ou standalone)

### 1. Banco de Dados (MySQL)
Crie o banco de dados via console MySQL ou phpMyAdmin (porta 3306 padrão):
```sql
CREATE DATABASE point_media_talent_bank;
```
> ⚠️ O Flyway roda automaticamente ao iniciar o Spring Boot e executa todas as migrações na pasta `db/migration`.
> O script `V2__add_vagas.sql` cria automaticamente a conta de administrador inicial.

### 2. Backend (Spring Boot)
Defina uma chave JWT privada antes de iniciar o backend. Para uma sessão local de PowerShell, gere uma chave aleatória sem imprimi-la:
```powershell
$secretBytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($secretBytes)
$env:JWT_SECRET = [Convert]::ToBase64String($secretBytes)
```
Em produção, armazene uma chave forte e estável em `JWT_SECRET` no gerenciador de segredos do ambiente. Não existe fallback no código.

```bash
cd backend
mvn spring-boot:run
```
O backend ficará disponível em **http://localhost:8080**.

### 3. Frontend (React + Vite)
Abra outro terminal na raiz do projeto:
```bash
npm install
npm run dev
```
O frontend estará em **http://localhost:5173**. Todas as requisições para `/api` são direcionadas automaticamente via proxy para a porta 8080.

---

## 📦 Build e Deploy

### Regras de Build e Artefatos (Generated Artifacts Policy)
- A pasta `backend/src/main/resources/static` é o destino final do build do frontend, mas **não é versionada no Git**.
- O código-fonte do React fica em `src/` e é a única fonte da verdade do frontend.

### Build Unificado Local (Windows)
Para gerar o arquivo `.jar` executável contendo o backend e o frontend embutido para produção, utilize o script Powershell incluso:
```powershell
.\build-all.ps1
```
Esse script fará o build do Vite, apagará o diretório `static` antigo, copiará a nova build `dist/` para dentro do backend e executará o empacotamento via Maven (`mvn package`).

### Build via Docker
O projeto conta com um `Dockerfile` multi-stage que:
1. Faz o build do frontend usando Node.
2. Faz o build do backend usando Maven.
3. Copia o frontend para dentro da imagem de backend e compila um único JAR executável.

```bash
docker build -t pointmedia .
docker run -p 8080:8080 pointmedia
```

---

## 🧪 Comandos Úteis e Qualidade

**Verificar Linters e Build do Frontend:**
```bash
npm run lint
npm run build
```

**Validar Compilação do Backend:**
```bash
cd backend
mvn -DskipTests package
```

---

## 🚨 Notas e Known Issues
- **Segurança de release**: use HTTPS e `PRODUCTION=true` para cookies `Secure`. Configure `CORS_ALLOWED_ORIGINS` com as origens completas permitidas, separadas por vírgula, sem caminhos, barra final ou curingas (ex.: `https://talentos.exemplo.com`). Produção não inicia sem essa configuração; desenvolvimento sem configuração aceita apenas `http://localhost:5173` e `http://127.0.0.1:5173`.
- **Admin de demonstração**: V2 cria `admin@pointmedia.com` e V8 redefine sua senha para `admin123`. As migrações históricas permanecem intactas. Após aplicar todas as migrações e antes de expor o ambiente, substitua `usuarios.senha_hash` dessa conta por um BCrypt de uma senha forte e exclusiva, via operação administrativa controlada, e verifique o login. Não publique o ambiente com a senha conhecida; trocar apenas `JWT_SECRET` não troca essa senha.
- **CSRF**: cookies HttpOnly/SameSite=Lax e CORS com origens exatas reduzem requisições entre sites, mas não substituem proteção CSRF completa. O contrato atual continua sem token CSRF; origens/subdomínios confiáveis precisam permanecer sob controle. Uma futura proteção com token deve implementar cliente e servidor juntos.
- **Migração V9 existente**: `V9__quiz_result_integrity.sql` adiciona o snapshot `total_perguntas` e a restrição única por usuário/quiz. Ela **ainda não foi executada em uma instância descartável real de MySQL**. Antes de aplicá-la a uma base existente com dados, execute este preflight de duplicados:

```sql
SELECT usuario_id, quiz_id, COUNT(*) AS quantidade
FROM resultados_quiz
GROUP BY usuario_id, quiz_id
HAVING COUNT(*) > 1;
```

Se houver duplicados, revise os resultados antes de aplicar V9; a migração falha sem apagá-los automaticamente.

---

## 👨‍🎓 Autor

**Mazzi** — Aluno de Análise e Desenvolvimento de Sistemas  
FATEC Tatuí — 1º Ano | TCC 2026
