import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

// Supabase Edge Function: /api/health
// Responds with simple JSON and proper CORS headers so the Netlify frontend can access it.

// Allow requests from the production domain and Netlify deploy previews
const BASE_DOMAIN = 'cozy-starlight-8f02f9.netlify.app';

function getAllowedOrigin(req: Request): string {
  const origin = req.headers.get('Origin') ?? '';
  return origin.endsWith(BASE_DOMAIN) ? origin : `https://${BASE_DOMAIN}`;
}

serve(async (req) => {
  const allowedOrigin = getAllowedOrigin(req);

  // Handle CORS pre‑flight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // Health response
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
    },
  });
});
