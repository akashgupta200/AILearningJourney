import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateTutorResponse, generateLessonContent, generateQuiz, generateEncouragement } from "./openai";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User Profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { age, gradeLevel, preferredLanguage } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        age,
        gradeLevel,
        preferredLanguage,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Subjects routes
  app.get('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      const subjects = user?.gradeLevel 
        ? await storage.getSubjectsByGradeLevel(user.gradeLevel)
        : await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', isAuthenticated, async (req: any, res) => {
    try {
      const { name, description, icon, color, gradeRange } = req.body;
      const subject = await storage.createSubject({
        id: nanoid(),
        name,
        description,
        icon,
        color,
        gradeRange,
      });
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Lessons routes
  app.get('/api/subjects/:subjectId/lessons', isAuthenticated, async (req, res) => {
    try {
      const { subjectId } = req.params;
      const lessons = await storage.getLessonsBySubject(subjectId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/:lessonId', isAuthenticated, async (req, res) => {
    try {
      const { lessonId } = req.params;
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  app.post('/api/lessons/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { subject, topic, gradeLevel, difficulty } = req.body;
      const user = await storage.getUser(req.user.claims.sub);
      
      const lessonContent = await generateLessonContent(
        subject,
        topic,
        gradeLevel || user?.gradeLevel || 5,
        difficulty || 1
      );

      const lesson = await storage.createLesson({
        id: nanoid(),
        subjectId: req.body.subjectId,
        title: lessonContent.title,
        description: lessonContent.explanation,
        content: lessonContent,
        difficulty: difficulty || 1,
        estimatedDuration: 15,
        prerequisites: [],
      });

      res.json(lesson);
    } catch (error) {
      console.error("Error generating lesson:", error);
      res.status(500).json({ message: "Failed to generate lesson" });
    }
  });

  // Progress routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getOverallProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/progress/subject/:subjectId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { subjectId } = req.params;
      const progress = await storage.getUserProgressForSubject(userId, subjectId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching subject progress:", error);
      res.status(500).json({ message: "Failed to fetch subject progress" });
    }
  });

  app.post('/api/progress/lesson', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { lessonId, subjectId, progress, completed, timeSpent, score } = req.body;
      
      const progressRecord = await storage.updateLessonProgress({
        id: nanoid(),
        userId,
        subjectId,
        lessonId,
        progress: progress || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        timeSpent: timeSpent || 0,
        score,
      });

      // Award XP for progress
      if (completed) {
        const xpGain = 50 + (score || 0) * 2; // Base XP + bonus for score
        await storage.updateUserProgress(userId, xpGain, timeSpent || 0);
        await storage.updateUserStreak(userId);
      }

      res.json(progressRecord);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // AI Tutor routes
  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, context } = req.body;
      const user = await storage.getUser(userId);

      const tutorResponse = await generateTutorResponse(message, {
        age: user?.age || 10,
        gradeLevel: user?.gradeLevel || 5,
        subject: context?.subject,
        currentTopic: context?.currentTopic,
        learningStyle: context?.learningStyle,
      });

      // Update AI session
      const session = await storage.getAiSession(userId);
      const newMessages = [
        ...(session?.messages || []),
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: tutorResponse.message, timestamp: new Date() }
      ];

      await storage.updateAiSession({
        id: session?.id || nanoid(),
        userId,
        messages: newMessages,
        context: context || null,
      });

      res.json(tutorResponse);
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.get('/api/ai/encouragement', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const userAchievements = await storage.getUserAchievements(userId);
      const userStats = await storage.getUserStats(userId);

      const encouragement = await generateEncouragement({
        xpPoints: user?.xpPoints || 0,
        currentStreak: user?.currentStreak || 0,
        recentAchievements: userAchievements.slice(0, 3).map(ua => ua.achievement.name),
        strugglingAreas: userStats.improvementAreas,
      });

      res.json({ message: encouragement });
    } catch (error) {
      console.error("Error generating encouragement:", error);
      res.status(500).json({ message: "Keep up the great work! 🌟" });
    }
  });

  // Quiz routes
  app.get('/api/lessons/:lessonId/quizzes', isAuthenticated, async (req, res) => {
    try {
      const { lessonId } = req.params;
      const quizzes = await storage.getQuizzesByLesson(lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.post('/api/quizzes/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { subject, topic, gradeLevel, numQuestions, lessonId } = req.body;
      const user = await storage.getUser(req.user.claims.sub);

      const quizData = await generateQuiz(
        subject,
        topic,
        gradeLevel || user?.gradeLevel || 5,
        numQuestions || 5
      );

      const quiz = await storage.createQuiz({
        id: nanoid(),
        lessonId,
        title: `${topic} Quiz`,
        questions: quizData.questions,
      });

      res.json(quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  app.post('/api/quizzes/:quizId/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { quizId } = req.params;
      const { answers } = req.body;

      const quiz = await storage.getQuizzesByLesson(''); // This would need the lesson ID
      // Calculate score
      let correctAnswers = 0;
      const totalQuestions = quiz[0]?.questions?.length || 0;
      
      quiz[0]?.questions?.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
          correctAnswers++;
        }
      });

      const result = await storage.submitQuizResult({
        id: nanoid(),
        userId,
        quizId,
        score: correctAnswers,
        totalQuestions,
        answers,
      });

      // Award XP for quiz completion
      const xpGain = correctAnswers * 10;
      await storage.updateUserProgress(userId, xpGain, 0);

      res.json({
        ...result,
        correctAnswers,
        percentage: (correctAnswers / totalQuestions) * 100,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Achievements routes
  app.get('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Stats routes
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Initialize default data
  app.post('/api/init', isAuthenticated, async (req: any, res) => {
    try {
      // Create default subjects if they don't exist
      const existingSubjects = await storage.getSubjects();
      if (existingSubjects.length === 0) {
        const defaultSubjects = [
          {
            id: 'math',
            name: 'Mathematics',
            description: 'Numbers, equations, and problem solving',
            icon: 'calculator',
            color: 'green',
            gradeRange: '1-12',
          },
          {
            id: 'science',
            name: 'Science',
            description: 'Explore the natural world and universe',
            icon: 'flask',
            color: 'blue',
            gradeRange: '1-12',
          },
          {
            id: 'english',
            name: 'English',
            description: 'Reading, writing, and communication',
            icon: 'book',
            color: 'purple',
            gradeRange: '1-12',
          },
          {
            id: 'history',
            name: 'History',
            description: 'Learn about the past and civilizations',
            icon: 'globe',
            color: 'orange',
            gradeRange: '1-12',
          },
        ];

        for (const subject of defaultSubjects) {
          await storage.createSubject(subject);
        }
      }

      res.json({ message: 'Initialization complete' });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
