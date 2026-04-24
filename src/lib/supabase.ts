import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_key"

// Este cliente tem poderes de administrador para gerenciar usuários e planos
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
