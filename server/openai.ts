import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface TutorResponse {
  message: string;
  suggestions: string[];
  encouragement: string;
  nextTopics: string[];
}

export interface LessonContent {
  title: string;
  explanation: string;
  examples: Array<{
    problem: string;
    solution: string;
    explanation: string;
  }>;
  keyPoints: string[];
  practiceQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export interface QuizGeneration {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: number;
  }>;
}

export async function generateTutorResponse(
  message: string,
  context: {
    age: number;
    gradeLevel: number;
    subject?: string;
    currentTopic?: string;
    learningStyle?: string;
  }
): Promise<TutorResponse> {
  try {
    const prompt = `You are Professor Luna, a friendly and encouraging AI tutor for a ${context.age}-year-old student in grade ${context.gradeLevel}. 
    
Current context:
- Subject: ${context.subject || 'General'}
- Topic: ${context.currentTopic || 'General learning'}
- Student message: "${message}"

Please respond as a caring tutor would, with:
- Age-appropriate language and examples
- Encouraging and supportive tone
- Clear explanations
- Practical suggestions for learning

Respond in JSON format with: message, suggestions (array of 3 learning tips), encouragement (motivational phrase), nextTopics (array of 3 related topics to explore).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Professor Luna, a friendly AI tutor who specializes in making learning fun and accessible for children aged 5-16. Always respond in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'm here to help you learn! What would you like to explore today?",
      suggestions: result.suggestions || ["Take breaks while studying", "Practice regularly", "Ask questions when confused"],
      encouragement: result.encouragement || "You're doing great! Keep up the excellent work! 🌟",
      nextTopics: result.nextTopics || ["Review basics", "Try practice exercises", "Explore related concepts"]
    };
  } catch (error) {
    console.error("Error generating tutor response:", error);
    return {
      message: "I'm having trouble connecting right now. Let's try again in a moment!",
      suggestions: ["Check your internet connection", "Try asking a simpler question", "Take a short break"],
      encouragement: "Don't worry, we'll figure this out together! 💪",
      nextTopics: ["Review previous lesson", "Try a different approach", "Ask for help"]
    };
  }
}

export async function generateLessonContent(
  subject: string,
  topic: string,
  gradeLevel: number,
  difficulty: number = 1
): Promise<LessonContent> {
  try {
    const prompt = `Create a comprehensive lesson on "${topic}" for ${subject} at grade ${gradeLevel} level (difficulty ${difficulty}/5).

Include:
- Clear title
- Age-appropriate explanation
- 2-3 practical examples with solutions
- 4-5 key learning points
- 3-4 practice questions with multiple choice answers

Make it engaging and educational for students aged ${gradeLevel + 5} years old.

Respond in JSON format with: title, explanation, examples (array with problem/solution/explanation), keyPoints (array), practiceQuestions (array with question/options/correctAnswer/explanation).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer creating engaging educational content for children. Always respond in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || `${topic} - ${subject}`,
      explanation: result.explanation || "This lesson will help you understand the basics.",
      examples: result.examples || [],
      keyPoints: result.keyPoints || [],
      practiceQuestions: result.practiceQuestions || []
    };
  } catch (error) {
    console.error("Error generating lesson content:", error);
    throw new Error("Failed to generate lesson content");
  }
}

export async function generateQuiz(
  subject: string,
  topic: string,
  gradeLevel: number,
  numQuestions: number = 5
): Promise<QuizGeneration> {
  try {
    const prompt = `Create a ${numQuestions}-question quiz on "${topic}" for ${subject} at grade ${gradeLevel} level.

Requirements:
- Age-appropriate questions for ${gradeLevel + 5} year olds
- Multiple choice with 4 options each
- Mix of difficulty levels (1-3)
- Clear explanations for correct answers
- Educational and engaging content

Respond in JSON format with: questions (array with question/options/correctAnswer/explanation/difficulty).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating assessment materials for children. Always respond in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      questions: result.questions || []
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}

export async function generateEncouragement(
  userProgress: {
    xpPoints: number;
    currentStreak: number;
    recentAchievements: string[];
    strugglingAreas?: string[];
  }
): Promise<string> {
  try {
    const prompt = `Generate an encouraging message for a student with:
    - XP Points: ${userProgress.xpPoints}
    - Learning Streak: ${userProgress.currentStreak} days
    - Recent Achievements: ${userProgress.recentAchievements.join(', ')}
    ${userProgress.strugglingAreas ? `- Areas to improve: ${userProgress.strugglingAreas.join(', ')}` : ''}

    Create a personalized, motivating message that celebrates their progress and encourages continued learning.

    Respond in JSON format with: message`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Professor Luna, an encouraging AI tutor who celebrates student achievements and motivates continued learning. Always respond in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.message || "You're doing amazing! Keep up the great work! 🌟";
  } catch (error) {
    console.error("Error generating encouragement:", error);
    return "You're doing great! Keep learning and growing! 🚀";
  }
}
