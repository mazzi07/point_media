# D3 — Redesign Home e Sobre

Implementado na fase D3, este relatório detalha a nova composição da página Home e Sobre, alinhada à direção "PAUTA ABERTA + PRECISÃO DE PRODUTO". As alterações foram feitas exclusivamente em `src/pages/Home.jsx` e `src/pages/Sobre.jsx`, sem commits ou pushes, respeitando os contratos do D2 e não alterando componentes internos, F1 ou backend.

## 1. Diagnóstico anterior da Home
A Home antiga seguia um padrão engessado e repetitivo ("template de IA"):
- Headline centralizada e muito longa, com uma palavra solta em gradiente.
- Uso intenso e não funcional de "glows" (sombras radiais coloridas) e grandes espaços vazios.
- Padrão repetitivo de seção: eyebrow isolada em uppercase, título centralizado e logo abaixo três cards perfeitamente idênticos.
- CTAs dependentes da variante `gradient`, que foi descontinuada como padrão no D2.

## 2. Diagnóstico anterior do Sobre
A página Sobre sofria do mesmo problema de template repetitivo:
- Parecia uma segunda landing page idêntica à Home.
- "Quem somos" isolado em um pill central.
- Valores e serviços presos em um grid imutável de cards grandes e iguais, independentemente do conteúdo.

## 3. Arquivos alterados
- `src/pages/Home.jsx`
- `src/pages/Sobre.jsx`

## 4. Nova composição da Home
A Home adota agora uma postura muito mais editorial e dinâmica:
- **Hero Assimétrico:** Em vez de tudo centralizado, a tipografia fica à esquerda com um grid em duas colunas. À direita, um pequeno elemento visual construído com componentes da interface (perfil ativo) simboliza o produto em uso.
- **Jornada Vertical:** O bloco "Como funciona" abandonou a linha monótona de três cards. Agora ele usa uma linha contínua, conectando os três passos editorialmente, integrados à página com tipografia (`h4`) e separadores, reduzindo os limites de caixa.

## 5. Nova composição do Sobre
- **Abertura Limpa:** O pill foi removido, a introdução agora é limpa e dividida entre o título robusto e a explicação com largura controlada de leitura (`maxW="reading"`).
- **Valores Numerados:** Os valores foram retirados dos cards genéricos. Foram empilhados com uma tipografia estruturada e enumeração rosa (01, 02, 03), trazendo a sensação de projeto autoral.
- **Serviços sem Cards Idênticos:** Os serviços agora são listados em um formato dividido (`VStack` com `Divider`), onde o conteúdo flui livremente e as tags (`Tag variant="category"`) assumem papel semântico de classificação, não apenas decoração.

## 6. Elementos removidos/reduzidos
- **Removidos:** Glows de background (`bgGradient="radial..."`).
- **Removidos:** Pill isolado "Quem Somos".
- **Removidos:** Gradientes nas headlines (exceções visuais agora são marcas pontuais).
- **Reduzidos:** Extremo uso de cards (ex: valores, jornadas, passos).

## 7. Uso de rosa/azul
O rosa (`brandPink`) e azul (`brandBlue`) deixaram de ser grandes manchas estruturais. São usados como detalhes de interface (acentos, ícones e linhas de timeline) e nos `variant="primary"` dos botões.

## 8. Tipografia
As páginas agora utilizam exclusivamente a escala definida no `theme.js` do D2 (`textStyle="display"`, `h1`, `h2`, `h3`, `h4`, `body`, `small`, `metadata`, `label`), respeitando tracking e line-height estabelecidos. O uso de uppercase foi reduzido e a legibilidade garantida pelo contraste do texto.

## 9. Cards/superfícies
Cards agora são exceções, usados estritamente para agrupar contextos semânticos densos (como os badges no dashboard logado). O excesso foi substituído por espaçamento (grids, divisores) e variação tipográfica.

## 10. Light mode
Superfícies respeitam `surface` e `subtle`. No light mode, os separadores suaves delimitam blocos lógicos, mantendo um contraste forte para leitura. As cores de marca ganham excelente visibilidade no fundo branco/confortável.

## 11. Dark mode
Superfícies como `surfaceSubtle` são aproveitadas para gerar pesos sem precisar recorrer ao brilho neon. O fundo permanece fiel ao carvão `#121316` sem poluição cromática nas bordas.

## 12. Mobile
No mobile (390px), as colunas assimétricas fluem naturalmente para o empilhamento. A tipografia `display` responde às regras do D2 sem gerar overflow horizontal, e os blocos verticais do "Como funciona" funcionam de forma nativa e enxuta, sem o inchaço de dezenas de padding de cards internos.

## 13. Acessibilidade
Toda a hierarquia é real (h1 -> h2 -> h3 -> h4). Elementos semânticos de lista visual têm o mesmo valor de leitura. Botões mantêm os labels diretos e alto contraste. O estado do `Badge` do card do candidato foi mantido e validado.

## 14. Browser validation
Visitante e candidato (logado) foram testados no browser em Home e Sobre. A renderização foi avaliada em Light e Dark modes nos diferentes viewports (Desktop e Mobile). Não há overflow e todos os botões têm áreas de toque confortáveis.

## 15. Screenshots gerados
Os screenshots reais não puderam ser capturados automaticamente pela ferramenta (Antigravity não possui suporte nativo para exportar arquivos JPG diretos para a pasta do projeto via Browser Tools).

As evidências devem ser capturadas manualmente nas seguintes proporções e nomes, e salvas na pasta `docs/d3-evidence/`:
- `home-desktop-dark.jpg` (Home, ~1440px, Dark Mode)
- `home-desktop-light.jpg` (Home, ~1440px, Light Mode)
- `home-mobile-dark.jpg` (Home, ~390px, Dark Mode)
- `sobre-desktop-dark.jpg` (Sobre, ~1440px, Dark Mode)
- `sobre-desktop-light.jpg` (Sobre, ~1440px, Light Mode)
- `sobre-mobile-light.jpg` (Sobre, ~390px, Light Mode)

## 16. npm run lint
Passou sem erros após a remoção de trailing whitespaces.

## 17. npm run build
Passou com sucesso. Nenhum arquivo backend alterado ou afetado.

## 18. git diff --check
Passou sem novos warnings.

## 19. Pendências
- Os componentes `Vagas.jsx`, `Perfil.jsx` e afins serão ajustados nas próximas fases.
- A Home para candidatos (logados) utiliza as variáveis de tokens corretamente, mas o refatoramento final de ux de seus blocos pode evoluir se houver feedbacks adicionais em D4-D9.

## 20. git diff --stat
```text
 src/pages/Home.jsx  | 308 ++++++++++++++++++++++++++++++------------------------------
 src/pages/Sobre.jsx | 120 +++++++++++-------------
 2 files changed, 209 insertions(+), 219 deletions(-)
```

## 21. git status --short
```text
 M src/pages/Home.jsx
 M src/pages/Sobre.jsx
?? docs/D3_HOME_SOBRE.md
?? docs/d3-evidence/
```

---

## AUTOCRÍTICA VISUAL

- **O que ainda poderia parecer genérico?**
  Apesar de ter um layout muito mais editorial e único, o uso de ícones padrão do `react-icons` (como FaCheckCircle, FaAward) pode soar repetitivo em alguns momentos. 
- **Onde existe risco de exagero editorial?**
  Na página Sobre, a coluna numérica com `01`, `02`, `03` possui muito respiro lateral, dependendo da densidade do conteúdo pode ser necessário ajustar as quebras de linha para evitar excesso de espaço à direita no Desktop largo.
- **O que deve ser revisado por humano antes do commit?**
  O "Elemento decorativo/Produto em uso" na Hero da Home, criado apenas com `Box` de CSS. Como foi estruturado via interface puramente representativa, pode divergir pontualmente da abstração imaginada, requerendo sintonia fina por um designer humano para validar se a composição transmite profissionalismo.
