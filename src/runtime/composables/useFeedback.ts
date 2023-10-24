import { NewFeedback } from '../types/feedback'

export const useFeedback = () => {
  async function createFeedback(newFeedback: NewFeedback) {
    // !TODO: organizationId should be passed from module config
    console.log('New Feedback:', newFeedback)

    try {
      const data = await $fetch('/api/post-feedback', {
        method: 'POST',
        body: newFeedback
      })
      console.log('Data:', data)
    } catch (error) {
      console.error('Error creating draft issue:', error.message)
    }
  }

  async function getFeedback() {
    try {
      const response = await $fetch('/api/get-feedback', {
        method: 'GET'
      })
      console.log('Response:', response)
      return response || []
    } catch (error) {
      console.error('Error creating draft issue:', error.message)
    }
  }

  return {
    createFeedback,
    getFeedback
  }
}
