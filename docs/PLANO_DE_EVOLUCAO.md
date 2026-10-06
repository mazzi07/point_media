# Plano de evolução — Point Media

Consolidação após FP1–FP5. Este documento distingue a base existente das decisões de produto e validações pendentes. Não autoriza novas funcionalidades durante o Final Polish.

## 1. Base atual

- Autenticação com JWT assinado/expirável, cookie HttpOnly/SameSite=Lax, BCrypt e autorização no servidor. Sessão ausente responde 401; falta de permissão responde 403.
- Currículo em quatro etapas (dados básicos, experiência, habilidades e revisão), perfil, avatar validado e URLs de perfil normalizadas.
- Exportação PDF com template próprio e tratamento de carregamento/falha.
- Vagas com busca/filtros, CRUD administrativo, candidaturas e consulta das inscrições do usuário.
- Lista privada do RH com candidatos que possuem **currículo e candidatura**, suas vagas e filtros; contagem sem duplicar candidatos.
- Quizzes com validação de pertencimento pergunta/alternativa, correção sem expor o gabarito, proteção contra envios duplicados e timeout no cliente.
- Ranking, resultados e badges derivados dos resultados; `totalPerguntas` preserva o denominador histórico e zero é tratado nos cálculos.
- Notificações administrativas, leitura pelo usuário e proteções contra respostas atrasadas.
- Cache com TanStack Query, invalidação entre telas, limpeza nas fronteiras de sessão, navegação mobile e estados de erro/vazio.
- Validação de entradas, transações e restrições UNIQUE. Flyway V1–V9, Hibernate `validate` e `open-in-view=false`.

Não voltam ao backlog como novidades: candidatura, filtro de candidatos reais no admin, bloqueio de quiz concluído, revisão do currículo, perfil, PDF, drag and drop do avatar e exibição de senha. As validações de execução abaixo ainda precisam ser realizadas.

## 2. Removidos durante o Final Polish

### F01 — Recuperação de senha

Foi retirada a ação “Esqueci minha senha”: não havia tela, handler, endpoint ou fluxo de token. Uma implementação futura precisa de solicitação de recuperação, token temporário de uso único com expiração, redefinição segura, entrega por email, controle de abuso/rate limit e resposta que não revele a existência da conta.

**Risco alto. Prioridade alta após o release e a base de segurança.**

### F02 — Preferência de emails de notícias/oportunidades

Foi retirado o checkbox que não era registrado, enviado nem persistido. Exige preferência persistida, adesão e opt-out, critérios de envio, integração de entrega e revisão de privacidade.

**Risco médio. Prioridade baixa até definir a comunicação do produto.**

### F03 — Vitrine pública de talentos

Foram retirados três cards fictícios fixos da Home que pareciam candidatos reais. Exige fonte real, regra de visibilidade pública, autorização/consentimento de exposição, endpoint com campos públicos mínimos, estados vazio/erro e critérios de seleção/ordenação.

A lista privada de candidatos do administrador já funciona e não é essa vitrine.

**Risco alto pela exposição de dados pessoais. Prioridade baixa até definir produto e privacidade.**

### F04 — Termos e privacidade

Foram retirados o aceite obrigatório fictício e os links inacessíveis: os documentos não estavam disponíveis e o aceite não era registrado. Publicar documentos reais e acessíveis, aprovados pelos responsáveis; decidir se é necessário armazenar aceite e sua versão e, se for, implementar o contrato frontend/backend correspondente.

**Revisão obrigatória antes da publicação pública.** Não inventar conteúdo jurídico.

### F05 — Contato

Foi retirado o link `href="#"`. Conectar a um destino real de contato/suporte quando definido. Não criar um subsistema de atendimento sem demanda de produto.

**Risco baixo. Implementar quando houver destino real.**

## 3. Bugs adiados, limitações e decisões pendentes

| Item | Situação e encaminhamento | Momento recomendado |
| --- | --- | --- |
| Sincronização entre abas | Uma aba pode manter contexto React após mudança de conta/sessão em outra. Avaliar evento `storage`, BroadcastChannel ou equivalente. | Após o polish, com cenário reproduzível de troca de conta |
| 401 atrasado de sessão anterior | Uma requisição antiga pode terminar após novo login e disparar expiração global. Desenhar identificação de sessão/requisição e teste de concorrência antes de alterar. | Seguimento de concorrência; não implementar sem reprodução e teste |
| Resposta perdida após envio de quiz | O commit pode ter ocorrido mesmo sem resposta de rede. UNIQUE impede duplicação, mas repetir pode confundir. Avaliar consulta do resultado/UX idempotente. | Antes de ampliar o uso dos quizzes |
| Currículo para candidatura | Hoje é possível candidatar-se sem currículo; visibilidade no admin exige currículo + candidatura. Decidir entre exigir currículo antes da inscrição ou aceitar e mostrar perfis incompletos claramente. É decisão de produto, não necessariamente bug. | Antes de evoluir o processo seletivo |
| Timer de quiz no servidor | O timer atual no cliente serve à orientação educacional; não é à prova de adulteração. Uma avaliação formal exigiria início e prazo de tentativa controlados pelo servidor. | Somente se prazo estrito virar requisito |
| Papéis e revogação de tokens | O filtro consulta o papel atual no banco. Se houver gestão de papéis/desativação de contas, definir quando as sessões JWT existentes deixam de valer. Não antecipar infraestrutura de revogação. | Junto da futura gestão de usuários |
| CSRF | CORS restrito, SameSite=Lax e HttpOnly permanecem; não há contrato completo de token CSRF. Não declarar o problema resolvido. Rever cliente e servidor juntos. | Antes de produção pública real |
| Validação MySQL | Integridade, migrações e rollback ainda carecem de execução em MySQL real durante o Final Polish. É validação de release, não evidência de novo bug. | Antes do release em banco descartável/controlado |

Nenhum desses itens foi implementado em FP5. O [checklist de release](../README.md#checklist-de-release) reúne as verificações anteriores à publicação.

## 4. Próxima evolução funcional

Ordem sugerida, sujeita às decisões da equipe e aos requisitos de publicação de F04.

### A. Gestão administrativa de quizzes

CRUD de quizzes, perguntas e alternativas, validações e estados de publicação/arquivamento. Antes, entender V9 e o snapshot dos resultados. Definir a regra de edição de quiz com histórico: **uma edição não pode mudar silenciosamente o significado de notas anteriores**. O denominador salvo não resolve sozinho mudanças de enunciado, gabarito ou identidade do quiz.

### B. Processo de vagas e candidaturas

Definir status/etapas de candidatura e arquivamento de vagas para preservar o histórico de recrutamento. Resolver a exigência de currículo descrita acima antes de mudar a listagem administrativa. Não implementar agora.

### C. Chat iniciado pelo RH/admin

RH/admin inicia a conversa; candidato responde apenas a conversas das quais participa. Prever conversas, mensagens e estado de não lido, com autorização por participante no backend. Polling é suficiente inicialmente; WebSocket não é requisito padrão. Notificações atuais não são linhas de chat e não devem ser reutilizadas como se fossem.

### D. Importação de currículo

Fluxo: upload → validação de tipo/tamanho → extração de campos → **revisão/correção pelo usuário** → gravação do currículo estruturado. Nunca sobrescrever o perfil automaticamente após extrair dados. Decidir também se o arquivo original será armazenado e sob quais regras de acesso/retenção.

### E. Suporte e contato

Atender F05 com um destino real; ampliar apenas diante de demanda. Manter atendimento separado do chat de recrutamento.

### F. Integrações externas

Escolher um provedor e caso de uso real antes de criar abstrações de integração. Não desenhar adaptadores, IA ou infraestrutura para cenários hipotéticos.

## 5. Evolução visual e de experiência

São oportunidades futuras, sem redesenho nesta etapa:

- Explicar melhor o cálculo do ranking e revisar estados com/sem badge se a equipe identificar dificuldade de entendimento.
- Medir carregamento mobile antes de otimizar; reduzir a imagem da marca apenas preservando qualidade visual.
- Considerar carregamento sob demanda do exportador PDF se o peso do bundle justificar.
- Revisar favicon, exemplos e afirmações de marketing.
- Testar o PDF de currículo com conteúdo muito longo, quebras de página e campos extensos.
- Fazer revisão de acessibilidade, incluindo teclado, foco, rótulos e contraste.

## 6. Evolução técnica proporcional

### Testes de maior valor após o polish

Automatizar cenários de autenticação/sessão, isolamento entre contas, cache/invalidação, unicidade de candidaturas/resultados e timeout/envio de quiz. Incluir concorrência e falhas de rede onde relevantes. Não criar testes de getters apenas para aumentar cobertura.

### Banco de dados antes do release

- Executar V1–V9 em banco MySQL vazio.
- Testar atualização representativa de uma base pré-V9, com preflight de duplicados.
- Verificar query de ranking, cascatas, UNIQUE e rollback de operações transacionais.
- Conferir o backfill de `total_perguntas`, inclusive quizzes sem perguntas. O tamanho atual é a aproximação disponível para resultados anteriores ao snapshot.
- Ensaiar recuperação de falha parcial de DDL em ambiente controlado; `repair` não reverte o schema.

### Performance somente com medição

Avaliar paginação, consultas em lote, projections e possível N+1 de candidatos quando latência/volume demonstrarem necessidade. Medir volume e custo de notificações e ranking antes de otimizar.

### Onboarding

Considerar Maven Wrapper apenas se instalar Maven se tornar um problema recorrente. A linha adotada para Node é 24 LTS; acompanhar suporte sem migrar frameworks por preferência.

## 7. Regras para novas alterações

- Manter React/Vite/Chakra/Emotion, React Router, TanStack Query, React Hook Form/Zod, html2pdf.js, Framer Motion e React Icons; Java/Spring Boot/Security/JJWT, JPA/Hibernate, Flyway/MySQL/Maven; Docker e Git/GitHub.
- Nenhuma dependência direta de runtime foi comprovada desnecessária. Remover import sem uso não autoriza desinstalar a biblioteca.
- Adicionar Service quando houver lógica de negócio realmente compartilhada ou transações entre controllers que o justifiquem.
- Usar DTOs pequenos e nomeados quando o contrato ficar complexo; não criar DTO/mapper para cada endpoint trivial.
- Organizar novos módulos na estrutura atual. Agrupar por domínio gradualmente apenas se a equipe tiver dificuldade real de localizar código.
- Cada alteração de banco recebe nova migração Flyway. Nunca editar migração aplicada para mudar o histórico.
- O histórico atual termina em **V9**. A próxima migração usa o próximo número de versão único livre quando for criada; não reservar várias futuras com o mesmo número. FP5 não cria migração.
- Manter estado de servidor no TanStack Query e consistência entre query keys e invalidação.
- Autorização no backend é obrigatória mesmo com guardas de navegação no frontend.
- Preservar limpeza de cache entre contas, guardas de identidade, flags de cleanup e refs contra corridas; locks/snapshot do timeout; UNIQUE, `saveAndFlush`, transações e snapshot histórico.
- Manter gabarito no servidor, validação pergunta/alternativa, BCrypt, assinatura/expiração JWT, cookies HttpOnly, `open-in-view=false`, Flyway + `validate`, EXISTS/COUNT DISTINCT e proteção contra denominador zero.
- Preservar HashMap em respostas que aceitam valores nulos, template PDF separado e validação de caminho antes de exclusão no build.
- Não introduzir Redux/Zustand, Axios por preferência, migração TypeScript, Lombok para esconder código, OAuth, Redis, microserviços, CQRS, outro ORM ou camadas genéricas sem necessidade concreta.

## 8. Pendências externas a consolidar

O TODO/backlog da equipe no **Notion ainda não foi fornecido**. Ele precisa ser cruzado com este plano técnico; nenhum conteúdo foi inventado ou incorporado em seu nome.
