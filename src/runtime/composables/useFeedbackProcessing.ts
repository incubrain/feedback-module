import { Feedback, UserFeedback } from "../types/feedback";

export default function () {
  function createFeedback(userFeedback: UserFeedback) {
    // create feedback
    const newFeedback: Feedback = {
      title: userFeedback.data.title,
      body: userFeedback.data.body,
      user_id: userFeedback.data.user_id,
      votes_weighted: 0.0,
      gh_issue: "", // set null on supabase row entry
      status_id: 0,
      priority: 0,
      github_pr: "", // set null on supabase row entry
      size: 0,
      category_id: userFeedback.data.category_id,
      votes: 0, // set default 1 on supabase row entry
    };

    return newFeedback;
  }
}
