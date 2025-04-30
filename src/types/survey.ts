export interface SubjectData {
  confidence: 1 | 2 | 3 | 4 | 5;
  weakTopics: string[];
}

export interface StudentSurvey {
  name: string;
  age: number;
  class: '11' | '12' | 'Dropper';
  state: string;
  city?: string;
  school?: string;
  targetYear: string;
  targetSession: 'January' | 'April' | 'June';
  preferredLanguage: 'English' | 'Hindi';
  previousAttempts: number;
  subjects: {
    physics: SubjectData;
    chemistry: SubjectData;
    mathematics: SubjectData;
  };
  studyHoursPerDay: number;
  hasPersonalTutor: boolean;
  preferredStudyTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  targetInstitutes: string[];
}

export interface LearningProgram {
  id: string;
  userId: string;
  programData: string;
  createdAt: string;
  updatedAt: string;
} 