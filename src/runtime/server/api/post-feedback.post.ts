// @ts-expect-error nitro aliases aren't registered
import { useStorage } from '#imports'
import { defineEventHandler, readBody, createError } from 'h3'
import { ghClient } from '../utils/ghClient'
import gqlCreate from '../../gql/create'

interface Feedback {
  title: string
  body: string
}

export default defineEventHandler(async (event) => {
  const newFeedback = await readBody(event)
  console.log('Enquiry:', newFeedback)
  // const gh = useRuntimeConfig().feedback.github
  // const client = ghClient()
  // const variables = {
  //   title: newFeedback.title,
  //   body: newFeedback.body,
  //   projectId: gh.project_id
  // }
  // Validate the incoming data
  const storage = useStorage('feedback')
  console.log('storage', storage)
  try {
    const doesFeedbackExist = await storage.hasItem<Feedback[]>('test')
    if (!doesFeedbackExist) {
      await storage.setItem<Feedback[]>('test', [newFeedback])
    } else {
      const currentFeedback = await storage.getItem<Feedback[]>('test')
      currentFeedback.push(newFeedback)
      await storage.setItem<Feedback[]>('test', currentFeedback)
    }
    // const response = await client.graphql(gqlCreate.draftIssue, variables)

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
