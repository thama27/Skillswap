import { supabase, createUserScopedClient } from '../config/supabase.js';

/**
 * Middleware to authenticate requests using Supabase JWT Bearer token.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing or invalid format',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Bearer token not found',
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: error?.message || 'Invalid or expired authentication token',
      });
    }

    // Attach user, token, and user-scoped client for RLS
    req.user = user;
    req.token = token;
    req.supabaseClient = createUserScopedClient(token);

    next();
  } catch (err) {
    console.error('[Auth Middleware] Error verifying token:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error verifying authentication',
    });
  }
}
