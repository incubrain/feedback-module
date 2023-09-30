import { z } from "zod";

export const feedbackSubmittedSchema = z.object({
  title: z.string(),
  body: z.string(),
  user_id: z.string().optional(),
  category_id: z.number(),
});

export const feedbackSchema = feedbackSubmittedSchema.extend({
  created_at: z.string(),
  updated_at: z.string(),
  votes_weighted: z.number(),
  gh_issue: z.string(),
  status_id: z.number(),
  priority: z.number(),
  github_pr: z.string(),
  size: z.number(),
  votes: z.number(),
});

export type Feedback = z.infer<typeof feedbackSchema>;
export type FeedbackSubmitted = z.infer<typeof feedbackSubmittedSchema>;
