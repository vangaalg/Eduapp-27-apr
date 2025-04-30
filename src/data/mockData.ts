import { Topic, WeeklyPlan, LearningPlan } from '../services/learningPlan';

export const mockTopics: Topic[] = [
  {
    id: 'PHY001',
    subject: 'Physics',
    name: 'Kinematics',
    difficulty: 'intermediate',
    estimatedHours: 10,
    prerequisites: [],
    resources: [
      {
        type: 'video',
        url: 'https://example.com/kinematics-lecture',
        title: 'Introduction to Kinematics'
      },
      {
        type: 'document',
        url: 'https://example.com/kinematics-notes',
        title: 'Kinematics Formula Sheet'
      }
    ]
  },
  {
    id: 'CHEM001',
    subject: 'Chemistry',
    name: 'Organic Chemistry Basics',
    difficulty: 'basic',
    estimatedHours: 8,
    prerequisites: [],
    resources: [
      {
        type: 'video',
        url: 'https://example.com/organic-chem-intro',
        title: 'Organic Chemistry Fundamentals'
      }
    ]
  },
  {
    id: 'MATH001',
    subject: 'Mathematics',
    name: 'Calculus',
    difficulty: 'advanced',
    estimatedHours: 12,
    prerequisites: ['MATH000'],
    resources: [
      {
        type: 'practice',
        url: 'https://example.com/calculus-problems',
        title: 'Calculus Practice Problems'
      }
    ]
  }
];

export const mockAssessmentResults = [
  {
    subject: 'Physics',
    score: 75,
    strengths: ['Mechanics', 'Thermodynamics'],
    weaknesses: ['Optics', 'Modern Physics']
  },
  {
    subject: 'Chemistry',
    score: 62,
    strengths: ['Inorganic Chemistry'],
    weaknesses: ['Organic Chemistry', 'Physical Chemistry']
  },
  {
    subject: 'Mathematics',
    score: 68,
    strengths: ['Algebra'],
    weaknesses: ['Calculus', 'Trigonometry']
  }
];

export const mockWeeklyPlan: WeeklyPlan = {
  week: 1,
  topics: mockTopics,
  goals: [
    'Complete Kinematics fundamentals',
    'Practice Organic Chemistry basics',
    'Master Calculus derivatives'
  ],
  totalHours: 30,
  assessments: [
    {
      type: 'quiz',
      subject: 'Physics',
      duration: 60
    },
    {
      type: 'quiz',
      subject: 'Chemistry',
      duration: 60
    },
    {
      type: 'mock-test',
      subject: 'All',
      duration: 180
    }
  ]
};

export const mockLearningPlan: LearningPlan = {
  userId: 'user123',
  examDate: new Date('2025-05-15'),
  startDate: new Date('2024-01-01'),
  totalWeeks: 72,
  weeklyPlans: [mockWeeklyPlan],
  overallProgress: 15,
  lastUpdated: new Date()
};

export const mockStudyActivities = [
  {
    date: new Date('2024-01-15'),
    topicId: 'PHY001',
    timeSpent: 120,
    completed: true,
    score: 85
  },
  {
    date: new Date('2024-01-14'),
    topicId: 'CHEM001',
    timeSpent: 90,
    completed: true,
    score: 72
  },
  {
    date: new Date('2024-01-13'),
    topicId: 'MATH001',
    timeSpent: 150,
    completed: false,
    score: 0
  }
];

export const mockTestResults = [
  {
    id: 'TEST001',
    type: 'quiz',
    subject: 'Physics',
    date: new Date('2024-01-10'),
    score: 75,
    totalQuestions: 30,
    correctAnswers: 22,
    timeSpent: 55,
    topicsCovered: ['Kinematics', 'Dynamics'],
    weakAreas: ['Circular Motion', 'Projectile Motion']
  },
  {
    id: 'TEST002',
    type: 'mock-test',
    subject: 'All',
    date: new Date('2024-01-12'),
    score: 68,
    totalQuestions: 90,
    correctAnswers: 61,
    timeSpent: 175,
    topicsCovered: ['Kinematics', 'Organic Chemistry', 'Calculus'],
    weakAreas: ['Modern Physics', 'Physical Chemistry', 'Integration']
  }
]; 