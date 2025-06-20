import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    startDate: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  userGoals: defineTable({
    userId: v.string(),
    dsaQuestions: v.number(),
    dsaTopics: v.array(v.object({
      name: v.string(),
      targetQuestions: v.number(),
    })),
    webDevProjects: v.array(v.string()),
    systemDesignCases: v.array(v.string()),
    mockInterviews: v.number(),
    dataScienceTutorials: v.number(),
    dataScienceTopics: v.array(v.object({
      name: v.string(),
      targetTutorials: v.number(),
    })),
    csFundamentalsChapters: v.array(v.string()),
    englishSpeakingSessions: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  userProgress: defineTable({
    userId: v.string(),
    totalXP: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    completedTasks: v.number(),
    dailyHistory: v.object({}),
    dsaQuestionsHistory: v.object({}),
    dsaTopicsProgress: v.object({}),
    dsTopicProgress: v.object({}),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    category: v.union(
      v.literal("DSA"),
      v.literal("Web Dev"),
      v.literal("Data Science"),
      v.literal("CS Fundamentals"),
      v.literal("System Design"),
      v.literal("Mock Interview"),
      v.literal("English Speaking Practice")
    ),
    timeSlot: v.union(
      v.literal("Morning"),
      v.literal("Afternoon"),
      v.literal("Evening")
    ),
    xp: v.number(),
    completed: v.boolean(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    questionsCount: v.optional(v.number()),
    dsaTopicName: v.optional(v.string()),
    dataScienceTopicName: v.optional(v.string()),
    projectName: v.optional(v.string()),
    caseStudyName: v.optional(v.string()),
    tutorialCount: v.optional(v.number()),
    sessionCount: v.optional(v.number()),
    chapterName: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  milestones: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("DSA"),
      v.literal("Web Dev"),
      v.literal("Data Science"),
      v.literal("CS Fundamentals"),
      v.literal("System Design"),
      v.literal("Mock Interview"),
      v.literal("English Speaking Practice")
    ),
    target: v.number(),
    current: v.number(),
    xp: v.number(),
    completed: v.boolean(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  achievements: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("daily"),
      v.literal("milestone"),
      v.literal("streak"),
      v.literal("topic"),
      v.literal("xp")
    ),
    icon: v.string(),
    unlockedAt: v.number(),
  }).index("by_userId", ["userId"]),
});