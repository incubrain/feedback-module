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
const projectIssues = `
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
              ... on DraftIssue {
                title
                body
              }
              ...on Issue {
                title
                assignees(first: 10) {
                  nodes{
                    login
                  }
                }
              }
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

export default {
  project,
  projectIssues
}
