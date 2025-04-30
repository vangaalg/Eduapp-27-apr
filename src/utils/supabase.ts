import { createClient } from '@supabase/supabase-js';
import { StudentSurvey } from '../types/survey';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveSurveyResponse = async (survey: StudentSurvey, userId: string) => {
  const { data, error } = await supabase
    .from('survey_responses')
    .insert([
      {
        user_id: userId,
        ...survey,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
};

export const getSurveyResponse = async (userId: string) => {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as StudentSurvey;
};

export const hasSurveyResponse = async (userId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return false;
  return (count || 0) > 0;
}; 