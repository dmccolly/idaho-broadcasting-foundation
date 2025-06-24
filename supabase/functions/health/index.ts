import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

// Supabase Edge Function: /api/health
// Responds with simple JSON and proper CORS headers so the Netlify frontend can access it.

const ALLOWED_ORIGIN = 'https://cozy-starlight-8f02f9.netlify.app';

serve(async (req) => {
  // Handle CORS pre‑flight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // Health response
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  });
});
