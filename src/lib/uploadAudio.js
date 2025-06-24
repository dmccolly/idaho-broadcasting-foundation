import { supabase } from './supabase';

export async function uploadAudio(file, keySlot, title, description) {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload the file to Supabase Storage bucket named "audio"
  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'audio/mpeg',
    });

  if (uploadError) {
    throw uploadError;
  }

  // Retrieve a public URL for the uploaded file
  const {
    data: { publicUrl },
    error: publicUrlError,
  } = supabase.storage.from('audio').getPublicUrl(filePath);

  if (publicUrlError) {
    throw publicUrlError;
  }

  // Insert a new row into the assignments table
  const { error: insertError } = await supabase.from('assignments').insert([
    {
      key_slot: keySlot,
      title,
      description,
      url: publicUrl,
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    throw insertError;
  }

  return publicUrl;
}
