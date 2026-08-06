# Plano de Evolução — Point Media Talent Bank

## 1. Resumo executivo

O projeto encontra-se em um estágio funcional inicial, contando com sistema de autenticação via JWT, gestão básica de vagas, currículos, quizzes e candidaturas. O objetivo deste documento é organizar a evolução do sistema rumo a uma plataforma completa de recrutamento, com base nas observações e requisitos levantados pela equipe. 

A estratégia consistirá em solidificar primeiro as regras de negócio centrais (prevenção de duplicatas, correto relacionamento entre candidatos e vagas) antes de focar em melhorias de interface (UX) e em novas features mais complexas (como upload de PDF, chat e moderação por IA).

## 2. Diagnóstico do projeto atual

* **Arquitetura:** React + Vite (Frontend) comunicando-se via REST API com Spring Boot (Backend). Banco de dados MySQL usando Flyway para migrações. Autenticação baseada em JWT HttpOnly.
* **Funcionalidades encontradas (Confirmadas no código):**
  * Cadastro e login (roles `CANDIDATO` e `ADMIN`).
  * Wizard de criação de currículo (Dados Básicos, Experiência, Habilidades).
  * Criação, edição e exclusão de Vagas pelo painel administrativo.
  * Listagem e candidatura em Vagas.
  * Realização de Quizzes (com cálculo de nota e acertos).
  * Envio de notificações pelo administrador e listagem para o usuário.
* **Problemas confirmados & Diferenças entre relato e código:**
  * *Repetição indevida de quiz:* A equipe relatou isso como um bug, porém, o backend **já possui** a trava em `QuizController` (`resultadoQuizRepository.findByUsuarioAndQuiz`). Isso indica que o problema é de UX no frontend (a página permite fazer o quiz de novo, apenas falhando silenciosamente ou mostrando erro na hora do envio).
  * *Candidaturas:* A equipe sugeriu criar a estrutura de candidaturas, mas ela **já existe** (`Candidatura.java`, `V7__add_candidaturas.sql`). O problema real é que o Admin não visualiza esses dados.
  * *Usuário vs Candidato:* Atualmente, o painel de admin (`CandidatoController`) lista todos que possuem um currículo cadastrado, não importando se já se candidataram a uma vaga ou não.
* **Riscos técnicos:** A lógica de "badges" (selos) é atualmente calculada sob demanda e enviada pelo backend sem armazenamento de persistência (apenas lógica baseada em >= 70% de acertos). Expansões futuras de badges precisarão de tabelas próprias.

## 3. Mapa das entidades atuais

```text
Usuarios (1) ---- (1) Curriculos (1) ---- (N) Habilidades (ElementCollection)
    |
    +---- (N) Candidaturas (N) ---- (1) Vagas (1) ---- (N) Habilidades (ElementCollection)
    |
    +---- (N) Notificacoes
    |
    +---- (N) Resultados_Quiz (N) ---- (1) Quizzes (1) ---- (N) Perguntas (1) ---- (N) Alternativas
```

## 4. Decisões de arquitetura necessárias

### Decisão 1: Definição de Candidato no Admin
* **Problema:** Admin lista qualquer usuário com currículo como candidato.
* **Opções:** 
  1. Alterar enum `TipoUsuario`. 
  2. Filtrar a exibição no backend (mostrar apenas quem tem registros na tabela `candidaturas`).
* **Recomendação:** Opção 2. Mudar papéis de segurança é arriscado. Melhor alterar a query do admin para retornar apenas usuários com candidaturas ativas.

### Decisão 2: Armazenamento e Exibição de PDF
* **Problema:** Como converter/exportar o currículo para PDF.
* **Opções:** 1. Geração no frontend (ex: `html2pdf`). 2. Geração no backend (ex: `iText`, `JasperReports`).
* **Recomendação:** Geração no frontend. O currículo já é formatado via Chakra UI; gerar no frontend evita sobrecarga de servidor e criação de templates duplicados no Java.

### Decisão 3: Estrutura do Chat
* **Problema:** Contato entre candidato e RH.
* **Opções:** 1. WebSocket (Tempo Real). 2. Polling periódico. 3. Tabela de Mensagens com atualização manual ao carregar.
* **Recomendação:** Opção 3 (Atualização Manual/Simples). Para um TCC e versão inicial, WebSocket adiciona complexidade excessiva de infraestrutura e segurança.

## 5. Backlog priorizado

| ID | Funcionalidade | Tipo | Prioridade | Complexidade | Dependências | Risco | Fase |
| -- | -------------- | ---- | ---------- | ------------ | ------------ | ----- | ---- |
| TASK-01 | Prevenir UI de refazer quiz | Regra/UX | P0 | Pequena | - | Baixo | 1 |
| TASK-02 | Mostrar vagas da candidatura no admin | Nova Feature | P1 | Média | - | Baixo | 1 |
| TASK-03 | Listar no admin apenas quem se candidatou | Regra de negócio | P1 | Pequena | TASK-02 | Médio | 1 |
| TASK-04 | Mostrar candidaturas no dashboard do user | Nova Feature | P1 | Média | - | Baixo | 1 |
| TASK-05 | Corrigir drag and drop de imagem | UX | P2 | Pequena | - | Baixo | 2 |
| TASK-06 | Mostrar/ocultar senha no modal | UX | P2 | Pequena | - | Baixo | 2 |
| TASK-07 | Visão geral do currículo antes de salvar | Nova Feature | P2 | Média | - | Baixo | 3 |
| TASK-08 | Habilidades predefinidas e autocomplete | Nova Feature | P2 | Grande | - | Médio | 3 |
| TASK-09 | Página de perfil completo | Nova Feature | P2 | Média | - | Baixo | 3 |
| TASK-10 | Gerar e baixar currículo em PDF | Nova Feature | P3 | Média | TASK-09 | Baixo | 4 |
| TASK-11 | Chat entre admin e candidato | Nova Feature | P3 | Grande | - | Alto | 5 |
| TASK-12 | Moderação de campos / palavrões | Segurança | P3 | Média | - | Baixo | 6 |
| TASK-13 | Integração IA (Sugestão de texto) | IA | Futuro | Grande | - | Alto | 7 |

## 6. Roadmap por fases

* **Fase 1 (Integridade e Regras Core):** Bloquear a interface de quizzes já concluídos, garantir que o admin só veja candidatos reais, e mostrar as vagas ligadas a eles.
* **Fase 2 (UX e Ajustes):** Arrumar drag/drop da imagem de perfil e botão de revelar senha.
* **Fase 3 (Evolução do Currículo):** Nova etapa de revisão no Wizard, autocomplete de habilidades (pills) e tela de visualização do perfil consolidado.
* **Fase 4 (Documentos):** Implementar geração de PDF no frontend usando os dados do perfil consolidado.
* **Fase 5 (Comunicação):** Criar a estrutura inicial de chat associada às candidaturas.
* **Fase 6 e 7 (Moderação e IA):** Implementar bloqueios de palavras ofensivas no backend e integrações futuras com IA para melhorias textuais.

## 7. Especificação de cada tarefa

### TASK-01 — Prevenir UI de refazer quiz
**Problema:** O backend já bloqueia quizzes duplicados (retorna erro 400), mas a interface (frontend) permite que o usuário inicie o teste de qualquer forma.
**Comportamento esperado:** A listagem de quizzes (`Quizzes.jsx`) e a tela inicial (`QuizTest.jsx`) devem verificar se o usuário já tem resultado. Caso sim, desabilitar o botão e mostrar "Já realizado".
**Prioridade:** P0
**Frontend afetado:** `src/pages/Quizzes.jsx`, `src/pages/QuizTest.jsx`
**Backend afetado:** Criar endpoint para o frontend consultar o status dos quizzes realizados, ou alterar listagem para incluir a informação booleana.
**Possíveis arquivos afetados:** `QuizController.java`, `Quizzes.jsx`, `QuizTest.jsx`
**Testes:** Verificar se o botão de iniciar o quiz desaparece. Verificar se acessar a rota `/quizzes/id` de um quiz concluído redireciona ou mostra tela de resultado.

### TASK-02 — Mostrar vagas da candidatura no admin
**Problema:** O administrador visualiza o candidato, mas não as vagas nas quais ele se inscreveu.
**Comportamento esperado:** O endpoint que lista candidatos deve incluir um array com os títulos das vagas (ou objetos simplificados) usando a tabela `candidaturas`. O frontend deve exibir essas vagas em formato de tags/pills na lista do admin.
**Prioridade:** P1
**Frontend afetado:** `src/pages/AdminPage.jsx`
**Backend afetado:** `CandidatoController.java`
**Alterações de API:** Modificar `/api/admin/candidatos` para realizar o `JOIN` e popular um campo `candidaturas`.

### TASK-03 — Listar no admin apenas quem se candidatou
**Problema:** Atualmente a plataforma lista qualquer usuário que tenha currículo como "Candidato".
**Comportamento esperado:** O backend deve filtrar a lista retornada por `/api/admin/candidatos` garantindo que o usuário possua ao menos um registro na tabela `candidaturas`.
**Prioridade:** P1
**Possíveis arquivos afetados:** `CurriculoRepository.java`, `CandidatoController.java`

### TASK-04 — Mostrar candidaturas no dashboard do user
**Problema:** O endpoint `/api/vagas/minhas-candidaturas` existe, mas não é exibido no frontend.
**Comportamento esperado:** A tela de perfil ou dashboard (`Home.jsx` logada) deve consumir este endpoint e listar os cards de vagas em que o usuário está inscrito.
**Prioridade:** P1
**Frontend afetado:** `src/pages/Home.jsx` (ou criar nova aba/componente).

### TASK-05 — Corrigir drag and drop de imagem
**Problema:** A div atual não responde ao drop nativo.
**Comportamento esperado:** Usar o `onDragOver` e `onDrop` do React/Chakra UI em `StepBasicInfo.jsx` para aceitar a imagem, prevenir o comportamento padrão do navegador, e acionar o reader.
**Prioridade:** P2
**Frontend afetado:** `src/components/wizard/StepBasicInfo.jsx`

### TASK-06 — Mostrar/ocultar senha no modal
**Problema:** Campo de senha sem toggle.
**Comportamento esperado:** Usar `InputRightElement` do Chakra UI com um ícone de olho que altera o estado do input entre `password` e `text`.
**Prioridade:** P2
**Frontend afetado:** `src/components/AuthModal.jsx`

*(As demais tasks seguem a mesma lógica e poderão ser detalhadas futuramente durante suas execuções)*

## 8. Plano de banco de dados
Não são necessárias migrações imediatas para a Fase 1 e 2, pois a estrutura de `candidaturas` (V7) já atende aos requisitos iniciais.
No futuro, para a **Fase 5 (Chat)**, será necessário criar:
* `V9__add_chat.sql`: `CREATE TABLE chats (id, candidatura_id)` e `CREATE TABLE mensagens (id, chat_id, remetente_id, texto, data)`.
Para a **Fase 6 (Moderação)**:
* `V10__add_filtros.sql`: Tabela para armazenar lista de palavras censuradas.

## 9. Plano de APIs
* **Endpoint Alterado:** `GET /api/admin/candidatos` -> Passará a retornar `{ ..., candidaturas: [{vagaId, titulo, status}] }` e listará apenas quem tem candidatura.
* **Endpoint Novo (Futuro):** `GET /api/chat/{candidaturaId}` e `POST /api/chat/{candidaturaId}/enviar`.
* **Endpoint Novo:** `GET /api/quizzes/meus-status` para retornar IDs de quizzes já respondidos, ou alterar `GET /api/quizzes` para injetar `isRespondido: boolean`.

## 10. Plano de frontend
* **Páginas Alteradas:** `AdminPage.jsx` (adicionar exibição das vagas), `Quizzes.jsx` e `QuizTest.jsx` (adicionar travas de estado).
* **Componentes Novos:** `DashboardCandidato.jsx` (consumindo `/api/vagas/minhas-candidaturas`).
* **Estado:** Será necessário gerenciar se a view atual é de arrastar (drag) no drag and drop do avatar.

## 11. Plano de testes
* **Fase 1:**
  * Teste Manual: Tentar acessar a URL de um quiz já feito `/quizzes/{id}` de forma forçada.
  * Teste Manual: Criar uma conta, preencher currículo e não se candidatar a vagas; verificar se o Admin a enxerga (não deve enxergar).
  * Teste Manual: Fazer candidatura em duas vagas diferentes e verificar se ambas aparecem no painel do Admin e do Candidato.

## 12. Segurança e privacidade
* **Tokens JWT** continuarão em cookie `HttpOnly`.
* **Uploads de Imagem** permanecerão limitados a 1MB base64. 
* **Conteúdo Obsceno (Futuro):** Qualquer input de texto livre (`experiencia`, `cargo`, mensagens do chat) deverá passar por uma validação utilitária no backend (`CensorshipUtil`) antes do `.save()`.

## 13. Melhorias rápidas
1. TASK-06: Adicionar botão de visualizar senha (simples mudança de UI).
2. TASK-05: Suporte a drop zone nativa.
3. Tratamento visual de mensagens de erro no Toast para serem mais claras.

## 14. Funcionalidades futuras
* Chat em tempo real e notificações via WebSocket.
* Extração de texto de PDF (Parsing) via inteligência artificial ao fazer upload de currículo pronto.
* Motor de correspondência candidato-vaga (Score de afinidade).

## 15. Sequência de comandos futuros
1. "Implemente a TASK-01 seguindo o plano (Prevenir UI de refazer quiz)."
2. "Implemente a TASK-02 e a TASK-03 (Listagem de candidatos no admin)."
3. "Implemente a TASK-04 (Dashboard do usuário com candidaturas)."
4. "Implemente a TASK-05 e TASK-06 (Melhorias rápidas)."
5. "Crie a migration e a estrutura de backend para o Chat."
