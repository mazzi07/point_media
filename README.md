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
| Framer Motion | 12.x | Animações |
| React Icons | 5.x | Ícones |

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

### Infraestrutura (Dev)
- **WampServer** — Servidor MySQL local (porta 3306)
- **Vite Dev Server** — Servidor frontend (porta 5173) com proxy para backend
- **Spring Boot Embedded Tomcat** — Servidor backend (porta 8080)

---

## 📁 Estrutura do Projeto

```
point_media/
├── 📂 backend/                        # API Spring Boot (Java)
│   ├── pom.xml                        # Dependências Maven
│   ├── RepairDB.java                  # Script utilitário para reparar Flyway
│   └── 📂 src/main/
│       ├── 📂 java/com/pointmedia/auth/
│       │   ├── AuthApplication.java   # Classe principal + seed do admin
│       │   ├── 📂 config/
│       │   │   └── SecurityConfig.java
│       │   ├── 📂 controller/
│       │   │   ├── AuthController.java
│       │   │   ├── CurriculoController.java
│       │   │   ├── VagaController.java
│       │   │   ├── QuizController.java
│       │   │   ├── CandidatoController.java
│       │   │   ├── NotificacaoController.java
│       │   │   ├── AdminStatsController.java
│       │   │   ├── AdminVagaController.java
│       │   │   └── UsuarioController.java
│       │   ├── 📂 model/
│       │   │   ├── Usuario.java
│       │   │   ├── Curriculo.java
│       │   │   ├── Vaga.java
│       │   │   ├── Quiz.java, Pergunta.java, Alternativa.java
│       │   │   ├── ResultadoQuiz.java
│       │   │   ├── Notificacao.java
│       │   │   └── TipoUsuario.java   # Enum: CANDIDATO, ADMIN
│       │   ├── 📂 repository/
│       │   │   ├── UsuarioRepository.java
│       │   │   ├── CurriculoRepository.java
│       │   │   ├── VagaRepository.java
│       │   │   ├── QuizRepository.java
│       │   │   ├── ResultadoQuizRepository.java
│       │   │   └── NotificacaoRepository.java
│       │   └── 📂 security/
│       │       ├── JwtUtil.java
│       │       └── JwtAuthenticationFilter.java
│       └── 📂 resources/
│           ├── application.properties
│           └── 📂 db/migration/       # Flyway SQL migrations
│               ├── V1__init_schema.sql
│               ├── V2__add_vagas.sql
│               ├── V3__add_quizzes.sql
│               ├── V4__add_avatar.sql
│               └── V5__clean_curriculos.sql
│
├── 📂 src/                            # Frontend React
│   ├── main.jsx                       # Entry point
│   ├── App.jsx                        # Rotas e layout principal
│   ├── theme.js                       # Tema Chakra UI customizado
│   ├── index.css                      # CSS global (Inter font)
│   ├── App.css                        # Animações auxiliares
│   ├── 📂 assets/                     # Logo e imagens
│   ├── 📂 context/
│   │   └── AuthContext.jsx            # Estado global de autenticação
│   ├── 📂 services/
│   │   └── api.js                     # Client HTTP centralizado
│   ├── 📂 components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── AuthModal.jsx              # Modal de login/cadastro
│   │   ├── ResumeWizard.jsx           # Wizard de currículo
│   │   ├── AiMentorPanel.jsx          # Painel de dicas
│   │   └── 📂 wizard/                 # Steps atômicos do wizard
│   │       ├── StepBasicInfo.jsx
│   │       ├── StepExperience.jsx
│   │       └── StepSkills.jsx
│   └── 📂 pages/
│       ├── Home.jsx                   # Landing page + dashboard
│       ├── Sobre.jsx                  # Página institucional
│       ├── Vagas.jsx                  # Listagem de vagas
│       ├── CriarPerfil.jsx            # Criação de currículo
│       ├── Quizzes.jsx                # Lista de quizzes + ranking
│       ├── QuizTest.jsx               # Execução do quiz
│       └── AdminPage.jsx              # Painel administrativo
│
├── index.html                         # HTML principal
├── vite.config.js                     # Config do Vite + proxy
├── package.json
└── .gitignore
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18+ e npm
- **Java JDK** 17+
- **Maven** 3.8+
- **MySQL** 8.x (via WampServer ou standalone)

### 1. Banco de Dados (MySQL)

```bash
# 1. Abra o WampServer e inicie o MySQL (porta 3306)
# 2. No phpMyAdmin ou terminal MySQL, crie o banco:
CREATE DATABASE point_media_talent_bank;
```

> ⚠️ O Flyway irá criar todas as tabelas automaticamente ao iniciar o backend.  
> Credenciais padrão: `root` sem senha (WampServer padrão).

### 2. Backend (Spring Boot)

```bash
# Navegue até a pasta do backend
cd backend

# Compile e rode com Maven
mvnw.cmd spring-boot:run
# ou, se tiver Maven instalado globalmente:
mvn spring-boot:run
```

O backend estará em **http://localhost:8080**

> 📌 Na primeira execução, o Flyway roda as migrations e cria as tabelas.  
> Um admin padrão é criado: **admin@pointmedia.com** / **admin123**

### 3. Frontend (React + Vite)

```bash
# Na raiz do projeto
npm install     # Instala dependências (apenas na primeira vez)
npm run dev     # Inicia o servidor de desenvolvimento
```

O frontend estará em **http://localhost:5173**

> O Vite faz proxy de todas as chamadas `/api/*` para `localhost:8080`.

### 4. Acesso

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | Frontend (landing page) |
| http://localhost:8080/api/debug/headers | Debug de headers (backend) |

**Credenciais de teste:**
- **Admin:** admin@pointmedia.com / admin123
- **Candidato:** Crie uma conta via cadastro

---

## 🗄️ Banco de Dados

### Diagrama de Entidades

```
usuarios (1) ─── (1) curriculos
    │                    │
    │                    └── curriculo_habilidades
    │
    ├── notificacoes
    │
    └── resultados_quiz ──── quizzes
                               │
                               └── perguntas
                                      │
                                      └── alternativas

vagas ──── vaga_habilidades
```

### Tabelas Criadas pelo Flyway

| Tabela | Descrição |
|--------|-----------|
| `usuarios` | Dados de autenticação (nome, email, senha hash, tipo) |
| `curriculos` | Currículo vinculado ao usuário |
| `curriculo_habilidades` | Lista de habilidades do currículo |
| `vagas` | Vagas internas da empresa |
| `vaga_habilidades` | Habilidades exigidas por vaga |
| `quizzes` | Quizzes técnicos |
| `perguntas` | Perguntas de cada quiz |
| `alternativas` | Alternativas de cada pergunta |
| `resultados_quiz` | Resultado do candidato em cada quiz |
| `notificacoes` | Notificações enviadas pelo admin |

---

## 🔐 Segurança

- Senhas criptografadas com **BCrypt**
- Autenticação via **JWT** armazenado em cookie **HttpOnly** (protege contra XSS)
- Rotas protegidas com **Spring Security** (RBAC: `ROLE_ADMIN`, `ROLE_CANDIDATO`)
- Frontend protegido com `PrivateRoute` e `AdminRoute`
- CSRF desabilitado (arquitetura stateless JWT)
- CORS configurado para permitir credenciais

---

## 📡 Endpoints da API

### Públicos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/vagas` | Listar vagas |


### Autenticados (Candidato)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/curriculo` | Buscar currículo do usuário logado |
| POST | `/api/curriculo` | Salvar/atualizar currículo |
| POST | `/api/auth/avatar` | Atualizar avatar |
| GET | `/api/quizzes` | Listar quizzes disponíveis |
| GET | `/api/quizzes/{id}` | Detalhes de um quiz |
| POST | `/api/quizzes/{id}/responder` | Enviar respostas do quiz |
| GET | `/api/quizzes/ranking` | Ranking global |
| GET | `/api/notificacoes` | Notificações do usuário |
| PUT | `/api/notificacoes/{id}/ler` | Marcar como lida |

### Admin
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/candidatos` | Listar candidatos com filtros |
| POST | `/api/admin/notificacoes` | Enviar notificação a candidato |
| GET | `/api/admin/stats` | Estatísticas do dashboard admin |
| GET/POST/PUT/DELETE | `/api/admin/vagas` | Gerenciamento de vagas |

---

## 👨‍🎓 Autor

**Mazzi** — Aluno de Análise e Desenvolvimento de Sistemas  
FATEC Tatuí — 1º Ano | TCC 2026

---

## 📄 Licença

Este projeto é de uso acadêmico (TCC FATEC Tatuí).
