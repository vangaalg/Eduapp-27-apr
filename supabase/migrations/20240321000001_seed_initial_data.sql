-- Seed Subjects
INSERT INTO subjects (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Physics', 'Comprehensive physics course covering mechanics, electromagnetism, and modern physics for IIT-JEE'),
    ('22222222-2222-2222-2222-222222222222', 'Chemistry', 'In-depth chemistry course covering physical, organic, and inorganic chemistry for IIT-JEE'),
    ('33333333-3333-3333-3333-333333333333', 'Mathematics', 'Advanced mathematics course covering algebra, calculus, and coordinate geometry for IIT-JEE');

-- Seed Topics for Physics
INSERT INTO topics (id, subject_id, name, description, order_index) VALUES
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Kinematics', 'Study of motion including velocity, acceleration, and equations of motion', 1),
    ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Newton''s Laws', 'Fundamental laws of motion and their applications', 2),
    ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Electromagnetism', 'Electric fields, magnetic fields, and electromagnetic induction', 3);

-- Seed Topics for Chemistry
INSERT INTO topics (id, subject_id, name, description, order_index) VALUES
    ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Chemical Bonding', 'Types of chemical bonds and molecular structure', 1),
    ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Organic Chemistry Basics', 'Introduction to organic compounds and reactions', 2),
    ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Thermodynamics', 'Laws of thermodynamics and their applications', 3);

-- Seed Topics for Mathematics
INSERT INTO topics (id, subject_id, name, description, order_index) VALUES
    ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Differential Calculus', 'Limits, continuity, and differentiation', 1),
    ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Integral Calculus', 'Integration techniques and applications', 2),
    ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Coordinate Geometry', 'Points, lines, circles, and conics', 3);

-- Seed Study Materials
INSERT INTO study_materials (topic_id, title, description, content_type, difficulty_level, content_url, duration) VALUES
    -- Physics Materials
    ('a1111111-1111-1111-1111-111111111111', 'Introduction to Kinematics', 'Basic concepts of motion in one dimension', 'video', 'beginner', 'https://example.com/videos/kinematics-intro', 45),
    ('a1111111-1111-1111-1111-111111111111', 'Kinematics Problem Set', 'Practice problems for one-dimensional motion', 'document', 'intermediate', 'https://example.com/docs/kinematics-problems', 20),
    ('a2222222-2222-2222-2222-222222222222', 'Newton''s Laws Explained', 'Detailed explanation of all three laws', 'video', 'beginner', 'https://example.com/videos/newtons-laws', 60),
    
    -- Chemistry Materials
    ('b1111111-1111-1111-1111-111111111111', 'Chemical Bonding Basics', 'Introduction to ionic and covalent bonds', 'video', 'beginner', 'https://example.com/videos/chemical-bonding', 40),
    ('b2222222-2222-2222-2222-222222222222', 'Organic Chemistry Fundamentals', 'Basic concepts of organic chemistry', 'document', 'intermediate', 'https://example.com/docs/organic-basics', 30),
    ('b3333333-3333-3333-3333-333333333333', 'Thermodynamics Interactive Lab', 'Virtual lab for thermodynamics experiments', 'interactive', 'advanced', 'https://example.com/labs/thermo', 90),
    
    -- Mathematics Materials
    ('c1111111-1111-1111-1111-111111111111', 'Calculus Fundamentals', 'Introduction to differentiation', 'video', 'intermediate', 'https://example.com/videos/calculus-intro', 55),
    ('c2222222-2222-2222-2222-222222222222', 'Integration Techniques', 'Common methods of integration', 'document', 'advanced', 'https://example.com/docs/integration', 40),
    ('c3333333-3333-3333-3333-333333333333', 'Coordinate Geometry Practice', 'Interactive geometry problems', 'interactive', 'intermediate', 'https://example.com/practice/coordinate', 60);

-- Seed Quizzes
INSERT INTO quizzes (topic_id, title, description, duration_minutes, passing_score, difficulty_level) VALUES
    -- Physics Quizzes
    ('a1111111-1111-1111-1111-111111111111', 'Kinematics Basic Quiz', 'Test your understanding of basic kinematics concepts', 30, 70, 'beginner'),
    ('a2222222-2222-2222-2222-222222222222', 'Newton''s Laws Advanced Quiz', 'Advanced problems on Newton''s Laws', 45, 75, 'advanced'),
    
    -- Chemistry Quizzes
    ('b1111111-1111-1111-1111-111111111111', 'Chemical Bonding Quiz', 'Test on ionic and covalent bonding', 30, 70, 'intermediate'),
    ('b2222222-2222-2222-2222-222222222222', 'Organic Chemistry Quiz', 'Basic organic chemistry concepts', 40, 65, 'beginner'),
    
    -- Mathematics Quizzes
    ('c1111111-1111-1111-1111-111111111111', 'Differential Calculus Test', 'Comprehensive test on differentiation', 60, 80, 'advanced'),
    ('c2222222-2222-2222-2222-222222222222', 'Integration Basics Quiz', 'Basic integration problems', 45, 70, 'intermediate');

-- Seed Questions (Sample questions for the first quiz)
INSERT INTO questions (quiz_id, question_text, correct_answer, options, explanation, points) VALUES
    ((SELECT id FROM quizzes WHERE title = 'Kinematics Basic Quiz' LIMIT 1),
     'A car travels 100 meters in 10 seconds. What is its average speed?',
     '10 m/s',
     '["5 m/s", "10 m/s", "15 m/s", "20 m/s"]',
     'Average speed = Distance/Time = 100/10 = 10 m/s',
     2),
    
    ((SELECT id FROM quizzes WHERE title = 'Kinematics Basic Quiz' LIMIT 1),
     'What is acceleration?',
     'Rate of change of velocity',
     '["Rate of change of velocity", "Rate of change of distance", "Rate of change of speed", "Rate of change of time"]',
     'Acceleration is defined as the rate of change of velocity with respect to time',
     1),
    
    ((SELECT id FROM quizzes WHERE title = 'Chemical Bonding Quiz' LIMIT 1),
     'Which of these represents a covalent bond?',
     'H2',
     '["NaCl", "H2", "CaO", "KBr"]',
     'H2 molecule has a covalent bond where electrons are shared between two hydrogen atoms',
     2);

-- Create RLS Policies
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to educational content
CREATE POLICY "Allow public read access to subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to study materials" ON study_materials FOR SELECT USING (true);
CREATE POLICY "Allow public read access to quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to questions" ON questions FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id); 