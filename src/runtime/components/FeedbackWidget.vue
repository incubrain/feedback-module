<template>
  <div class="w-full h-full">
    <div
      class="fixed top-2 right-2 md:top-4 md:right-4 z-50 bg-gray-100 dark:bg-gray-950 rounded-md p-2"
    >
      <div class="flex flex-col justify-end gap-2">
        <button
          @click="isOpen = !isOpen"
          class="icon-tool text-sm flex justify-center items-center gap-2"
        >
          <UIcon name="i-heroicons-cog-6-tooth-20-solid" />
          {{ !userDetailsCookie ? 'please update' : 'completed' }}
        </button>
        <UModal v-model="isOpen">
          <div class="p-4 flex flex-col gap-2">
            <input
              v-model="userDetails.github"
              placeholder="GitHub Username"
              class="px-2 py-1"
            />
            <div class="flex gap-2">
              <button
                @click="updateUserDetails"
                class="icon-tool"
              >
                Save Details
              </button>
              <button
                @click="clearUserDetails"
                class="icon-tool"
              >
                Clear Details
              </button>
            </div>
          </div>
        </UModal>
        <USelectMenu
          v-model="newFeedback.category"
          :options="categories"
          placeholder="Select Category"
          value-attribute="id"
          option-attribute="label"
        />
        <UInput
          color="white"
          variant="outline"
          placeholder="Title"
          v-model="newFeedback.title"
          minlength="5"
        />

        <UTextarea
          color="white"
          variant="outline"
          autoresize
          placeholder="More information"
          v-model="newFeedback.body"
          minlength="200"
        />

        <div class="flex gap-2">
          <button
            class="icon-tool"
            @click="toggleCanvas"
          >
            <UIcon name="i-heroicons-paint-brush-16-solid" />
          </button>
          <UButton
            @click="addFeedback(newFeedback)"
            label="Submit"
            color="white"
          />
        </div>
      </div>
    </div>

    <FeedbackCanvas v-show="canvasVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import FeedbackCanvas from './FeedbackCanvas.vue'
import { useCookie } from '#imports'
import useFeedback from '../composables/useFeedback'

const isOpen = ref(false)
const canvasVisible = ref(false)

const categories = [
  { id: 'bug', label: 'Report a Bug' },
  { id: 'feature', label: 'Feature Request' },
  { id: 'idea', label: 'Submit an Idea' },
  { id: 'performance', label: 'Performance Issue' },
  { id: 'usability', label: 'Usability Issue' },
  { id: 'accessibility', label: 'Accessibility Concern' },
  { id: 'design', label: 'Design Feedback' },
  { id: 'content', label: 'Content Suggestion' },
  { id: 'other', label: 'Other Feedback' }
]

const toggleCanvas = () => {
  console.log('toggling canvas')
  canvasVisible.value = !canvasVisible.value
}

const newFeedback = reactive({
  title: '',
  body: '',
  category: ''
})

const { addFeedback } = useFeedback()

const userDetails = ref({
  github: ''
})

// Use useCookie to manage the cookie for storing user details
const userDetailsCookie = useCookie('userDetails', {
  encode: JSON.stringify,
  decode: JSON.parse
})

// Load existing user details from the cookie
if (userDetailsCookie.value) {
  userDetails.value = userDetailsCookie.value
}

// Function to update user details and save them to the cookie
function updateUserDetails() {
  userDetailsCookie.value = userDetails.value
}

// Function to clear user details both from reactive state and cookie
function clearUserDetails() {
  userDetails.value = { github: '' }
  userDetailsCookie.value = null // Clear the cookie
}

//
</script>

<style>
.html {
  margin-top: 0 !important;
}
</style>
