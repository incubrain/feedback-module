const project = `
  query {
    organization(login: "Incubrain"){
      projectV2(number: 2) {
        id
      }
    }
  }
`

// !TODO: this seems bloated and should be refactored if possible
const old = `
query ($projectId: ID!) {
  node(id: $projectId) {
      ... on ProjectV2 {
        items(first: 20) {
          nodes{
            id
            fieldValues(first: 8) {
              nodes{                
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldDateValue {
                  date
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2FieldCommon {
                      name
                    }
                  }
                }
              }              
            }
            content{              
              ...on PullRequest {
                title
                assignees(first: 10) {
                  nodes{
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
// Issues - https://docs.github.com/en/graphql/reference/objects#issue
// Issue Comments - https://docs.github.com/en/graphql/reference/objects#issuecomment
// Draft Issues - https://docs.github.com/en/graphql/reference/objects#draftissue
const projectIssues = `
query ($projectId: ID!) {
  node(id: $projectId) {
      ... on ProjectV2 {
        items(first: 20) {
          nodes{
            id
            content{              
              ...on Issue {
                title
                body
                closed
                createdAt
                updatedAt
                publishedAt
              }
              ... on DraftIssue {
                title
                body
                updatedAt
                createdAt
              }
            }
          }
        }
      }
    }
  }
`

export default {
  project,
  projectIssues
}
