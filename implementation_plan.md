# Organização Geral do Projeto Point Media

Limpeza completa do código: remover duplicidades, código morto, comentários de IA, e resetar o histórico git.

## Proposta de Alterações

### 1. Remover Arquivos Desnecessários

- **`test-login.json`** — arquivo de teste avulso, não faz parte do projeto
- **`tsconfig.json` / `tsconfig.node.json`** — projeto usa JavaScript, não TypeScript. São arquivos padrão do template Vite que nunca foram usados
- **`src/components/Hero.jsx`** / **`src/components/Features.jsx`** / **`src/components/FatecHighlights.jsx`** — **NÃO são importados em nenhum lugar** do projeto. A `Home.jsx` tem todo esse conteúdo inline já. São restos de uma versão antiga.

---

### 2. Humanizar Comentários (Trocar "IA-like" por linguagem natural)

Vou substituir comentários formais/genéricos por comentários naturais em português. Exemplos:

| Antes (IA) | Depois (Humano) |
|------------|-----------------|
| `// Essencial para envio de cookies HttpOnly` | `// manda os cookies junto na requisição` |
| `// Token inválido ou expirado → forçar logout` | `// se o servidor devolver 401, desloga o usuario` |
| `// Mock the response if it's not JSON` | `// resposta nao veio em json, retorna erro generico` |
| `// Network failure` | `// sem conexao com o servidor` |
| `// Controle do AuthModal Global` | `// controle do modal de login/cadastro` |
| `// Restaura a sessão do localStorage ao carregar a página` | `// ao abrir o site, verifica se tem login salvo` |
| `// Theme colors matching the new design` | *(remover, obvio pelo contexto)* |
| `// Logged-in Dashboard View (preserved functionality, updated aesthetic)` | *(remover)* |
| `// Public Landing Page View (matches Image 1)` | *(remover)* |
| `// Efeitos de Glow` | *(remover, obvio pelo codigo)* |
| `// Background Glow Efeitos` | *(remover)* |
| `// Importando os subcomponentes atômicos do Wizard` | *(remover, obvio pelo import)* |
| `// Renderiza o componente atômico dependendo do passo atual` | `// mostra o conteudo do passo atual` |
| `// Função helper para retornar um ícone dinâmico baseado na área` | `// icone baseado na area da vaga` |
| `// Chamada Real na API` | *(remover)* |

**Backend Java** — mesma abordagem:
| Antes | Depois |
|-------|--------|
| `// Gera token já no registro para login automático` | `// gera o token pra logar automatico depois do cadastro` |
| `// Cria um cookie com o mesmo nome mas maxAge=0, o que instrui o navegador a apagá-lo` | `// apaga o cookie do navegador` |
| `// Evita responder o mesmo quiz duas vezes (opcional, mas bom pra banco de talentos)` | `// nao deixa responder o mesmo quiz 2 vezes` |
| `// NÃO inclui a.getCorreta() — protege contra trapaça` | `// nao mostra qual eh a certa pro usuario` |
| `// Calcula a média de acerto em % (acertos / total_perguntas * 100)` | `// calcula media de acerto em porcentagem` |

---

### 3. Código Duplicado / Desnecessário

- **`src/pages/Home.jsx`**: Importa `Navigate` de `react-router-dom` mas o `useNavigate` já cobre o uso. Também importa `useEffect` mas só usa uma vez — OK, mantém.
- **`src/pages/Home.jsx`**: Importa `Grid, Badge, CircularProgress, CircularProgressLabel` — precisa confirmar se todos são usados. `Grid` e `Badge` não parecem ser usados no componente logado.
- **`src/App.jsx`**: `import CriarPerfil from './pages/CriarPerfil'` — a página só renderiza `<ResumeWizard />`, poderia ser inline. Mas como é um arquivo existente e funciona, vou manter pra não mexer na estrutura.
- **`src/components/Navbar.jsx`**: `useState` é importado mas `setNotificacoes` e `setNaoLidas` são usados — OK.

---

### 4. README.md

- Atualizar a estrutura de arquivos (remover referências a `DebugController.java` que não existe, `api.ts` que é `api.js`)
- Adicionar `AdminStatsController.java`, `AdminVagaController.java` e `UsuarioController.java` na listagem
- Adicionar endpoints novos (`/api/admin/stats`, `/api/admin/vagas`)
- Remover emojis excessivos que parecem gerados por IA

---

### 5. Reset do Histórico Git

Depois de todas as alterações:
1. `git checkout --orphan temp` — cria branch sem histórico
2. `git add -A` 
3. `git commit -m "commit: organizacao geral do projeto"`
4. `git branch -D main`
5. `git branch -m main`
6. `git push -f origin main`

> [!WARNING]
> Isso vai apagar todo o histórico de commits do repositório no GitHub. É irreversível.

---

### 6. Verificação

- Rodar `npm run dev` e `mvn spring-boot:run`
- Verificar se o site carrega normalmente

## Open Questions

> [!IMPORTANT]
> Os arquivos `Hero.jsx`, `Features.jsx` e `FatecHighlights.jsx` não são usados em nenhum lugar. Posso deletar?
> Os `tsconfig.json` e `tsconfig.node.json` também não são usados (projeto é JS, não TS). Posso deletar?
