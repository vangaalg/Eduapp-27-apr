export interface StudentSurvey {
  name: string;
  age: number;
  class: '11' | '12' | 'Dropper';
  state: string;
  city: string;
  school: string;
  targetYear: string;
  targetSession: 'January' | 'April' | 'June';
  preferredLanguage: 'English' | 'Hindi';
  previousAttempts: number;
  subjects: {
    physics: {
      confidence: 1 | 2 | 3 | 4 | 5;
      weakTopics: string[];
    };
    chemistry: {
      confidence: 1 | 2 | 3 | 4 | 5;
      weakTopics: string[];
    };
    mathematics: {
      confidence: 1 | 2 | 3 | 4 | 5;
      weakTopics: string[];
    };
  };
  studyHoursPerDay: number;
  hasPersonalTutor: boolean;
  preferredStudyTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  targetInstitutes: string[];
} 