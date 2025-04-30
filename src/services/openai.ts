import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should proxy through your backend
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface UserContext {
  strengths?: string[];
  weaknesses?: string[];
  learningStyle?: string;
  pace?: string;
  lastPerformance?: {
    subject: string;
    score: number;
    date: Date;
  }[];
}

const SYSTEM_PROMPT = `You are an AI learning assistant for JEE preparation. Your role is to:
1. Help students navigate the learning platform
2. Create personalized learning plans based on their performance and preferences
3. Track their progress and adjust recommendations accordingly
4. Provide specific, actionable advice for improvement

Always be encouraging and supportive while maintaining a focus on academic excellence.`;

export const openaiService = {
  async generateChatResponse(
    messages: ChatMessage[],
    userContext?: UserContext
  ) {
    try {
      // Add user context to the conversation
      const contextualizedMessages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(userContext ? [{
          role: 'system',
          content: `User Context:
- Strengths: ${userContext.strengths?.join(', ')}
- Weaknesses: ${userContext.weaknesses?.join(', ')}
- Learning Style: ${userContext.learningStyle}
- Pace: ${userContext.pace}
- Recent Performance: ${userContext.lastPerformance?.map(p => 
    `${p.subject}: ${p.score}% (${new Date(p.date).toLocaleDateString()})`
  ).join(', ')}`
        }] : []),
        ...messages
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: contextualizedMessages,
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  },

  async generateLearningPlan(
    userContext: UserContext,
    timeframe: number = 4 // weeks
  ) {
    try {
      const prompt = `Based on the following user context, create a ${timeframe}-week learning plan:
- Strengths: ${userContext.strengths?.join(', ')}
- Weaknesses: ${userContext.weaknesses?.join(', ')}
- Learning Style: ${userContext.learningStyle}
- Pace: ${userContext.pace}
- Recent Performance: ${userContext.lastPerformance?.map(p => 
    `${p.subject}: ${p.score}% (${new Date(p.date).toLocaleDateString()})`
  ).join(', ')}

Create a structured plan that includes:
1. Weekly topics for each subject
2. Recommended study hours
3. Specific goals and milestones
4. Focus areas based on weaknesses
5. Practice recommendations

Format the response as a JSON object with the following structure:
{
  weeks: [{
    week: number,
    topics: [{
      subject: string,
      topics: string[],
      recommendedHours: number
    }],
    goals: string[]
  }]
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating learning plan:', error);
      throw error;
    }
  }
}; 