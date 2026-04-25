-- Supabase migration: criar tabelas do painel administrativo
-- Executar no Editor SQL ou via supabase migrations

-- 1. users (já existe, mas garantimos campos necessários)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar NOT NULL UNIQUE,
  name varchar,
  role varchar NOT NULL DEFAULT 'user',
  status varchar NOT NULL DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. plans
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name varchar NOT NULL,
  activated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  type varchar NOT NULL,            -- ex.: 'expiration'
  days_remaining int NOT NULL,      -- 5, 3 ou 1
  sent_at timestamp with time zone DEFAULT now()
);

-- 4. trailer_overrides
CREATE TABLE IF NOT EXISTS public.trailer_overrides (
  movie_id varchar PRIMARY KEY,
  manual_url text NOT NULL,
  created_by uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- 5. support_tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  movie_id varchar,
  issue_type varchar NOT NULL,      -- ex.: 'problema', 'sugestão'
  status varchar NOT NULL DEFAULT 'open',
  created_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
