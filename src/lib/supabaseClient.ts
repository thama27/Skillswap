import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://isgyzxzdbjbkbiarbvpm.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_mh8y2xOczOVw6WicelA_zQ_S2r79bKy';

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

/**
 * Non-intrusive connection test to verify communication with the Supabase project.
 * Does not expose credentials or modify the visual UI.
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[Supabase] Connection test returned an error:', error.message);
      return { success: false, message: error.message };
    }
    console.log('[Supabase] Connection test passed: Successfully reached Supabase project.');
    return { success: true, message: 'Connected successfully' };
  } catch (err: any) {
    console.error('[Supabase] Connection test failed:', err);
    return { success: false, message: err?.message || 'Connection test failed' };
  }
}
