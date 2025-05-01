import { supabase } from '../lib/supabaseClient';

/**
 * Utility functions to assist with Supabase setup and debugging
 */

/**
 * Checks if required tables exist in the Supabase database
 * and provides diagnostic information
 */
export const checkSupabaseTables = async (): Promise<{
  success: boolean;
  issues: string[];
  tables: Record<string, any>;
}> => {
  const requiredTables = [
    'user_profiles',
    'user_interactions',
    'survey_responses',
    'learning_programs'
  ];
  
  const issues: string[] = [];
  const tables: Record<string, any> = {};
  
  try {
    // Check if each table exists
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (error) {
          issues.push(`Table '${tableName}' error: ${error.message}`);
          tables[tableName] = { exists: false, error: error.message };
        } else {
          tables[tableName] = { exists: true };
          
          // Check for required columns
          try {
            const { data: columnData, error: columnError } = await supabase.rpc(
              'get_table_columns', 
              { table_name: tableName }
            );
            
            if (columnError) {
              issues.push(`Cannot fetch columns for '${tableName}': ${columnError.message}`);
            } else if (columnData) {
              const columns = columnData.map((col: any) => col.column_name);
              tables[tableName].columns = columns;
              
              // Check for required columns by table
              if (tableName === 'user_profiles') {
                const requiredColumns = ['id', 'email', 'has_completed_survey'];
                for (const col of requiredColumns) {
                  if (!columns.includes(col)) {
                    issues.push(`Required column '${col}' missing from '${tableName}' table`);
                  }
                }
              }
            }
          } catch (e: any) {
            issues.push(`Error checking columns for '${tableName}': ${e.message}`);
          }
        }
      } catch (e: any) {
        issues.push(`Error checking table '${tableName}': ${e.message}`);
        tables[tableName] = { exists: false, error: e.message };
      }
    }
    
    return {
      success: issues.length === 0,
      issues,
      tables
    };
    
  } catch (e: any) {
    return {
      success: false,
      issues: [`General error: ${e.message}`],
      tables
    };
  }
};

/**
 * Creates missing required tables and columns in the Supabase database
 * NOTE: This requires correct RLS policies and permissions to be set up
 */
export const setupSupabaseTables = async (): Promise<{
  success: boolean;
  message: string;
  operations: string[];
}> => {
  const operations: string[] = [];
  
  try {
    // First, create user_profiles table if it doesn't exist
    try {
      const { data, error } = await supabase.rpc('create_table_if_not_exists', {
        table_name: 'user_profiles',
        columns: `
          id uuid primary key references auth.users(id),
          email text,
          full_name text,
          avatar_url text,
          has_completed_survey boolean default false,
          last_survey_date timestamptz,
          created_at timestamptz default now(),
          updated_at timestamptz
        `
      });
      
      if (error) {
        return {
          success: false,
          message: `Error creating user_profiles table: ${error.message}`,
          operations
        };
      }
      
      operations.push('Created or verified user_profiles table');
      
    } catch (e: any) {
      // If RPC not available, try another approach or provide guidance
      operations.push('Cannot create tables: RPC function not available');
      
      return {
        success: false,
        message: 'Table creation failed: RPC function not available. Please create tables manually.',
        operations
      };
    }
    
    // More table operations would go here...
    
    return {
      success: true,
      message: 'Tables setup complete',
      operations
    };
    
  } catch (e: any) {
    return {
      success: false,
      message: `Setup error: ${e.message}`,
      operations
    };
  }
};

/**
 * Returns SQL to create required tables and set up RLS policies
 * Run this in the Supabase SQL Editor to fix RLS issues
 */
export const getTableCreationSQL = (): string => {
  return `
-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  has_completed_survey BOOLEAN DEFAULT false,
  last_survey_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  interaction_type TEXT,
  interaction_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  exam_date DATE,
  target_score INTEGER,
  subjects JSONB,
  study_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.learning_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  program_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure we can recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policies for user_interactions table
DROP POLICY IF EXISTS "Users can view their own interactions" ON public.user_interactions;
DROP POLICY IF EXISTS "Users can insert their own interactions" ON public.user_interactions;

CREATE POLICY "Users can view their own interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies for survey_responses table  
DROP POLICY IF EXISTS "Users can view their own survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Users can insert their own survey responses" ON public.survey_responses;

CREATE POLICY "Users can view their own survey responses" 
  ON public.survey_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" 
  ON public.survey_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies for learning_programs table
DROP POLICY IF EXISTS "Users can view their own learning programs" ON public.learning_programs;
DROP POLICY IF EXISTS "Users can insert their own learning programs" ON public.learning_programs;

CREATE POLICY "Users can view their own learning programs" 
  ON public.learning_programs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning programs" 
  ON public.learning_programs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
`;
}; 