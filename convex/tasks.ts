import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
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
    questionsCount: v.optional(v.number()),
    dsaTopicName: v.optional(v.string()),
    dataScienceTopicName: v.optional(v.string()),
    projectName: v.optional(v.string()),
    caseStudyName: v.optional(v.string()),
    tutorialCount: v.optional(v.number()),
    sessionCount: v.optional(v.number()),
    chapterName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      userId: args.userId,
      title: args.title,
      category: args.category,
      timeSlot: args.timeSlot,
      xp: args.xp,
      completed: false,
      createdAt: Date.now(),
      questionsCount: args.questionsCount,
      dsaTopicName: args.dsaTopicName,
      dataScienceTopicName: args.dataScienceTopicName,
      projectName: args.projectName,
      caseStudyName: args.caseStudyName,
      tutorialCount: args.tutorialCount,
      sessionCount: args.sessionCount,
      chapterName: args.chapterName,
    });
  },
});

export const getUserTasks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const toggleTask = mutation({
  args: {
    taskId: v.id("tasks"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      completed: args.completed,
      completedAt: args.completed ? Date.now() : undefined,
    });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});