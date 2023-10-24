// @ts-expect-error nitro aliases aren't registered
import { useRuntimeConfig } from '#internal/nitro'
import { Octokit } from '@octokit/core'

let octokit = null

export const ghClient = () => {
  const config = useRuntimeConfig()
  const gh = config.feedback.github
  console.log('gh-secrets', gh)
  if (!octokit) {
    octokit = new Octokit({
      auth: gh.api_key,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
  return octokit
}
