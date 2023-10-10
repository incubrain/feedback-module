<template>
  <div
    class="dark:bg-white/10 bg-gray-200 p-4 my-4 rounded-md cursor-pointer"
    @click="isOpen = true"
  >
    <div class="flex justify-between">
      <h3 class="text-sm font-semibold text-black dark:text-white">{{ feedback.content.title }}</h3>
    </div>

    <div>
      <UModal
        v-model="isOpen"
        prevent-close
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between bg-green-700 text-white p-4 rounded-t-md">
              <h3 class="text-base font-semibold leading-6">
                {{ feedback.content.title }}
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpen = false"
              />
            </div>
            <div class="mt-4 flex justify-between">
              <div class="w-1/2 mb-2">
                <span class="text-gray-800 dark:text-gray-400 mr-4">ID</span>
                <p class="text-sm text-gray-400 dark:text-gray-200 font-semibold">{{
                  feedback.id
                }}</p>
              </div>
              <div class="w-1/2 mb-2">
                <span class="text-gray-800 dark:text-gray-400 mr-4">Status</span>
                <p class="text-sm text-gray-400 dark:text-gray-200 font-semibold">Status</p>
              </div>
            </div>
            <div class="mt-2 flex justify-between">
              <div class="w-1/2 mb-2">
                <span class="text-gray-800 dark:text-gray-400 mr-4">Category</span>
                <UBadge
                  color="blue"
                  variant="soft"
                  class="font-semibold"
                >
                  {{ category }}
                </UBadge>
              </div>

              <div class="w-1/2 mb-2">
                <span class="text-gray-800 dark:text-gray-400 mr-4">Priority</span>
                <UBadge
                  color="red"
                  variant="soft"
                  class="font-semibold"
                >
                  Priority
                </UBadge>
              </div>
            </div>
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
      </UModal>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  props: {
    feedback: Object
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    category() {
      return this.feedback.fieldValues.nodes[1]?.name || 'Draft'
    }
  }
}
</script>
