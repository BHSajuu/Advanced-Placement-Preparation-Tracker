import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDefaultMilestones = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("milestones")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      return; // Already created
    }

    const defaultMilestones = [
      {
        title: 'DSA Foundation',
        description: 'Complete 400 DSA problems',
        category: 'DSA' as const,
        target: 400,
        current: 0,
        xp: 500,
        completed: false
      },
      {
        title: 'Web Development Project',
        description: 'Build and deploy a full-stack application',
        category: 'Web Dev' as const,
        target: 1,
        current: 0,
        xp: 1000,
        completed: false
      },
      {
        title: 'System Design Mastery',
        description: 'Complete 10 system design case studies',
        category: 'System Design' as const,
        target: 1,
        current: 0,
        xp: 800,
        completed: false
      },
      {
        title: 'Mock Interview Champion',
        description: 'Complete 20 mock interviews with good feedback',
        category: 'Mock Interview' as const,
        target: 5,
        current: 0,
        xp: 600,
        completed: false
      },
      {
        title: 'Data Science Basics',
        description: 'Finish 50 data science tutorials',
        category: 'Data Science' as const,
        target: 50,
        current: 0,
        xp: 700,
        completed: false
      },
      {
        title: 'CS Fundamentals Core',
        description: 'Master 5 CS fundamentals topics',
        category: 'CS Fundamentals' as const,
        target: 5,
        current: 0,
        xp: 700,
        completed: false
      },
      {
        title: 'English Speaking Fluency',
        description: 'Complete 10 English speaking practice sessions',
        category: 'English Speaking Practice' as const,
        target: 10,
        current: 0,
        xp: 400,
        completed: false
      }
    ];

    for (const milestone of defaultMilestones) {
      await ctx.db.insert("milestones", {
        userId: args.userId,
        ...milestone,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getUserMilestones = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("milestones")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const updateMilestone = mutation({
  args: {
    milestoneId: v.id("milestones"),
    current: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.milestoneId, {
      current: args.current,
      completed: args.completed,
      updatedAt: Date.now(),
    });
  },
});