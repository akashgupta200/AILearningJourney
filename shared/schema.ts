import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  age: integer("age"),
  gradeLevel: integer("grade_level"),
  preferredLanguage: varchar("preferred_language").default("en"),
  xpPoints: integer("xp_points").default(0),
  currentStreak: integer("current_streak").default(0),
  totalStudyTime: integer("total_study_time").default(0), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  gradeRange: varchar("grade_range"), // e.g., "5-8", "9-12"
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey(),
  subjectId: varchar("subject_id").references(() => subjects.id),
  title: varchar("title").notNull(),
  description: text("description"),
  content: jsonb("content"), // Stores lesson content, videos, etc.
  difficulty: integer("difficulty").default(1), // 1-5
  estimatedDuration: integer("estimated_duration").default(15), // minutes
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  progress: real("progress").default(0), // 0-1 (0% to 100%)
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // minutes
  score: integer("score"), // quiz/assessment score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  condition: jsonb("condition"), // Criteria for earning achievement
  xpReward: integer("xp_reward").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  achievementId: varchar("achievement_id").references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const aiSessions = pgTable("ai_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  messages: jsonb("messages").$type<Array<{role: string, content: string, timestamp: Date}>>().default([]),
  context: jsonb("context"), // Current lesson, subject context
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey(),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  title: varchar("title").notNull(),
  questions: jsonb("questions").$type<Array<{
    question: string,
    options: string[],
    correctAnswer: number,
    explanation?: string
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userQuizResults = pgTable("user_quiz_results", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  quizId: varchar("quiz_id").references(() => quizzes.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: jsonb("answers").$type<number[]>().default([]),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
  aiSessions: many(aiSessions),
  quizResults: many(userQuizResults),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  lessons: many(lessons),
  progress: many(userProgress),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [lessons.subjectId],
    references: [subjects.id],
  }),
  progress: many(userProgress),
  quizzes: many(quizzes),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userProgress.subjectId],
    references: [subjects.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const aiSessionsRelations = relations(aiSessions, ({ one }) => ({
  user: one(users, {
    fields: [aiSessions.userId],
    references: [users.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  results: many(userQuizResults),
}));

export const userQuizResultsRelations = relations(userQuizResults, ({ one }) => ({
  user: one(users, {
    fields: [userQuizResults.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [userQuizResults.quizId],
    references: [quizzes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  earnedAt: true,
});

export const insertAiSessionSchema = createInsertSchema(aiSessions).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  createdAt: true,
});

export const insertUserQuizResultSchema = createInsertSchema(userQuizResults).omit({
  completedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type AiSession = typeof aiSessions.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type UserQuizResult = typeof userQuizResults.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertAiSession = z.infer<typeof insertAiSessionSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertUserQuizResult = z.infer<typeof insertUserQuizResultSchema>;
