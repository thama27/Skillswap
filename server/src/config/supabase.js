import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Backend Supabase] Missing SUPABASE_URL or SUPABASE_KEY in environment.');
}

/**
 * Standard server-side Supabase client.
 */
export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates a user-scoped Supabase client that carries the caller's JWT token.
 * This guarantees all database queries executed by this client strictly respect PostgreSQL Row Level Security!
 */
export function createUserScopedClient(accessToken) {
  return createClient(supabaseUrl || '', supabaseKey || '', {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
