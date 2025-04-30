import { supabase } from '../lib/supabaseClient';

export async function testSupabaseConnection() {
  try {
    // Test survey_responses table access
    const { data: surveyData, error: surveyError } = await supabase
      .from('survey_responses')
      .select('id')
      .limit(1);
    
    if (surveyError) {
      console.error('Survey table error:', surveyError);
      return false;
    }

    // Test learning_programs table access
    const { data: programData, error: programError } = await supabase
      .from('learning_programs')
      .select('id')
      .limit(1);
    
    if (programError) {
      console.error('Learning programs table error:', programError);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
} 