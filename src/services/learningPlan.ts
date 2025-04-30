import { supabase } from '../lib/supabaseClient';

export interface Topic {
  id: string;
  subject: string;
  name: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimatedHours: number;
  prerequisites: string[];
  resources: {
    type: 'video' | 'document' | 'practice';
    url: string;
    title: string;
  }[];
}

export interface WeeklyPlan {
  week: number;
  topics: Topic[];
  goals: string[];
  totalHours: number;
  assessments: {
    type: 'quiz' | 'mock-test';
    subject: string;
    duration: number;
  }[];
}

export interface LearningPlan {
  userId: string;
  examDate: Date;
  startDate: Date;
  totalWeeks: number;
  weeklyPlans: WeeklyPlan[];
  overallProgress: number;
  lastUpdated: Date;
}

export interface ProgressUpdate {
  topicId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  notes?: string;
}

export const learningPlanService = {
  async generatePlan(
    userId: string,
    examDate: Date,
    initialAssessment: {
      subject: string;
      score: number;
      strengths: string[];
      weaknesses: string[];
    }[]
  ): Promise<LearningPlan> {
    const startDate = new Date();
    const totalWeeks = Math.ceil((examDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Calculate study hours distribution based on strengths and weaknesses
    const subjectWeights = initialAssessment.reduce((acc, subject) => {
      const baseWeight = 1;
      const weaknessMultiplier = subject.score < 60 ? 1.5 : 1;
      acc[subject.subject] = baseWeight * weaknessMultiplier;
      return acc;
    }, {} as Record<string, number>);

    // Generate weekly plans
    const weeklyPlans: WeeklyPlan[] = [];
    for (let week = 1; week <= totalWeeks; week++) {
      const plan = await this.generateWeeklyPlan(week, subjectWeights, initialAssessment);
      weeklyPlans.push(plan);
    }

    const learningPlan: LearningPlan = {
      userId,
      examDate,
      startDate,
      totalWeeks,
      weeklyPlans,
      overallProgress: 0,
      lastUpdated: new Date()
    };

    // Save plan to database
    try {
      const { data, error } = await supabase
        .from('learning_plans')
        .insert([learningPlan]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving learning plan:', error);
      throw error;
    }

    return learningPlan;
  },

  async generateWeeklyPlan(
    week: number,
    subjectWeights: Record<string, number>,
    assessmentResults: {
      subject: string;
      score: number;
      strengths: string[];
      weaknesses: string[];
    }[]
  ): Promise<WeeklyPlan> {
    // Get recommended topics based on assessment results
    const topics: Topic[] = [];
    const goals: string[] = [];
    let totalHours = 0;

    for (const subject of assessmentResults) {
      const subjectTopics = await this.getRecommendedTopics(
        subject.subject,
        subject.weaknesses,
        subjectWeights[subject.subject]
      );

      topics.push(...subjectTopics);
      totalHours += subjectTopics.reduce((sum, topic) => sum + topic.estimatedHours, 0);

      // Add subject-specific goals
      goals.push(
        `Improve ${subject.subject} score by focusing on ${subject.weaknesses.join(', ')}`,
        `Complete all practice problems for ${subject.subject} topics`
      );
    }

    // Add assessments
    const assessments: { type: 'quiz' | 'mock-test'; subject: string; duration: number; }[] = [
      {
        type: 'quiz',
        subject: 'Physics',
        duration: 60 // minutes
      },
      {
        type: 'quiz',
        subject: 'Chemistry',
        duration: 60
      },
      {
        type: 'quiz',
        subject: 'Mathematics',
        duration: 60
      }
    ];

    // Add mock test every 4 weeks
    if (week % 4 === 0) {
      assessments.push({
        type: 'mock-test',
        subject: 'All',
        duration: 180
      });
    }

    return {
      week,
      topics,
      goals,
      totalHours,
      assessments
    };
  },

  async getRecommendedTopics(
    subject: string,
    weaknesses: string[],
    weight: number
  ): Promise<Topic[]> {
    try {
      // Fetch topics from database based on subject and weaknesses
      const { data: topics, error } = await supabase
        .from('topics')
        .select('*')
        .eq('subject', subject)
        .in('name', weaknesses);

      if (error) throw error;

      // Adjust study hours based on weight
      return topics.map(topic => ({
        ...topic,
        estimatedHours: Math.round(topic.baseHours * weight)
      }));
    } catch (error) {
      console.error('Error fetching recommended topics:', error);
      throw error;
    }
  },

  async updateProgress(userId: string, updates: ProgressUpdate[]): Promise<void> {
    try {
      // Get current learning plan
      const { data: plan, error: planError } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('userId', userId)
        .single();

      if (planError) throw planError;

      // Update progress for each topic
      const updatedTopics = new Set<string>();
      updates.forEach(update => {
        updatedTopics.add(update.topicId);
      });

      // Calculate new overall progress
      const totalTopics = plan.weeklyPlans.reduce(
        (sum: number, week: WeeklyPlan) => sum + week.topics.length,
        0
      );
      const completedTopics = plan.weeklyPlans.reduce((sum: number, week: WeeklyPlan) => {
        return sum + week.topics.filter((topic: Topic) => 
          updates.some(u => u.topicId === topic.id && u.completed)
        ).length;
      }, 0);

      const overallProgress = (completedTopics / totalTopics) * 100;

      // Save progress updates
      const { error: updateError } = await supabase
        .from('learning_plans')
        .update({
          weeklyPlans: plan.weeklyPlans,
          overallProgress,
          lastUpdated: new Date()
        })
        .eq('userId', userId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  async getStudyStreak(userId: string): Promise<number> {
    try {
      const { data: activities, error } = await supabase
        .from('study_activities')
        .select('date')
        .eq('userId', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!activities || activities.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      let currentDate = today;

      for (const activity of activities) {
        const activityDate = new Date(activity.date);
        const dayDifference = Math.floor(
          (currentDate.getTime() - activityDate.getTime()) / (24 * 60 * 60 * 1000)
        );

        if (dayDifference <= 1) {
          streak++;
          currentDate = activityDate;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating study streak:', error);
      throw error;
    }
  },

  async getRecommendedResources(topic: string): Promise<Topic['resources']> {
    try {
      const { data: resources, error } = await supabase
        .from('study_resources')
        .select('*')
        .eq('topic', topic);

      if (error) throw error;

      return resources.map(resource => ({
        type: resource.type,
        url: resource.url,
        title: resource.title
      }));
    } catch (error) {
      console.error('Error fetching recommended resources:', error);
      throw error;
    }
  }
}; 