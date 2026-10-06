# D2 — Sistema visual global e layout base

Implementado em 06/10/2026, na branch `design/ui-redesign`. Sem commit, push ou troca de branch. Aguardando revisão humana.

## 1. Diagnóstico anterior

O theme tinha seis cores de marca/superfície, sem papéis semânticos para texto, bordas e interação. Botões `gradient` combinavam gradiente, sombra e deslocamento no hover; `solid` substituía indiscriminadamente os esquemas do Chakra. Inputs tinham radius de 12px e sombra interna. Navbar usava fundo azulado translúcido, blur e cores duplicadas. Footer tinha uma marca com cursor de link, mas sem navegação.

A auditoria de código encontrou cores `gray`, `whiteAlpha`, valores hexadecimais, radii `full`/`2xl`, glows e movimentos definidos diretamente nas páginas. Não foram sobrescritos por seletores globais. O Container existente já resolvia o contêiner de página; não foi criada uma abstração equivalente.

## 2. Arquivos alterados

- `src/theme.js`: tokens, contratos tipográficos, variantes e estados globais.
- `src/components/Navbar.jsx`: composição global, tokens, contexto da conta e responsividade.
- `src/components/Footer.jsx`: rodapé compacto, links reais e tokens.
- `src/App.jsx`: landmark `main` e `minW={0}` no conteúdo flexível.
- `docs/D2_SISTEMA_VISUAL.md`: este relatório e guardrails.
- `docs/d2-evidence/`: quatro capturas do navegador.

Nenhum arquivo de página, backend, autorização ou AuthModal foi editado. React, Chakra e React Icons foram preservados; nenhuma dependência adicionada.

## 3. Tokens definidos

| Papel | Light | Dark |
| --- | --- | --- |
| page | #F7F8FA | #121316 |
| subtle | #EEF0F4 | #17191D |
| surface | #FFFFFF | #1B1D22 |
| surfaceSubtle | #F1F3F6 | #20232A |
| elevated | #FFFFFF | #262A32 |
| border | #DDE1E7 | #303540 |
| borderStrong | #8993A2 | #687384 |
| textPrimary | #1C2430 | #F1F3F6 |
| textSecondary | #4D596B | #BAC2CE |
| textMuted | #626E7F | #98A3B3 |
| brandPink | #D5187B | #D5187B |
| brandBlue | #3B82F6 | #3B82F6 |
| success | #187143 | #70D6A0 |
| warning | #875500 | #EBC16B |
| danger | #B42336 | #FF8C99 |
| info / focus | #245EC7 | #85B4FF |
| hover | #EAEFF5 | #2B3039 |
| active | #DEE6F0 | #353D49 |

Os nomes `brand.*` anteriores continuam compatíveis. Rosa e azul originais não foram modificados. Tons de hover/active da ação primária apenas escurecem o rosa. Cores de informação e foco usam tons específicos por tema para contraste.

Cálculo sRGB dos textos semânticos sobre page/surface/elevated: contraste mínimo light de 14,70:1, 6,68:1 e 4,87:1; dark de 12,94:1, 8,01:1 e 5,63:1, respectivamente. Branco sobre o botão rosa: 4,95:1. Isso não certifica os valores hardcoded das páginas existentes.

## 4. Tipografia final

Stack preservada: Inter, sistema Apple, BlinkMacSystemFont, Segoe UI, sans-serif. O projeto não carrega um arquivo de Inter; a fonte efetiva depende das fontes instaladas/fallback. Nenhum download de fonte foi introduzido.

Contratos disponíveis via `textStyle`:

| Estilo | Tamanho mobile / desktop | Entrelinha | Peso | Tracking |
| --- | --- | --- | --- | --- |
| display | 40 / 56px | 1.1 | 700 | -0.03em |
| h1 | 28 / 36px | 1.2 | 700 | -0.025em |
| h2 | 24 / 28px | 1.25 | 700 | -0.02em |
| h3 | 20px | 1.35 | 600 | -0.01em |
| h4 | 18px | 1.4 | 600 | normal |
| body | 16px | 1.6 | 400 | normal |
| small | 14px | 1.5 | 400 | normal |
| label | 14px | 1.4 | 600 | normal |
| metadata | 12px | 1.5 | 500 | normal |

A escala é um contrato para adoção nas próximas fases. Os `size`/`fontSize` explícitos das páginas não foram remapeados. `textStyle` não substitui a escolha semântica de `as="h1"` etc.

## 5. Spacing e layout final

Escala nativa Chakra de 4px preservada: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. Container global: 80rem/1280px; gutters 16px mobile, 24px tablet, 32px desktop. Limites explícitos existentes de 6xl/7xl continuam respeitados. `sizes.reading`: 48rem, opt-in.

`layerStyle="section"`: padding vertical 32/48/64px; `layerStyle="surface"`: padding 16/24px. Não foi aplicado padding duplicado às seções existentes. Formulários: intervalo recomendado de 16px entre campos, label 8px acima do controle. Navbar: altura mínima 64px. Footer: padding vertical 24px.

## 6. Botões

- `primary`: rosa sólido, branco, hover/active mais escuros.
- `secondary`: superfície neutra e borda forte.
- `outline`: alternativa transparente.
- `ghost`: ação discreta, herda a cor do contexto.
- `danger`: vermelho sólido com texto branco.
- `pill`: filtro compacto, radius full e estado selecionado/pressionado.
- `gradient`: alias de compatibilidade de `primary`; não gera gradiente.
- `solid`: neutro para esquema gray, mantém comportamento Chakra para os demais `colorScheme`, inclusive ações destrutivas.

Alturas sm/md/lg: 36/40/48px. Radius 8px; foco com contorno de 2px; disabled com opacidade 0,55. Sem sombra ou deslocamento no botão principal. Props explícitas das páginas ainda podem prevalecer.

## 7. Inputs e formulários

Input, Textarea e Select compartilham superfície, texto, borda forte, radius 8px, placeholder legível e estados focus/invalid/disabled. Alturas nativas Chakra preservadas para compatibilidade com InputGroup e ícones. Checkbox e Radio têm marcação rosa, foco visível e bordas consistentes; não houve alteração de handlers nem da semântica acessível do radio F1. FormLabel 14px/600 e erro semântico danger.

AuthModal mantém sua composição escura em ambos os temas. A regra F1 de autofill opaco #18181B com texto branco foi preservada literalmente. Há uma proteção de foco azul e placeholder legível para esse contexto escuro. Não houve alteração de senha, criação de conta ou mudança de fluxo.

## 8. Cards e superfícies

Card padrão `outline`: superfície neutra, borda discreta, radius 10px e nenhuma sombra. `elevated`: reservado a hierarquia que exija elevação. Modais/popovers: radius 12px; sombras funcionais mantidas. `Box` estilizados nas páginas não foram convertidos em Card.

## 9. Tags, badges e pills

Tag padrão `category`: neutra, borda discreta, radius 4px e peso 500. Badge conserva esquemas de estado Chakra, com texto sem uppercase automático e radius 4px. Pill é variante explícita de Button para filtro/controle; `aria-pressed` ou semântica apropriada deve ser fornecida pelo consumidor. Avatares e contadores continuam circulares quando faz sentido.

## 10. Navbar

Superfície sólida, sem blur/glow/sombra, Container compartilhado, linha ativa rosa e foco azul. Logo virou link real e acessível. Navegação pública preservada. Links desktop a partir de lg/992px; abaixo disso, menu compacto. Nome da marca aparece a partir de sm/480px; logo permanece visível no mobile.

Menu da conta identifica nome e papel. Candidato mantém Perfil/Currículo. Admin tem atalho visível ao painel e identificação Administração, sem modo “Visualizar como candidato” nem autorização nova. Notificações, upload de avatar, logout e polling existentes foram mantidos. Dropdowns alinhados ao final e limitados pela viewport.

## 11. Footer

Compacto, fundo subtle, borda superior, logo com link ao início e links reais Sobre/Vagas/Quizzes. Copyright preservado. Empilha no mobile e alinha em linha a partir de md. Sem links falsos de Termos/Privacidade.

## 12–13. Dark e Light

Dark inicial mantido, carvão #121316, superfícies diferenciadas e texto claro. Light usa fundo frio claro, superfície branca e separação suave. A alternância existente continua persistida pelo Chakra. A marca não muda entre os temas. AuthModal é a exceção escura intencional, preservada para evitar regressão F1.

## 14. Responsividade e motion

Verificados 1440, 768 e 390px. Nenhum overflow horizontal detectado nas combinações listadas abaixo. Não foi usado `overflow-x: hidden` para mascarar problemas. Navbar e Footer compartilham gutters do Container. Botões: transições de cor/borda de 180ms. `prefers-reduced-motion` reduz animações/transições globalmente. Não foi construída infraestrutura nova de motion.

## 15. Reservado a D3–D9

Redesign interno de Home, Sobre, Vagas, Perfil, Currículo, Quizzes, Ranking e Admin; redução dos cards/glows/gradientes locais; migração dos headings para a escala semântica; revisão de densidade operacional; modo de visualização como candidato em D7; responsividade completa em D8; revisão visual final das próximas fases. Nenhuma seção foi reordenada, removida ou reescrita.

## 16. Validação no navegador

Aplicação real em localhost:5173, com backend local existente. O Vite estava parado e foi iniciado; nenhum arquivo de backend foi alterado.

| Verificação | Resultado |
| --- | --- |
| Visitante: Home, Sobre, Vagas, Quizzes × dark/light × 1440/768/390 | 24 combinações com heading renderizado e sem overflow horizontal |
| Candidato: login, Home e menu × ambos temas × três larguras | Menu dentro da viewport; Perfil/Currículo disponíveis |
| Candidato: Perfil e primeira etapa do Currículo | Renderização e campos inspecionados; nada salvo |
| Admin: login, painel e menu × ambos temas × três larguras | Contexto Administração; sem Perfil/Currículo no menu |
| Admin: Quizzes | Ações “Indisponível para Admin” desabilitadas |
| Admin: Vagas / modal de detalhes | “Candidaturas indisponíveis” desabilitado |
| Admin: acesso direto a /criar-perfil | Redirecionado para /admin, painel renderizado |
| Navegação compacta e notificações | Menus/popover inspecionados no mobile |
| AuthModal light desktop e dark mobile | Fundo escuro e texto legível; foco por teclado azul de 2px confirmado por estilo computado |
| Novo carregamento final da Home | Console sem erros ou warnings |

A matriz automática de geometria não equivale a uma auditoria visual pixel a pixel de todas as páginas. Capturas foram inspecionadas nos estados representativos de desktop, tablet e mobile. Erros transitórios de HMR durante uma edição incompleta foram corrigidos; o carregamento final foi verificado em aba nova.

Não foram criados currículos, candidaturas, quizzes, contas ou arquivos de avatar. Contas de teste foram desconectadas ao final. Viewport restaurada e tema dark retomado.

Evidências: `d2-evidence/home-desktop-dark.jpg`, `home-desktop-light.jpg`, `admin-mobile-light.jpg`, `auth-mobile-focus.jpg`.

## 17–18. Quality gates

- `npm run lint`: PASS, exit 0.
- `npm run build`: PASS, exit 0, 1213 módulos; bundle JS 1.862,82 kB / gzip 556,07 kB.
- Aviso do Vite: chunk acima de 500 kB. Otimização de bundle não foi incluída no escopo visual.
- `git diff --check`: PASS (avisos locais LF/CRLF, sem erros de whitespace).
- Não existe script de testes frontend adicional no package.json.

## 19. Riscos e pendências

- Autofill nativo real do gerenciador de senhas não foi acionado; regra F1 preservada e foco/digitação inspecionados. Revalidar autofill real na revisão humana.
- Estilos explícitos das páginas ainda têm precedência sobre o theme. Portanto, a remoção de gradientes, sombras, pills e radii excessivos não é total nesta fase.
- A escala tipográfica e layerStyle de seção são contratos disponíveis, com migração das páginas adiada deliberadamente.
- A validação F1 nesta entrega é visual/frontend com backend real; não reexecuta a suíte de segurança do backend.
- Estados de upload, envio de formulário e realização de quiz não foram exercitados para evitar mutações de dados.
- O aviso de tamanho do bundle permanece.

## GUARDRAILS VISUAIS RESULTANTES

### PODE

- Usar tokens semânticos para fundo, superfície, texto, borda, foco e estados.
- Usar rosa e azul como ação, seleção, identidade e destaque pontual.
- Usar `primary`, `secondary`, `ghost` e `danger` conforme a função da ação.
- Usar tipografia, alinhamento e espaçamento para estabelecer hierarquia.
- Usar display em momentos editoriais; h1/h2 menores em interfaces internas.
- Usar Container existente, gutters 16/24/32px e escala de 4px.
- Usar Card quando houver agrupamento semântico; sombras em superfícies elevadas.
- Usar Tag para categoria, Badge para estado e Pill para filtro/controle.
- Usar gradiente excepcional de marca quando a composição justificar.
- Usar feedback de 150–220ms e respeitar movimento reduzido.

### NÃO PODE

- Voltar a usar `gradient` como especificação para novos botões; é apenas alias legado.
- Criar uma nova paleta hardcoded por página ou alterar as cores originais da marca por preferência.
- Usar glow, sombra e deslocamento de hover como padrão de cards/botões.
- Usar pill/radius full em qualquer botão, ou display gigante em toda tela.
- Transformar todo bloco em card ou ícone em quadrado decorativo.
- Aplicar uppercase/tracking amplo indiscriminadamente.
- Sobrescrever layouts de página por CSS global para aparentar migração concluída.
- Duplicar Container com abstrações sem uso real.
- Misturar dados/ações de candidato com Admin; alterar F1 ou autofill sem validação específica.
- Criar links inexistentes, novas regras de autorização ou fluxo de candidato para Admin neste D2.
- Introduzir biblioteca de UI, refatorar backend ou redesenhar páginas fora da fase correspondente.

## 20. git diff --stat

A saída abaixo cobre arquivos rastreados; relatório e capturas novos aparecem no status como untracked.

```text
 src/App.jsx               |   2 +-
 src/components/Footer.jsx |  39 ++++-----
 src/components/Navbar.jsx |  93 ++++++++++----------
 src/theme.js              | 213 ++++++++++++++++++++++------------------------
 4 files changed, 165 insertions(+), 182 deletions(-)
```

## 21. git status --short

```text
 M src/App.jsx
 M src/components/Footer.jsx
 M src/components/Navbar.jsx
 M src/theme.js
?? docs/D2_SISTEMA_VISUAL.md
?? docs/d2-evidence/
```
