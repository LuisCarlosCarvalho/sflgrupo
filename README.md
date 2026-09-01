# SFL Grupo — SFL Stream Platform

Plataforma de streaming OTT/IPTV com catálogo on-demand, TV ao vivo com EPG interativo e gestão SaaS com Stripe.

## 🛠️ Stack Tecnológica
- **Framework:** Next.js (App Router) + React 19 + TypeScript 5
- **Estilização:** Tailwind CSS v4
- **Banco de Dados:** Vercel Postgres (Neon Serverless)
- **ORM:** Prisma ORM
- **Autenticação:** NextAuth.js (Credentials & JWT)
- **Faturamento:** Stripe Checkout & Webhooks

## ⚡ Passo a Passo de Execução

1. **Instalar Dependências:**
   ```bash
   npm install @prisma/client bcryptjs
   npm install -D prisma @types/bcryptjs
   ```

2. **Provisionar Tabelas no Vercel Postgres:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Inicializar Usuários e Dados Padrão:**
   Acesse a rota no navegador ou faça uma requisição GET:
   `http://localhost:3000/api/setup`

   - **Admin:** `admin@sflgrupo.store` | **Senha:** `Admin@SFL2026`
   - **Teste:** `teste@sflgrupo.store` | **Senha:** `User@SFL2026`
