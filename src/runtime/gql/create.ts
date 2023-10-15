const draftIssue = `mutation ($title: String!, $body: String!, $projectId: ID!) {
  addProjectV2DraftIssue(input: { projectId: $projectId, title: $title, body: $body }) {
    projectItem {
      id
    }
  }
}`


export default {
  draftIssue
}
