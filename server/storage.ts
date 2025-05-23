import {
  users,
  subjects,
  lessons,
  userProgress,
  achievements,
  userAchievements,
  aiSessions,
  quizzes,
  userQuizResults,
  type User,
  type UpsertUser,
  type Subject,
  type InsertSubject,
  type Lesson,
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type AiSession,
  type InsertAiSession,
  type Quiz,
  type InsertQuiz,
  type UserQuizResult,
  type InsertUserQuizResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProgress(userId: string, xpGain: number, studyTime: number): Promise<void>;
  updateUserStreak(userId: string): Promise<void>;

  // Subject operations
  getSubjects(): Promise<Subject[]>;
  getSubjectsByGradeLevel(gradeLevel: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Lesson operations
  getLessonsBySubject(subjectId: string): Promise<Lesson[]>;
  getLesson(lessonId: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForSubject(userId: string, subjectId: string): Promise<UserProgress[]>;
  updateLessonProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getOverallProgress(userId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    totalXP: number;
    subjectProgress: Array<{
      subjectId: string;
      subjectName: string;
      progress: number;
      completedLessons: number;
      totalLessons: number;
    }>;
  }>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<Array<UserAchievement & { achievement: Achievement }>>;
  checkAndAwardAchievements(userId: string): Promise<UserAchievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // AI Session operations
  getAiSession(userId: string): Promise<AiSession | undefined>;
  updateAiSession(session: InsertAiSession): Promise<AiSession>;

  // Quiz operations
  getQuizzesByLesson(lessonId: string): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getUserQuizResults(userId: string): Promise<Array<UserQuizResult & { quiz: Quiz }>>;
  submitQuizResult(result: InsertUserQuizResult): Promise<UserQuizResult>;

  // Analytics
  getUserStats(userId: string): Promise<{
    totalStudyTime: number;
    averageScore: number;
    strongSubjects: string[];
    improvementAreas: string[];
    weeklyProgress: Array<{ date: string; lessonsCompleted: number; xpGained: number }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProgress(userId: string, xpGain: number, studyTime: number): Promise<void> {
    await db
      .update(users)
      .set({
        totalXP: sql`${users.totalXP} + ${xpGain}`,
        totalStudyTime: sql`${users.totalStudyTime} + ${studyTime}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserStreak(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    
    let newStreak = 1;
    if (lastActive) {
      const diffTime = today.getTime() - lastActive.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak = (user.currentStreak || 0) + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else {
        newStreak = user.currentStreak || 1;
      }
    }

    await db
      .update(users)
      .set({
        currentStreak: newStreak,
        lastActiveDate: today,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubjectsByGradeLevel(gradeLevel: number): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(
        and(
          sql`${subjects.minGradeLevel} <= ${gradeLevel}`,
          sql`${subjects.maxGradeLevel} >= ${gradeLevel}`
        )
      );
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(subjectData).returning();
    return subject;
  }

  // Lesson operations
  async getLessonsBySubject(subjectId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.subjectId, subjectId))
      .orderBy(lessons.orderIndex);
  }

  async getLesson(lessonId: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId));
    return lesson;
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.completedAt));
  }

  async getUserProgressForSubject(userId: string, subjectId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(lessons.subjectId, subjectId)
        )
      )
      .orderBy(desc(userProgress.completedAt));
  }

  async updateLessonProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(progressData)
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          ...progressData,
          completedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  async getOverallProgress(userId: string): Promise<{
    totalLessons: number;
    completedLessons: number;
    totalXP: number;
    subjectProgress: Array<{
      subjectId: string;
      subjectName: string;
      progress: number;
      completedLessons: number;
      totalLessons: number;
    }>;
  }> {
    // Get user's total XP
    const user = await this.getUser(userId);
    const totalXP = user?.totalXP || 0;

    // Get all lessons count
    const [totalLessonsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons);
    const totalLessons = totalLessonsResult.count;

    // Get completed lessons count
    const [completedLessonsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    const completedLessons = completedLessonsResult.count;

    // Get subject progress
    const subjectProgress = await db
      .select({
        subjectId: subjects.id,
        subjectName: subjects.name,
        totalLessons: sql<number>`count(${lessons.id})`,
        completedLessons: sql<number>`count(${userProgress.id})`,
      })
      .from(subjects)
      .leftJoin(lessons, eq(lessons.subjectId, subjects.id))
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        )
      )
      .groupBy(subjects.id, subjects.name);

    return {
      totalLessons,
      completedLessons,
      totalXP,
      subjectProgress: subjectProgress.map(sp => ({
        subjectId: sp.subjectId,
        subjectName: sp.subjectName,
        progress: sp.totalLessons > 0 ? (sp.completedLessons / sp.totalLessons) * 100 : 0,
        completedLessons: sp.completedLessons,
        totalLessons: sp.totalLessons,
      })),
    };
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<Array<UserAchievement & { achievement: Achievement }>> {
    const results = await db
      .select()
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));

    return results.map(result => ({
      ...result.user_achievements,
      achievement: result.achievements,
    }));
  }

  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    // Simple achievement checking logic
    const user = await this.getUser(userId);
    if (!user) return [];

    const newAchievements: UserAchievement[] = [];
    
    // Check for XP milestones
    const xpMilestones = [100, 500, 1000, 5000];
    for (const milestone of xpMilestones) {
      if ((user.totalXP || 0) >= milestone) {
        const achievementName = `XP Master ${milestone}`;
        
        // Check if user already has this achievement
        const existing = await db
          .select()
          .from(userAchievements)
          .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
          .where(
            and(
              eq(userAchievements.userId, userId),
              eq(achievements.name, achievementName)
            )
          );

        if (existing.length === 0) {
          // Award the achievement
          const [achievement] = await db
            .select()
            .from(achievements)
            .where(eq(achievements.name, achievementName));

          if (achievement) {
            const [newAchievement] = await db
              .insert(userAchievements)
              .values({
                userId,
                achievementId: achievement.id,
                earnedAt: new Date(),
              })
              .returning();
            newAchievements.push(newAchievement);
          }
        }
      }
    }

    return newAchievements;
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db.insert(achievements).values(achievementData).returning();
    return achievement;
  }

  // AI Session operations
  async getAiSession(userId: string): Promise<AiSession | undefined> {
    const [session] = await db
      .select()
      .from(aiSessions)
      .where(eq(aiSessions.userId, userId))
      .orderBy(desc(aiSessions.updatedAt))
      .limit(1);
    return session;
  }

  async updateAiSession(sessionData: InsertAiSession): Promise<AiSession> {
    const [session] = await db
      .insert(aiSessions)
      .values(sessionData)
      .onConflictDoUpdate({
        target: aiSessions.userId,
        set: {
          ...sessionData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return session;
  }

  // Quiz operations
  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId));
  }

  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(quizData).returning();
    return quiz;
  }

  async getUserQuizResults(userId: string): Promise<Array<UserQuizResult & { quiz: Quiz }>> {
    const results = await db
      .select()
      .from(userQuizResults)
      .innerJoin(quizzes, eq(userQuizResults.quizId, quizzes.id))
      .where(eq(userQuizResults.userId, userId))
      .orderBy(desc(userQuizResults.completedAt));

    return results.map(result => ({
      ...result.user_quiz_results,
      quiz: result.quizzes,
    }));
  }

  async submitQuizResult(resultData: InsertUserQuizResult): Promise<UserQuizResult> {
    const [result] = await db.insert(userQuizResults).values(resultData).returning();
    return result;
  }

  // Analytics
  async getUserStats(userId: string): Promise<{
    totalStudyTime: number;
    averageScore: number;
    strongSubjects: string[];
    improvementAreas: string[];
    weeklyProgress: Array<{ date: string; lessonsCompleted: number; xpGained: number }>;
  }> {
    const user = await this.getUser(userId);
    const totalStudyTime = user?.totalStudyTime || 0;

    // Calculate average quiz score
    const quizResults = await this.getUserQuizResults(userId);
    const averageScore = quizResults.length > 0 
      ? quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length 
      : 0;

    // Simple mock data for subjects and weekly progress
    const strongSubjects = ["Mathematics", "Science"];
    const improvementAreas = ["History", "Literature"];
    
    const weeklyProgress: Array<{ date: string; lessonsCompleted: number; xpGained: number }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weeklyProgress.push({
        date: date.toISOString().split('T')[0],
        lessonsCompleted: Math.floor(Math.random() * 5),
        xpGained: Math.floor(Math.random() * 100),
      });
    }

    return {
      totalStudyTime,
      averageScore,
      strongSubjects,
      improvementAreas,
      weeklyProgress,
    };
  }
}

export const storage = new DatabaseStorage();