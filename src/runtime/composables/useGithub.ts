import { useRuntimeConfig } from "#imports";
import { Octokit } from "@octokit/core";
import { ref } from "vue";

export default function () {
  const user = ref(null);
  const config = useRuntimeConfig();

  async function getUser() {
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const apiKey = config.public.feedback.ghApiKey;
    if (!apiKey)
      return console.error(
        "ghApiKey is not configured in nuxt.config, defaults to .env GH_API_KEY"
      );
    console.log("feedback config", apiKey);
    const octokit = new Octokit({
      auth: apiKey,
    });
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

  return {
    user,
    getUser,
  };
}
