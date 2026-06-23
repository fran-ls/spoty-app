import { createClient } from '@supabase/supabase-js';
import { envs } from './envs';

const SUPABASE_URL = envs.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = envs.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

interface UploadDTO {
  bucketName: string;
  filepath: string;
  file: File;
}

export async function uploadToSupabase({ bucketName, filepath, file }: UploadDTO) {
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filepath, file);

  if (error) return { data: null, error }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filepath);

  return { data: data.publicUrl, error: null }
}