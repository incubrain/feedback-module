import { useRuntimeConfig } from '#imports'
import gqlCreate from '../gql/create'
import gqlQuery from '../gql/query'
import { NewFeedback } from '../types/feedback'
import { Octokit } from '@octokit/core'
import { ref } from 'vue'

const octokit = ref(null)

export const useFeedback = () => {
  const config = useRuntimeConfig()
  const gh = config.public.feedback.github
  if (!octokit.value) {
    octokit.value = new Octokit({
      auth: gh.api_key,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  async function getProject() {
    // !TODO: organizationId should be passed from module config
    // !TODO: projectId should be passed from module config
    try {
      const response = await octokit.value.graphql(gqlQuery.project, {
        projectId: gh.project_id
      })

      console.log('Fetched project id successfully:', response)
    } catch (error) {
      console.error('Error fetching project id:', error.message)
    }
  }

  async function createFeedback(newFeedback: NewFeedback) {
    // !TODO: organizationId should be passed from module config
    console.log('New Feedback:', newFeedback)
    const variables = {
      title: newFeedback.title,
      body: newFeedback.body
    }
    console.log('New Feedback Variables', variables)
    try {
      const response = await octokit.value.graphql(gqlCreate.draftIssue, variables)

      console.log('New Feedback Created, ID:', response)
    } catch (error) {
      console.error('Error creating draft issue:', error.message)
    }
  }

  async function getFeedback() {
    try {
      console.log('Project ID:', gh.project_id)
      const response = await octokit.value.graphql(gqlQuery.projectIssues, {
        projectId: gh.project_id
      })
      console.log('Project Item ID:', response.node.items.nodes)
      const cards = response?.node?.items?.nodes || []
      console.log('Cards:', cards)

      const formattedCards = cards.map((card) => {
        const { title, body } = card.content || {}
        const statusField = card.fieldValues?.nodes[1]

        const status = statusField?.name || 'Unknown' // Replace "Unknown" with a default value if needed

        return { title, body, status }
      })

      console.log('Formatted Cards:', formattedCards)
      return response.node.items.nodes
    } catch (error) {
      console.error('Error creating draft issue:', error.message)
    }
  }

  return {
    getProject,
    createFeedback,
    getFeedback
  }
}
