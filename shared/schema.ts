import { z } from 'zod'

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  totalSavings: z.number().default(0),
  points: z.number().default(100),
  level: z.number().default(1),
  badges: z.array(z.string()).default([]),
  streak: z.number().default(0),
  joinDate: z.string().default(() => new Date().toISOString())
})

export const insertUserSchema = userSchema.omit({ id: true, joinDate: true })
export type User = z.infer<typeof userSchema>
export type InsertUser = z.infer<typeof insertUserSchema>

// Savings Goal schema
export const savingsGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  target: z.number(),
  current: z.number().default(0),
  dueDate: z.string(),
  icon: z.string().default('Target'),
  color: z.string().default('bg-blue-500'),
  createdAt: z.string().default(() => new Date().toISOString())
})

export const insertSavingsGoalSchema = savingsGoalSchema.omit({ id: true, userId: true, createdAt: true })
export type SavingsGoal = z.infer<typeof savingsGoalSchema>
export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>

// Challenge schema
export const challengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  progress: z.number().default(0),
  reward: z.number(),
  daysLeft: z.number(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'])
})

export type Challenge = z.infer<typeof challengeSchema>

// Badge schema
export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  earned: z.boolean().default(false),
  icon: z.string(),
  earnedDate: z.string().optional()
})

export type Badge = z.infer<typeof badgeSchema>

// Activity schema
export const activitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['savings', 'achievement', 'goal_completion']),
  amount: z.number().optional(),
  description: z.string(),
  timestamp: z.string().default(() => new Date().toISOString())
})

export type Activity = z.infer<typeof activitySchema>