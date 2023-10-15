<template>
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between bg-green-700 text-white p-4 rounded-t-md">
        <h3 class="text-base font-semibold leading-6">{{ feedback.content.title }}</h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="isOpen = !isOpen"
        />
      </div>

      <DetailProperty
        label="ID"
        :value="feedback.id"
      />
      <DetailProperty
        label="Status"
        value="Status"
      />
      <DetailProperty
        label="Category"
        :badge-value="category"
        badge-color="blue"
      />
      <DetailProperty
        label="Priority"
        badge-value="Priority"
        badge-color="red"
      />
    </template>

    <div class="w-full mb-2">
      <span class="text-gray-800 dark:text-gray-400 mr-4">Description</span>
      <p class="text-sm text-gray-400 dark:text-gray-200 font-semibold">{{
        feedback.content.body
      }}</p>
    </div>

    <template #footer>
      <div class="mb-4">
        <span class="text-gray-800 dark:text-gray-400 mt-2">Comments coming soon</span>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { OldFeedback } from '../types/feedback'

const isOpen = ref(false)

const p = defineProps({
  feedback: {
    type: Object as OldFeedback,
    required: true
  }
})

// not good practice, we should preprocess the data somewhere
const category = computed(() => p.feedback.fieldValues.nodes[1]?.name || 'Draft')

</script>
