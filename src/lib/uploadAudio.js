import { supabase } from './supabase';

export async function uploadFile(file, keySlot, title, description) {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    
    if (!keySlot || !title || !description) {
      return { success: false, error: 'Missing required fields' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload any file type to media bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Fixed database insert with correct field names
    const { data: insertData, error: insertError } = await supabase
      .from('assignments')
      .insert({
        key_slot: keySlot,
        title: title,
        description: description,
        media_file_name: fileName,
        media_url: publicUrl,
        file_type: file.type || 'application/octet-stream',
        file_size: file.size,
        created_at: new Date().toISOString(),
      })
      .select();

    if (insertError) {
      return {
        success: false,
        error: `Database error: ${insertError.message}`,
        publicUrl: publicUrl
      };
    }

    return {
      success: true,
      data: insertData,
      publicUrl: publicUrl,
      fileName: fileName
    };

  } catch (error) {
    return { success: false, error: error.message };
  }
}
