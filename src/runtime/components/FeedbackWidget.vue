<template>
  <div>
    <slot
      name="toggle"
      v-bind="toggle"
    />
    <USlideover
      v-model="isOpen"
      :ui="{ padding: 'p-4 lg:p-8' }"
    >
      <UForm
        class="flex flex-col gap-6"
        @submit="submitFeedback"
      >
        <slot name="cta" />
        <UInput
          v-model="feedback.title"
          placeholder="Title"
        />
        <UTextarea
          v-model="feedback.body"
          placeholder="Body"
        />
        <UButton type="submit"> Submit </UButton>
      </UForm>
    </USlideover>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useFeedback } from '../composables/useFeedback'
// !TODO: add validation and state https://ui.nuxt.com/forms/form

const isOpen = ref(false)
const feedback = reactive({
  title: '',
  body: ''
})

function toggle() {
  isOpen.value = !isOpen.value
}

function submitFeedback() {
  const fb = useFeedback()
  console.log('Submitting feedback:', feedback)
  try {
    fb.createFeedback(feedback)
    resetForm()
  } catch (error) {
    console.error('Error submitting feedback:', error)
  }
}

function resetForm() {
  Object.assign(feedback, {
    title: '',
    body: ''
  })
  isOpen.value = !isOpen.value
}
</script>

<style scoped></style>
