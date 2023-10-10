import { useRuntimeConfig } from "#imports";
import { Octokit } from "@octokit/core";
import { ref } from "vue";

export default function () {
  const user = ref(null);
  const config = useRuntimeConfig();
  const apiKey = config.public.feedback.ghApiKey;
  const octokit = new Octokit({
    auth: apiKey,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  async function getUser() {
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const {
      viewer: { login },
    } = await octokit.graphql(`{
      viewer {
        login
      }
    }`);

    console.log(`Hello, ${login}!`, login);
    user.value = login;
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
  }

  async function getProject() {
    try {
      const response = await await octokit.graphql(`query{
        organization(login: "Incubrain"){
          projectV2(number: 2) {
            id
          }
        }
      }`);

      console.log("Fetched project id successfully:", response);
    } catch (error) {
      console.error("Error fetching project id:", error.message);
    }
  }

  async function createDraftIssue(title: string, body: string) {
    const variables = {
      title: title,
      body: body,
    };
    try {
      const response = await octokit.graphql(
        `mutation($title: String!, $body: String!) {
          addProjectV2DraftIssue(input: {projectId: "PVT_kwDOBtC2ps4AWJcL", title: $title, body: $body}) {
              projectItem {
                  id
              }
          }
        }
      `,
        variables
      );

      console.log("Project Item ID:", response);
    } catch (error) {
      console.error("Error creating draft issue:", error.message);
    }
  }

  async function getAllCards() {
    try {
      const response = await octokit.graphql(
        `
        query{
            node(id: "PVT_kwDOBtC2ps4AWJcL") {
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
      );
      // Process the GraphQL response into the desired format
      const cards = response?.node?.items?.nodes || [];
      console.log("Cards:", cards);

      const formattedCards = cards.map((card) => {
        const { title, body } = card.content || {};
        const statusField = card.fieldValues?.nodes[1];

        const status = statusField?.name || "Unknown"; // Replace "Unknown" with a default value if needed

        return { title, body, status };
      });

      console.log("Formatted Cards:", formattedCards);

      return response.node.items.nodes;
    } catch (error) {
      console.error("Error creating draft issue:", error.message);
    }
  }

  return {
    user,
    getUser,
    getProject,
    createDraftIssue,
    getAllCards,
  };
}
