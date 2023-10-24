// @ts-expect-error nitro aliases aren't registered
import { useRuntimeConfig } from '#internal/nitro'
import { defineEventHandler, createError } from 'h3'
import { ghClient } from '../utils/ghClient'
import gqlQuery from '../../gql/query'
import { oldFeedbackArraySchema } from '../../types/feedback'

export default defineEventHandler(async () => {
  console.log('Get Feedback:')
  const gh = useRuntimeConfig().feedback.github
  const client = ghClient()
  // Validate the incoming data

  try {
    console.log('Project ID:', gh.project_id)
    const response = await client.graphql(gqlQuery.projectIssues, {
      projectId: gh.project_id
    })
    const cards = response?.node?.items?.nodes || []

    const formattedCards = cards.map((card) => {
      console.log('Card:', card)
      return card.content
    })

    return {
      status: 200,
      message: 'Feedback Fetched',
      body: oldFeedbackArraySchema.parse(formattedCards)
    }
  } catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: 404
    })
  }
})
