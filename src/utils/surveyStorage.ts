import { StudentSurvey } from '../types/survey';
import { supabase } from '../lib/supabaseClient';

export const saveSurveyResponse = async (survey: StudentSurvey): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('survey_responses')
    .insert([{
      user_id: user.id,
      ...survey
    }]);

  if (error) throw error;
};

export const getSurveyResponse = async (): Promise<StudentSurvey | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as StudentSurvey;
};

export const hasSurveyResponse = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count, error } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return false;
  return (count || 0) > 0;
}; 