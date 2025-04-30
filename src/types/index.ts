export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  pace: string;
  lastPerformance?: {
    subject: string;
    score: number;
    date: Date;
  }[];
}

export interface LearningPlan {
  week: number;
  topics: {
    subject: string;
    topics: string[];
    recommendedHours: number;
  }[];
  goals: string[];
} 