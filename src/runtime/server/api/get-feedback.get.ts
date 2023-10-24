// @ts-expect-error nitro aliases aren't registered
import { useStorage } from '#imports'
import { snapshot } from 'unstorage'
import { defineEventHandler, createError } from 'h3'
import { ghClient } from '../utils/ghClient'
import gqlQuery from '../../gql/query'
import { oldFeedbackArraySchema } from '../../types/feedback'

export default defineEventHandler(async () => {
  console.log('Get Feedback:')
  // const gh = useRuntimeConfig().feedback.github
  // const client = ghClient()
  const storage = useStorage('feedback')
  // Validate the incoming data

  try {
    const data = await snapshot(storage)
    console.log('snapshot', data)
    const feedbackArray = []
    Object.keys(data).forEach((key) => {
      console.log('key', key, data[key])
      feedbackArray.push(data[key])
    })
    console.log('feedbackArray', feedbackArray)
    // const response = await client.graphql(gqlQuery.projectIssues, {
    //   projectId: gh.project_id
    // })
    // const cards = response?.node?.items?.nodes || []

    // const formattedCards = cards.map((card) => {
    //   return card.content
    // })

    return {
      status: 200,
      message: 'Feedback Fetched',
      body: feedbackArray
      // body: oldFeedbackArraySchema.parse(formattedCards)
    }
  } catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: 404
    })
  }
})
