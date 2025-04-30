-- Create survey_responses table
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  class VARCHAR(10) NOT NULL,
  state VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  school VARCHAR(100) NOT NULL,
  target_year VARCHAR(4) NOT NULL,
  target_session VARCHAR(10) NOT NULL,
  preferred_language VARCHAR(10) NOT NULL,
  previous_attempts INTEGER NOT NULL,
  subjects JSONB NOT NULL,
  study_hours_per_day INTEGER NOT NULL,
  has_personal_tutor BOOLEAN NOT NULL,
  preferred_study_time VARCHAR(10) NOT NULL,
  target_institutes TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Users can read their own survey responses
CREATE POLICY "Users can read their own survey responses" 
  ON survey_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own survey response
CREATE POLICY "Users can insert their own survey response" 
  ON survey_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_survey_responses_updated_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id); 