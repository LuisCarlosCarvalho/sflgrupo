# SFL Stream - SaaS Streaming Platform

SFL Stream é uma plataforma SaaS de streaming de alta performance, inspirada na Netflix, desenvolvida com foco em eventos esportivos e jogos.

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Estilização**: Tailwind CSS 4 (Glassmorphism & Design System Premium)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Pagamentos**: Stripe (Assinaturas recorrentes em 3 níveis)
- **Autenticação**: NextAuth.js
- **Animações**: Framer Motion & Lucide React

## 🛠️ Configuração Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LuisCarlosCarvalho/sflgrupo.git
   cd sflgrupo
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` e preencha as chaves do Stripe, Banco de Dados e NextAuth.
   ```bash
   cp .env.example .env
   ```

4. **Prepare o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 💳 Integração Stripe

O sistema está configurado com 3 níveis de assinatura:
- **Basic**: Celular/Tablet (720p)
- **Standard**: Full HD (1080p)
- **Premium**: Ultra HD (4K + HDR)

Para testar webhooks localmente, utilize o Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📁 Estrutura do Projeto

- `src/app`: Rotas e páginas (Dashboard, Landing, Auth).
- `src/components`: Componentes modulares reutilizáveis.
- `src/lib`: Configurações de clientes (Prisma, Stripe, Auth).
- `src/actions`: Lógicas de servidor (Server Actions).
- `prisma/`: Esquema do banco de dados.

## 📄 Licença

Este projeto é de uso exclusivo do SFL Grupo.

---
Desenvolvido por Antigravity (Senior Full-Stack Architect Simulation).
