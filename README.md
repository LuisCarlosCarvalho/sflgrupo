# 🚀 SFL GRUPO - Plataforma de Streaming & Gestão VIP

Plataforma completa de entretenimento, streaming IPTV, guia de programação ao vivo (EPG), catálogo interativo sob demanda e painel administrativo com gestão de assinaturas, controle financeiro e suporte ao cliente.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React Server Components & Server Actions)
- **Biblioteca de Interface:** React 19 + TypeScript
- **Estilização:** Tailwind CSS (Dark Mode com paleta personalizada e efeitos glassmorphism)
- **Persistência de Dados & ORM:** PostgreSQL Serverless ([Neon](https://neon.tech/) / Vercel Postgres) via [Prisma ORM](https://www.prisma.io/)
- **Autenticação:** NextAuth.js (Estratégia JWT com credenciais criptografadas via `bcryptjs`)
- **Gateway de Pagamento:** Integração com Stripe (Webhooks e automação de status de assinatura)
- **CI/CD:** GitHub Actions com compilação e deploy contínuo integrado à Vercel

---

## 📋 Resumo das Implementações e Migrações Realizadas

### 1. Migração de Persistência (Supabase ➔ Vercel Postgres / Neon)
- **Desacoplamento Completo:** Remoção de chamadas diretas do SDK `@supabase/supabase-js` no frontend e backend.
- **Modelagem Tipada no Prisma:** Criação do schema `prisma/schema.prisma` consolidando 14 entidades de domínio:
  - `User`: Usuários, senhas com hash `bcrypt`, planos, papéis (`ADMIN`, `USER`) e status (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `TRIAL`).
  - `Subscription`: Controle de assinaturas Stripe, períodos e recorrência.
  - `Alert`: Notificações globais e alertas de expiração para usuários.
  - `TrailerOverride`: Links personalizados e trailers manuais para filmes/séries.
  - `SupportRequest`: Sistema de chamados e réplicas de suporte.
  - `Transaction`: Livro caixa financeiro com controle de entradas (`INCOME`), saídas (`EXPENSE`) e categorias.
  - `WatchlistItem`: Lista de favoritos do usuário com TMDB ID.
  - `TVChannel` & `TVProgram`: Grade de canais ao vivo e guia eletrônico de programação (EPG).
  - `AvailableApp`: Aplicativos para download compatíveis com Smart TV, Android, iOS e Windows.
  - `RecentCatalogUpdate`: Registro e parse inteligente de novidades do catálogo.
  - `PricingPlan`, `SiteFeature`, `SystemSetting`: Configurações dinâmicas do site e tabela de planos.

### 2. Autenticação e Centralização de Server Actions
- Implementação de Server Actions tipadas em `src/app/actions/` (`admin.ts`, `tv.ts`, `apps.ts`, `catalog.ts`, `support.ts`, `watchlist.ts`, `landing.ts`, `settings.ts`, `notifications.ts`).
- Suporte a login híbrido aceitando tanto **Nome de Usuário** quanto **E-mail**.
- Criação do singleton do Prisma Client em `src/lib/prisma.ts` para otimização de conexões serverless.

### 3. Pipeline de CI/CD & Deploy
- Atualização do workflow `.github/workflows/deploy.yml` com **Node.js 22**, geração automática do Prisma Client e fallbacks de ambiente para compilação estática.
- Adicionado script `"postinstall": "prisma generate"` no `package.json`.

---

## ⚙️ Variáveis de Ambiente (`.env` / `.env.local`)

Para rodar localmente ou configurar na **Vercel**, certifique-se de preencher as variáveis abaixo:

```env
# Banco de Dados (Neon / Vercel Postgres)
DATABASE_URL="postgresql://<user>:<password>@<host-pooler>/neondb?channel_binding=require&sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://<user>:<password>@<host-direct>/neondb?sslmode=require"

POSTGRES_PRISMA_URL="postgresql://<user>:<password>@<host-pooler>/neondb?channel_binding=require&connect_timeout=15&sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://<user>:<password>@<host-direct>/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="SFLGrupo_Secret_Key_Segura_2026_@Admin"
NEXTAUTH_URL="http://localhost:3000"

# Opcional (Stripe & TMDB)
# STRIPE_SECRET_KEY="sk_live_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."
# TMDB_API_KEY="..."
```

---

## 🚀 Comandos Úteis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento local com Turbopack em `http://localhost:3000` |
| `npx prisma db push` | Sincroniza o schema do Prisma diretamente com o banco de dados PostgreSQL |
| `npx prisma generate` | Regenera as tipagens do Prisma Client localmente |
| `npx tsx prisma/seed.ts` | Popula o banco com os usuários administrativos e dados iniciais |
| `npm run build` | Executa o build de produção e validação estática de rotas |

---

## 🔑 Acessos e Rotas Administrativas

- **Painel Administrativo:** `/admin` (ou `/sfl-admin`)
- **Dashboard do Usuário:** `/dashboard`
- **Guia de TV ao Vivo:** `/tv`
- **Rota de Auto-Setup:** `/api/setup`

### Credenciais Criadas:
- **Administrador Master:**
  - **E-mail:** `brasilviptv@gmail.com`
  - **Senha:** `S@l798412`
  - **Papel:** `ADMIN`

- **Usuário de Testes:**
  - **E-mail:** `teste@sflgrupo.store`
  - **Senha:** `User@SFL2026`
  - **Papel:** `USER` (Plano `PRO`)

---

## 📄 Licença
Propriedade de **SFL Grupo**. Todos os direitos reservados.
