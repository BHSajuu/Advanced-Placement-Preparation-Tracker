import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdateGoals = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userGoals")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const goalData = {
      userId: args.userId,
      dsaQuestions: args.dsaQuestions,
      dsaTopics: args.dsaTopics,
      webDevProjects: args.webDevProjects,
      systemDesignCases: args.systemDesignCases,
      mockInterviews: args.mockInterviews,
      dataScienceTutorials: args.dataScienceTutorials,
      dataScienceTopics: args.dataScienceTopics,
      csFundamentalsChapters: args.csFundamentalsChapters,
      englishSpeakingSessions: args.englishSpeakingSessions,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, goalData);
      return existing._id;
    } else {
      return await ctx.db.insert("userGoals", goalData);
    }
  },
});

export const getUserGoals = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userGoals")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});