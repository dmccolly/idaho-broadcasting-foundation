import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { keySlot, fileName, contentType } = JSON.parse(event.body);

  const filePath = `${keySlot}/${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage
    .from('media')
    .createSignedUploadUrl(filePath, 300, { contentType });

  if (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }

  return { statusCode: 200, body: JSON.stringify(data) };
}
