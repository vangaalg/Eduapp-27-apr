-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    class TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT,
    school TEXT,
    target_year TEXT NOT NULL,
    target_session TEXT NOT NULL,
    preferred_language TEXT NOT NULL,
    previous_attempts INTEGER DEFAULT 0,
    subjects JSONB NOT NULL,
    study_hours_per_day INTEGER NOT NULL,
    has_personal_tutor BOOLEAN DEFAULT false,
    preferred_study_time TEXT NOT NULL,
    target_institutes TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_programs table
CREATE TABLE IF NOT EXISTS learning_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program_data TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_programs ENABLE ROW LEVEL SECURITY;

-- Policy for survey_responses
CREATE POLICY "Users can view their own survey responses"
    ON survey_responses
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses"
    ON survey_responses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for learning_programs
CREATE POLICY "Users can view their own learning programs"
    ON learning_programs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning programs"
    ON learning_programs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_responses_updated_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_programs_updated_at
    BEFORE UPDATE ON learning_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 