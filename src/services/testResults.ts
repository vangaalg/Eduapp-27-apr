import { supabase } from '../lib/supabaseClient';

export interface TestResult {
  subject: string;
  score: number;
  date: Date;
  source: 'assessment' | 'mock-test' | 'built-in';
  strengths: string[];
  weaknesses: string[];
}

export interface AggregatedResults {
  overallScore: number;
  subjects: {
    [key: string]: {
      averageScore: number;
      strengths: string[];
      weaknesses: string[];
      recentScores: {
        score: number;
        date: Date;
        source: string;
      }[];
    };
  };
}

export const testResultsService = {
  async saveTestResult(result: TestResult) {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert([result]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  },

  async getAggregatedResults(userId: string): Promise<AggregatedResults> {
    try {
      // Fetch all test results for the user
      const { data: results, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Initialize aggregated results
      const aggregated: AggregatedResults = {
        overallScore: 0,
        subjects: {}
      };

      if (!results || results.length === 0) {
        return aggregated;
      }

      // Process each result
      results.forEach((result: TestResult) => {
        if (!aggregated.subjects[result.subject]) {
          aggregated.subjects[result.subject] = {
            averageScore: 0,
            strengths: [],
            weaknesses: [],
            recentScores: []
          };
        }

        const subject = aggregated.subjects[result.subject];

        // Add score to recent scores
        subject.recentScores.push({
          score: result.score,
          date: result.date,
          source: result.source
        });

        // Update strengths and weaknesses
        result.strengths.forEach(strength => {
          if (!subject.strengths.includes(strength)) {
            subject.strengths.push(strength);
          }
        });

        result.weaknesses.forEach(weakness => {
          if (!subject.weaknesses.includes(weakness)) {
            subject.weaknesses.push(weakness);
          }
        });
      });

      // Calculate averages
      let totalScore = 0;
      let totalSubjects = 0;

      Object.keys(aggregated.subjects).forEach(subject => {
        const subjectData = aggregated.subjects[subject];
        const scores = subjectData.recentScores.map(s => s.score);
        subjectData.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        totalScore += subjectData.averageScore;
        totalSubjects++;
      });

      aggregated.overallScore = totalScore / totalSubjects;

      return aggregated;
    } catch (error) {
      console.error('Error fetching aggregated results:', error);
      throw error;
    }
  }
}; 