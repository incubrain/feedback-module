import { z } from "zod";

export const userFeedbackSchema = z.object({
  title: z.string(),
  body: z.string(),
  user_id: z.string().optional(),
  category_id: z.number(),
});

export const feedbackSchema = userFeedbackSchema.extend({
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  votes_weighted: z.number(),
  gh_issue: z.string(),
  status_id: z.number(),
  priority: z.number(),
  github_pr: z.string(),
  size: z.number(),
  votes: z.number(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
export type UserFeedback = z.infer<typeof userFeedbackSchema>;
