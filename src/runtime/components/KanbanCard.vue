<template>
  <div
    class="dark:bg-white/10 bg-gray-200 p-4 my-4 rounded-md cursor-pointer"
    @click="isOpen = true"
  >
    <div class="flex justify-between">
      <h3 class="text-sm font-semibold text-black dark:text-white">{{ feedback.content.title }}</h3>
    </div>

    <div>
      <UModal v-model="isOpen">
        <KanbanModal :feedback="feedback" />
      </UModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { OldFeedback } from '../types/feedback'
import KanbanModal from './KanbanModal.vue'

const isOpen = ref(false)

defineProps({
  feedback: {
    type: Object as OldFeedback,
    required: true
  }
})

</script>
