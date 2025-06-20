import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdateProgress = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const progressData = {
      userId: args.userId,
      totalXP: args.totalXP,
      level: args.level,
      currentStreak: args.currentStreak,
      longestStreak: args.longestStreak,
      completedTasks: args.completedTasks,
      dailyHistory: args.dailyHistory,
      dsaQuestionsHistory: args.dsaQuestionsHistory,
      dsaTopicsProgress: args.dsaTopicsProgress,
      dsTopicProgress: args.dsTopicProgress,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, progressData);
      return existing._id;
    } else {
      return await ctx.db.insert("userProgress", progressData);
    }
  },
});

export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});