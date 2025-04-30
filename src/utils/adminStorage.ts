import { supabase } from '../lib/supabaseClient';

export interface UploadOptions {
  bucket: 'study_materials' | 'profile_images' | 'assignments' | 'quiz_attachments';
  folder: string;
  file: File;
  metadata?: Record<string, any>;
}

export interface CreateFolderOptions {
  bucket: 'study_materials' | 'profile_images' | 'assignments' | 'quiz_attachments';
  path: string;
}

export const adminStorage = {
  /**
   * Upload a file to a specific bucket and folder
   */
  async uploadFile({ bucket, folder, file, metadata = {} }: UploadOptions) {
    try {
      const filePath = `${folder}/${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
          metadata
        });

      if (error) throw error;
      return { data, filePath };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Create a folder structure in a bucket
   */
  async createFolder({ bucket, path }: CreateFolderOptions) {
    try {
      // Create a zero-byte .keep file to represent the folder
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${path}/.keep`, new Blob([]), {
          upsert: true,
          contentType: 'application/x-directory'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },

  /**
   * List contents of a bucket/folder
   */
  async listContents(bucket: string, prefix?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(prefix || '', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing contents:', error);
      throw error;
    }
  },

  /**
   * Delete a file or folder
   */
  async delete(bucket: string, paths: string[]) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting:', error);
      throw error;
    }
  },

  /**
   * Get a public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}; 