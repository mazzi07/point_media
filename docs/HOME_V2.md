# Home V2 — reconstrução visual

Implementação em 07/10/2026 na branch `design/home-v2`. Sem commit, push ou troca de branch. Aguardando revisão humana.

## 1. O que foi descartado da Home D3

Removidos o hero predominantemente textual, a pequena representação de perfil escondida no mobile e a lista vertical editorial de etapas. Removida também a duplicação de `main`: esse landmark já pertence ao App. A Home pública foi substituída; o painel do candidato foi preservado, com ajuste semântico do nome para `h1`.

## 2. Estrutura nova

Navbar existente → hero dividido entre mensagem e produto → três passos → quatro benefícios → composição de perfil → CTA final → Footer existente. A imagem fornecida foi usada como direção de composição, cor e ritmo, sem reproduzir pessoas, marcas de terceiros, números ou depoimentos.

## 3. Hero

“Seu talento encontra oportunidades.”, com identificação explícita de banco de talentos e subtexto curto. Criar conta abre `openAuthModal('register')`; Ver vagas é um link real para `/vagas`. Login continua disponível na Navbar. Display de 36/52/60px, mantendo fonte e espaçamento D2.

## 4. Mockup visual

Composição estática em Chakra: moldura de plataforma, navegação decorativa, exemplo neutro de vaga, resumo de currículo e cartão sobreposto de competências. Usa o logo local existente. “Exemplo de vaga” e legendas identificam o conteúdo ilustrativo. Não há campos falsamente interativos, estatísticas, empresas ou promessas de recomendação automática.

## 5. Como funciona

Lista ordenada de três cards: crie seu perfil, encontre oportunidades, candidate-se. Números, cores alternadas, silhuetas de ícone distintas e pequenas setas conectam as etapas no desktop/tablet. Textos curtos e hierarquia h2/h3.

## 6. Benefícios

Quatro recursos existentes: vagas, currículo, quizzes/selos e consulta de inscrições. A copy não promete frequência de atualização, matching, comunicação de recrutadores ou acompanhamento de fases de seleção não comprovadas.

## 7. CTA final

Faixa azul profunda com botão rosa, arco e formas abstratas. Ação real de cadastro. O CTA intermediário “Começar meu perfil” também abre cadastro para visitante. Admin continua redirecionado para `/admin`; candidato continua recebendo seu painel e suas ações reais.

## 8. Uso de rosa e azul

Rosa marca oportunidades, ações e algumas competências; azul identifica ferramentas e estrutura do produto. Tokens D2 preservados. Um tom rosa local mais claro (`#F27AB8`) é usado somente no texto de destaque dark para legibilidade; transparências derivadas das cores da marca dão profundidade. `theme.js` não foi alterado.

## 9. Cards

Três cards de jornada, quatro de benefícios e superfícies de interface nos mockups. Bordas e raios D2; sombras restritas à composição de produto. Sem transformar cada texto em caixa.

## 10. Decoração

Formas orgânicas, círculos, asterisco, linhas e setas implementados em JSX/CSS. Sem imagens externas, dependências ou bibliotecas novas. O recorte ocorre apenas nas camadas decorativas e na faixa final, não no overflow global da página.

## 11. Dark

Carvão e superfícies semânticas distintas, fundos coloridos discretos e acentos de texto legíveis. Sem glow, loops ou estética neon. O CTA final permanece azul profundo.

## 12. Light

Superfícies claras, rosa/azul em transparências, bordas discretas e cor de marca nos pontos de atenção. Mesma hierarquia do dark, com contraste de texto adaptado pelos tokens.

## 13. Desktop, tablet e mobile

Hero em duas colunas a partir de lg; empilhado em 768 e 390. Mockup continua visível: somente sua barra lateral decorativa some no mobile. Etapas em três colunas a partir de md; benefícios em quatro/duas/uma coluna. Botões de 48px e largura confortável no mobile. Não há overflow horizontal na matriz medida.

## 14. Acessibilidade e movimento

Um h1 e um main na Home pública; seções nomeadas, headings h2/h3, lista ordenada, links e botões reais. Ilustrações têm legendas, logo repetido tem alt vazio e decoração tem aria-hidden. Foco D2 foi confirmado pelo teclado (contorno azul 2px, offset 3px). Nenhuma animação foi adicionada; proteção global prefers-reduced-motion mantida. Não foi realizada auditoria automatizada completa WCAG/leitor de tela.

## 15. Arquivos alterados

- `src/pages/Home.jsx`: delega a Home pública e ajusta h1 do candidato.
- `src/components/home/PublicHome.jsx`: layout e mockups exclusivos da Home.
- `docs/HOME_V2.md`: relatório.
- `docs/home-v2-evidence/`: seis screenshots reais do navegador.

Backend, Sobre, outras páginas, Navbar, Footer, AuthModal, theme, autenticação, autorização e lógica de dados não foram alterados. O diff do trecho autenticado preserva queries, handlers, estados e redirecionamento; a única alteração de markup nesse trecho é o h1.

## 16. Quality gates e browser validation

- `npm run lint`: PASS, exit 0.
- `npm run build`: PASS, exit 0; 1215 módulos; JS 1.867,85 kB / gzip 556,75 kB. Aviso de chunk acima de 500 kB permanece.
- `git diff --check`: PASS; pode emitir aviso de normalização LF/CRLF no Windows.
- Nenhum arquivo de backend no diff.

Navegador real em `http://127.0.0.1:5173`, Vite iniciado para revisão. Medição final:

| Visitante | clientWidth / scrollWidth | Resultado |
| --- | --- | --- |
| Light 1440 | 1425 / 1425 | Sem overflow |
| Dark 1440 | 1425 / 1425 | Sem overflow |
| Light 768 | 753 / 753 | Sem overflow |
| Dark 768 | 753 / 753 | Sem overflow |
| Light 390 | 375 / 375 | Sem overflow |
| Dark 390 | 375 / 375 | Sem overflow |

A diferença de 15px é a barra de rolagem. Screenshots JPEG reais estão em `home-v2-evidence/`, nomeados por tema/largura. Desktop mostra o primeiro viewport; mobile/tablet mostram a página completa. Capturas integrais do navegador podem conter artefatos de composição da Navbar fixa; não foram retocadas.

Criar conta, Começar meu perfil e Criar minha conta abriram o formulário de cadastro existente. Ver vagas navegou para `/vagas`. Nenhum cadastro ou candidatura foi enviado. Console da Home sem erros/warnings na consulta final. Viewport restaurado e tema dark retomado.

**Candidato desktop/mobile e admin autenticados: pendentes.** Não havia backend escutando na porta 8080 nem sessão autenticada disponível. A revisão estática confirma preservação do fluxo, mas não substitui teste de login/API. A navegação pública para Vagas foi verificada; carregamento de vagas reais não foi certificado com backend desligado.

## 17. Riscos e autocrítica visual

A composição recupera organização, cor e presença de produto da referência. O hero é mais informativo e a marca aparece em toda a jornada, sem prova social inventada. A solução é deliberadamente menos fotográfica que a referência: o mockup ocupa o papel visual da pessoa e do painel. Cards e copy têm densidade controlada; foram corrigidos títulos inicialmente grandes demais e um transbordamento de decoração no mobile.

A estrutura de cards ainda usa padrões conhecidos de landing pages. A personalidade vem da marca, da ilustração de produto e da composição; não se afirma equivalência estética exata à referência. A página mobile é mais longa por manter o mockup e todos os blocos. A preferência humana sobre densidade, tamanho do hero e força das cores continua importante. Aviso de bundle é preexistente; otimização está fora desta entrega.

## 18. Revisão humana pendente

Aprovar direção visual, ritmo e copy. Validar candidato em desktop/mobile e redirecionamento admin com backend e contas de teste. Revalidar teclado/leitor de tela e contraste completo se houver exigência de certificação. A Home está disponível no navegador para revisão; não houve commit nem push.

## Estado Git da entrega

`git diff --stat` (arquivos já rastreados; novos arquivos aparecem no status):

```text
 src/pages/Home.jsx | 90 +++---------------------------------------------------
 1 file changed, 4 insertions(+), 86 deletions(-)
```

`git status --short`:

```text
 M src/pages/Home.jsx
?? docs/HOME_V2.md
?? docs/home-v2-evidence/
?? src/components/home/
```
