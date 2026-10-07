# Home V2 — polish cirúrgico

07/10/2026, branch `design/home-v2-polish`. Comparação com `design/home-v2`, sem checkout, commit ou push. A base aprovada mantém headline, copy, ordem das seções, grids principais, mockups e ações.

## Ajustes

- **Hero:** segunda moldura discreta com pseudo-elemento e deslocamento responsivo de 4/6px no mobile e 8px no desktop. Cabeçalho com superfície distinta e borda rosa no cartão sobreposto existente. Sem novos dados ou funcionalidades. Asterisco reposicionado para não ser encoberto pela nova moldura.
- **Light:** opacidade das formas azul/rosa passou de 14%/12% para 18%/16%. As opacidades dark e o fundo geral do hero foram mantidos.
- **Como funciona:** números acompanhados por uma linha curta, conectores circulares entre cards e três segmentos decorativos que reforçam 01 → 02 → 03. Segmentos alinhados na base dos cards. São ilustração das etapas, não progresso de uma conta.
- **Além das vagas:** currículo e competências recebem tingimentos sutis azul/rosa e pequenos detalhes gráficos abstratos. Os demais recursos permanecem neutros. Mesmas quatro posições e proporções; no mobile, ícone e título passam a dividir a linha para diminuir altura.
- **Perfil:** contorno do avatar e destaque de superfície na linha de selos. O contêiner externo usa o fundo da página no dark, reduzindo seu peso; composição preservada.
- **CTA:** forma rosa menor no mobile para não se fundir visualmente ao botão. Padding mobile reduzido. Estrutura, copy, variantes, foco e hover D2 preservados.
- **Mobile:** padding de seções 48 → 32px, ajustes locais nos cards e nos mockups, menos espaço entre blocos. Nenhum texto ou recurso removido. CTAs principais mantêm 48px; CTA intermediário mantém seus 40px originais.

## Comparação objetiva com a versão congelada

Medições do documento em estado normal, antes de capturas integrais (scrollbar nativa de 15px):

| Viewport | Tema | Altura antes | Altura depois | clientWidth / scrollWidth depois |
| --- | --- | ---: | ---: | --- |
| 1440 | light | 2595px | 2595px | 1425 / 1425 |
| 1440 | dark | 2595px | 2595px | 1425 / 1425 |
| 768 | light | 3158px | 3152px | 753 / 753 |
| 768 | dark | 3158px | 3152px | 753 / 753 |
| 390 | light | 4524px | 3923px | 375 / 375 |
| 390 | dark | 4524px | 3923px | 375 / 375 |

Mobile: **601px / 13,3% menos altura**. Desktop permanece com a mesma altura total. Tablet praticamente inalterado. O ganho vem de layout/espaçamento, não de conteúdo eliminado.

## Browser validation

Home observada antes de editar em desktop/mobile light/dark, via Browser Tools em `http://localhost:5173`. Foram capturados antes/depois em 1440/768/390, nos dois temas.

- Sem overflow horizontal nas seis combinações.
- Inspeção visual dos mockups, cores, cards, alinhamento e CTAs.
- Nenhum heading/parágrafo com overflow horizontal nas verificações DOM mobile, tablet e desktop.
- Etapas com mesmo topo e altura em tablet e desktop; indicadores inferiores alinhados.
- Um `h1` e um `main`, mantidos.
- Console da Home sem erros/warnings na consulta final.
- Contraste de texto permanece baseado nos tokens D2; novos detalhes de baixo contraste são decorativos e aria-hidden. Não foi feita certificação WCAG completa.
- Ações e conteúdo funcional não foram alterados. Não foram refeitos testes de login/API nesta fase visual.
- Nenhuma animação adicionada. Foco, hover e regra global de reduced motion preservados.

Evidências reais em `home-v2-polish-evidence/`: `before-{tema}-{largura}.jpg`, `after-{tema}-{largura}.jpg`, detalhe do CTA e medições JSON. Capturas integrais do navegador podem temporariamente ocultar a scrollbar ou apresentar artefatos de composição da Navbar fixa; a geometria da tabela foi medida fora desse estado transitório. O CTA foi conferido também no viewport normal. Nenhuma imagem foi retocada ou simulada.

## Avaliação crítica

**O que melhorou:** sequência das etapas mais explícita, contraste entre os papéis dos benefícios, profundidade do mockup e menor rolagem mobile. A referência original orientou apenas a dosagem dos acentos; não determinou nova estrutura.

**Ficou mais carregado?** Há um pouco mais de detalhe no hero e nas etapas, mas sem novas caixas de conteúdo ou seções. A compactação mobile aumenta levemente a densidade e continua deixando espaço entre cards.

**Mudanças discutíveis:** os pequenos traços/círculos nos dois benefícios centrais são ornamentais, e a segunda moldura pode parecer uma pilha de painéis para algumas pessoas. São os pontos mais subjetivos da proposta.

**Recomendação de reversão:** não recomendo reverter nenhum ajuste antes da revisão. Caso se prefira ainda mais discrição, retiraria primeiro os pequenos traços/círculos dos benefícios, mantendo seus fundos sutis e a compactação mobile. Não ampliaria mais a decoração.

## Escopo e qualidade

Somente `src/components/home/PublicHome.jsx` foi alterado no código. `Home.jsx`, backend, auth/F1, theme, Navbar, Footer e demais páginas ficaram intactos. Nenhuma dependência adicionada. A segunda moldura usa um único pseudo-elemento; não foram criados vários cartões posicionados absolutamente.

- `npm run lint`: PASS.
- `npm run build`: PASS; 1215 módulos. Aviso preexistente de chunk acima de 500 kB permanece.
- `git diff --check`: PASS, com aviso local LF/CRLF.

## Git

`git diff --stat` (não inclui novos arquivos ainda não rastreados):

```text
 src/components/home/PublicHome.jsx | 76 +++++++++++++++++++++++---------------
 1 file changed, 46 insertions(+), 30 deletions(-)
```

`git status --short`:

```text
 M src/components/home/PublicHome.jsx
?? docs/HOME_V2_POLISH.md
?? docs/home-v2-polish-evidence/
```

Sem commit ou push. Aguardando revisão humana.
