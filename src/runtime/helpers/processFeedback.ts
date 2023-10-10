import { OldFeedback, NewFeedback } from '../types/feedback'

export default function () {
  function createFeedback(newFeedback: NewFeedback) {
    // create feedback
    const fb: OldFeedback = {
      title: newFeedback.title,
      body: newFeedback.body,
      user_id: newFeedback.user_id,
      votes_weighted: 0.0,
      gh_issue: '', // set null on supabase row entry
      status_id: 0,
      priority: 0,
      github_pr: '', // set null on supabase row entry
      size: 0,
      category_id: newFeedback.category_id,
      votes: 0 // set default 1 on supabase row entry
    }

    return fb
  }
}
