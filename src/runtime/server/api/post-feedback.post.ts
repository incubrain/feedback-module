// @ts-expect-error nitro aliases aren't registered
import { useRuntimeConfig } from '#internal/nitro'
import { defineEventHandler, readBody, createError } from 'h3'
import { ghClient } from '../utils/ghClient'
import gqlCreate from '../../gql/create'

export default defineEventHandler(async (event) => {
  const newFeedback = await readBody(event)
  console.log('Enquiry:', newFeedback)
    const gh = useRuntimeConfig().feedback.github

  const client = ghClient()
  const variables = {
    title: newFeedback.title,
    body: newFeedback.body,
    projectId: gh.project_id
  }
  // Validate the incoming data

  try {
    const response = await client.graphql(gqlCreate.draftIssue, variables)

    console.log('New Feedback Created, ID:', response)

    return {
      status: 200,
      message: 'Enquiry received and stored'
    }
  } catch (error: any) {
    throw createError({
      message: error.message,
      statusCode: 404
    })
  }
})
