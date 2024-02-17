// @ts-expect-error nitro aliases aren't registered
import { defineEventHandler, readFormData } from 'h3'
import { createTrelloCard, addImageToCard } from '../utils/createTrelloCard'

const cardName = 'Testing Progromatic Image Upload'
const cardDesc = 'Card description blah blah blah'

export default defineEventHandler(async (event) => {
  console.log('hello from api')

  // const form = await readMultipartFormData(event);
  const form = await readFormData(event)
  console.log('workingUpload', form)

  if (!form) return console.log('no form data')

  createTrelloCard(cardName, cardDesc)
    .then((card) => {
      console.log('Card created:', card)
      return addImageToCard(card.id, form)
    })
    .then((attachment) => {
      console.log('Image attached:', attachment)
    })
    .catch((error) => {
      console.error('An error occurred:', error)
    })

  // send image to server

  return {
    status: 200,
    message: 'success'
  }
})
