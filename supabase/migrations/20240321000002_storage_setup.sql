-- Enable Storage by using Supabase's built-in storage schema
BEGIN;

-- Create buckets if they don't exist
DO $$
BEGIN
    -- Study Materials bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'study_materials') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'study_materials',
            'study_materials',
            false,
            104857600,
            ARRAY[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'video/mp4',
                'video/webm',
                'image/png',
                'image/jpeg',
                'image/gif'
            ]
        );
    END IF;

    -- Profile Images bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profile_images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'profile_images',
            'profile_images',
            true,
            5242880,
            ARRAY[
                'image/png',
                'image/jpeg',
                'image/gif',
                'image/webp'
            ]
        );
    END IF;

    -- Assignments bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'assignments') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'assignments',
            'assignments',
            false,
            20971520,
            ARRAY[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/png',
                'image/jpeg'
            ]
        );
    END IF;

    -- Quiz Attachments bucket
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'quiz_attachments') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'quiz_attachments',
            'quiz_attachments',
            false,
            10485760,
            ARRAY[
                'image/png',
                'image/jpeg',
                'image/gif',
                'application/pdf'
            ]
        );
    END IF;
END $$;

-- Remove existing policies if they exist
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Public Access to Study Materials" ON storage.objects;
    DROP POLICY IF EXISTS "Teachers can upload study materials" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view profile images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload their own profile image" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own profile image" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own profile image" ON storage.objects;
    DROP POLICY IF EXISTS "Students can view their assignments" ON storage.objects;
    DROP POLICY IF EXISTS "Students can upload their assignments" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can view quiz attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Teachers can upload quiz attachments" ON storage.objects;
END $$;

-- Create new policies
DO $$
BEGIN
    -- Study Materials policies
    EXECUTE format('CREATE POLICY "Public Access to Study Materials" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''study_materials'')');
    
    EXECUTE format('CREATE POLICY "Teachers can upload study materials" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id = ''study_materials''
        AND EXISTS (
            SELECT 1 FROM auth.users
            JOIN public.user_profiles ON auth.users.id = user_profiles.id
            WHERE auth.uid() = auth.users.id
            AND user_profiles.role = ''teacher''
        )
    )');

    -- Profile Images policies
    EXECUTE format('CREATE POLICY "Users can view profile images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''profile_images'')');
    
    EXECUTE format('CREATE POLICY "Users can upload their own profile image" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id = ''profile_images''
        AND (storage.foldername(name))[1] = auth.uid()::text
    )');
    
    EXECUTE format('CREATE POLICY "Users can update their own profile image" ON storage.objects FOR UPDATE TO authenticated USING (
        bucket_id = ''profile_images''
        AND (storage.foldername(name))[1] = auth.uid()::text
    )');
    
    EXECUTE format('CREATE POLICY "Users can delete their own profile image" ON storage.objects FOR DELETE TO authenticated USING (
        bucket_id = ''profile_images''
        AND (storage.foldername(name))[1] = auth.uid()::text
    )');

    -- Assignments policies
    EXECUTE format('CREATE POLICY "Students can view their assignments" ON storage.objects FOR SELECT TO authenticated USING (
        bucket_id = ''assignments''
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM auth.users
                JOIN public.user_profiles ON auth.users.id = user_profiles.id
                WHERE auth.uid() = auth.users.id
                AND user_profiles.role = ''teacher''
            )
        )
    )');
    
    EXECUTE format('CREATE POLICY "Students can upload their assignments" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id = ''assignments''
        AND (storage.foldername(name))[1] = auth.uid()::text
    )');

    -- Quiz Attachments policies
    EXECUTE format('CREATE POLICY "Authenticated users can view quiz attachments" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''quiz_attachments'')');
    
    EXECUTE format('CREATE POLICY "Teachers can upload quiz attachments" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id = ''quiz_attachments''
        AND EXISTS (
            SELECT 1 FROM auth.users
            JOIN public.user_profiles ON auth.users.id = user_profiles.id
            WHERE auth.uid() = auth.users.id
            AND user_profiles.role = ''teacher''
        )
    )');
END $$;

COMMIT;

-- Create helper function for folder management
CREATE OR REPLACE FUNCTION storage.create_folder(
    p_bucket_name text,
    p_folder_path text
) RETURNS void AS $$
BEGIN
    INSERT INTO storage.objects (bucket_id, name, owner, metadata)
    SELECT 
        p_bucket_name,
        p_folder_path || '/.keep',
        auth.uid(),
        jsonb_build_object('content-type', 'application/x-directory')
    WHERE NOT EXISTS (
        SELECT 1 FROM storage.objects
        WHERE bucket_id = p_bucket_name
        AND name = p_folder_path || '/.keep'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 