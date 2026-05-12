import { supabase } from './supabase';

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'news-media';

const getFolderByMime = (mimetype = '') => (
  mimetype.startsWith('video/') ? 'videos' : 'images'
);

const getExtension = (filename = '') => {
  const ext = filename.split('.').pop();
  return ext && ext !== filename ? `.${ext.toLowerCase()}` : '';
};

const createFilename = (file) => {
  const folder = getFolderByMime(file.type);
  const randomId = crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${folder}/${randomId}${getExtension(file.name)}`;
};

export async function uploadNewsMedia(file) {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  const filename = createFilename(file);
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
  return data.publicUrl;
}
