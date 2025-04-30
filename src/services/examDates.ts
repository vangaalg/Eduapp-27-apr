import { StudentSurvey } from '../types/survey';

interface ExamSession {
  name: 'January' | 'April' | 'June';
  year: string;
  startDate: Date;
  applicationDeadline: Date;
  eligibility: {
    minAge: number;
    maxAge: number;
    maxAttempts: number;
  };
}

export const JEE_SESSIONS: ExamSession[] = [
  {
    name: 'January',
    year: '2025',
    startDate: new Date('2025-01-15'),
    applicationDeadline: new Date('2024-11-30'),
    eligibility: {
      minAge: 17,
      maxAge: 25,
      maxAttempts: 2
    }
  },
  {
    name: 'April',
    year: '2025',
    startDate: new Date('2025-04-10'),
    applicationDeadline: new Date('2025-02-28'),
    eligibility: {
      minAge: 17,
      maxAge: 25,
      maxAttempts: 2
    }
  },
  {
    name: 'June',
    year: '2025',
    startDate: new Date('2025-06-15'),
    applicationDeadline: new Date('2025-04-30'),
    eligibility: {
      minAge: 17,
      maxAge: 25,
      maxAttempts: 2
    }
  }
];

export const examService = {
  getExamSession(targetYear: string, targetSession: string): ExamSession | undefined {
    return JEE_SESSIONS.find(
      session => session.year === targetYear && session.name === targetSession
    );
  },

  calculateWeeksUntilExam(examDate: Date): number {
    const today = new Date();
    const timeUntilExam = examDate.getTime() - today.getTime();
    return Math.ceil(timeUntilExam / (1000 * 60 * 60 * 24 * 7));
  },

  generateLearningPath(survey: StudentSurvey) {
    const examSession = this.getExamSession(survey.targetYear, survey.targetSession);
    if (!examSession) {
      throw new Error('Invalid exam session selected');
    }

    const weeksRemaining = this.calculateWeeksUntilExam(examSession.startDate);
    
    // Calculate study intensity based on confidence levels
    const avgConfidence = (
      survey.subjects.physics.confidence +
      survey.subjects.chemistry.confidence +
      survey.subjects.mathematics.confidence
    ) / 3;

    // Adjust study hours based on confidence and available time
    const recommendedHoursPerDay = Math.min(
      Math.max(8 - avgConfidence, 4), // Lower confidence = more hours needed
      survey.studyHoursPerDay
    );

    // Generate weekly focus areas based on weak topics
    const weakTopics = {
      physics: survey.subjects.physics.weakTopics,
      chemistry: survey.subjects.chemistry.weakTopics,
      mathematics: survey.subjects.mathematics.weakTopics
    };

    // Calculate topic distribution
    const totalWeakTopics = 
      weakTopics.physics.length + 
      weakTopics.chemistry.length + 
      weakTopics.mathematics.length;

    const subjectDistribution = {
      physics: Math.max(0.3, weakTopics.physics.length / totalWeakTopics),
      chemistry: Math.max(0.3, weakTopics.chemistry.length / totalWeakTopics),
      mathematics: Math.max(0.3, weakTopics.mathematics.length / totalWeakTopics)
    };

    return {
      examDate: examSession.startDate,
      applicationDeadline: examSession.applicationDeadline,
      weeksRemaining,
      recommendedHoursPerDay,
      subjectDistribution,
      weakTopics,
      dailySchedule: this.generateDailySchedule(survey.preferredStudyTime, recommendedHoursPerDay),
      weeklyAssessments: this.generateWeeklyAssessments(weeksRemaining)
    };
  },

  generateDailySchedule(preferredTime: string, hoursPerDay: number) {
    const timeSlots = {
      Morning: { start: '06:00', end: '12:00' },
      Afternoon: { start: '12:00', end: '17:00' },
      Evening: { start: '17:00', end: '21:00' },
      Night: { start: '21:00', end: '24:00' }
    };

    const slot = timeSlots[preferredTime as keyof typeof timeSlots];
    const sessions = [];
    let remainingHours = hoursPerDay;

    while (remainingHours > 0) {
      const sessionLength = Math.min(2, remainingHours); // Max 2 hours per session
      sessions.push({
        duration: sessionLength,
        type: remainingHours > 2 ? 'Focus Session' : 'Review Session'
      });
      remainingHours -= sessionLength;
    }

    return {
      preferredTimeSlot: slot,
      sessions
    };
  },

  generateWeeklyAssessments(totalWeeks: number) {
    const assessments = [];
    for (let week = 1; week <= totalWeeks; week++) {
      // Regular weekly assessments
      assessments.push({
        week,
        quizzes: [
          { subject: 'Physics', duration: 60 },
          { subject: 'Chemistry', duration: 60 },
          { subject: 'Mathematics', duration: 60 }
        ],
        mockTest: week % 4 === 0 ? { // Full mock test every 4 weeks
          subject: 'All',
          duration: 180
        } : null
      });
    }
    return assessments;
  }
}; 