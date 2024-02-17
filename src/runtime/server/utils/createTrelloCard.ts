import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const env = useRuntimeConfig().feedback

if (!env.TRELLO_API_KEY || !env.TRELLO_API_TOKEN || !env.TRELLO_LIST_ID) {
  throw new Error('Trello API keys are not set')
}

export const createTrelloCard = async (name: string, desc: string) => {
  const url = `https://api.trello.com/1/cards?key=${env.TRELLO_API_KEY}&token=${
    env.TRELLO_API_TOKEN
  }&idList=${env.TRELLO_LIST_ID}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}`

  const response = await $fetch(url, { method: 'POST' })

  if (!response) {
    throw new Error('Failed to create card')
  }

  return response // Returns the created card object
}

export const addImageToCard = async (cardId: string, form: FormData) => {
  const url = `https://api.trello.com/1/cards/${cardId}/attachments`

  form.append('key', env.TRELLO_API_KEY)
  form.append('token', env.TRELLO_API_TOKEN)

  const response = await $fetch(url, {
    method: 'POST',
    body: form
  })

  if (!response) {
    throw new Error('Failed to attach image')
  }

  return response // Returns the attachment object
}
