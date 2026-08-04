# 🎓 Roteiro de Apresentação FATEC - Point Media Talent Bank

## 🔗 Acesso ao Sistema
- **Link Público (Railway):** _(Este link será gerado no Railway após o deploy. Você vai anotar a URL HTTPS aqui para abrir na escola)_
- **URL Local:** `http://localhost:8080` (caso precise rodar pelo seu notebook na rede interna, embora o Railway seja o foco).

## 🔑 Credenciais de Demonstração
**Admin:**
- Email: `admin@pointmedia.com`
- Senha: `admin123`

**Candidato:**
- Mostre criando um novo perfil na hora (gera mais impacto). Caso contrário, crie um no dia anterior para mostrar testes prontos.

---

## 🎬 Sequência Ideal de Demonstração

1. **Abertura:**
   - Acesse a landing page pública. Destaque o design (Dark/Light mode) e a proposta do sistema (Point Media Talent Bank).
   - Fale brevemente das tecnologias: **React, Spring Boot e MySQL.**

2. **Fluxo do Candidato:**
   - Clique em **"Cadastrar"** e crie uma conta fictícia.
   - Mostre o **"Wizard de Currículo"** de 3 etapas. Fale sobre como a navegação é fluida (SPA).
   - Vá para a aba **"Vagas"** e mostre a visualização de vagas internas da Point Media.
   - Acesse **"Quizzes"** e inicie um quiz. Deixe o timer rolar alguns segundos, responda rápido e mostre o resultado/nota na hora.
   - Destaque o **"Ranking Global"** mostrando a gamificação (selos, pódio).

3. **Fluxo do Administrador (Recrutador):**
   - Saia da conta (Logout).
   - Faça login com as credenciais de `admin`.
   - Na **Dashboard**, mostre os gráficos/cards de estatísticas.
   - Mostre a aba de **Busca de Candidatos** usando os filtros (ex: cargo, habilidades).
   - Clique no botão de enviar uma notificação para um candidato selecionado.
   - Acesse a aba **Gestão de Vagas** e mostre como criar uma nova vaga.

4. **Destaques Técnicos (Se a banca perguntar):**
   - O projeto usa autenticação segura com **JWT em Cookies HttpOnly**, protegendo contra roubo de tokens via script (XSS).
   - O deploy está estruturado no **Railway** usando Docker com build de **Múltiplas Etapas (Multi-stage build)**. O JAR do Spring Boot já contém os assets do frontend embarcados, rodando num único serviço para otimizar custo e performance.

---

## 🚨 Plano de Emergência (Caso dê algo errado)

### Caso 1: A internet da Fatec bloqueie o Railway
**Solução:**
- Ligue o "Roteador WiFi/Ponto de Acesso" do seu celular.
- Conecte o notebook na rede do celular.
- Acesse o link normalmente (os dados do Railway são muito leves, não vai gastar sua franquia).

### Caso 2: Não tenha internet de forma alguma
**Solução:**
- Deixe o Docker ou o Java instalado e rodando em `localhost` em background antes de ir. Tenha os serviços (Vite e Spring) abertos numa janela pronta para subir se necessário.
- Ou melhor: Grave um vídeo **agora** com a tela capturando você fazendo todo o fluxo acima. Se a internet cair, você dá "Play" no vídeo e vai narrando ao vivo. É infalível!
