import { z } from 'zod'

export const newFeedbackSchema = z.object({
  title: z.string(),
  body: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export const oldFeedbackSchema = newFeedbackSchema.extend({
  votes_weighted: z.number(),
  gh_issue: z.string(),
  status_id: z.number(),
  priority: z.number(),
  github_pr: z.string(),
  size: z.number(),
  votes: z.number()
})

export const oldFeedbackArraySchema = z.array(newFeedbackSchema).nonempty()

export type OldFeedback = z.infer<typeof oldFeedbackSchema>
export type OldFeedbackArray = z.infer<typeof oldFeedbackArraySchema>
export type NewFeedback = z.infer<typeof newFeedbackSchema>
