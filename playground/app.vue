<template>
  <div>
    Nuxt module playground!
    <FeedbackWidget title="hello from prop"> Hello from slot </FeedbackWidget>
    <form class="flex flex-wrap gap-6">
      <div class="w-full">
        <label class="block text-sm font-semibold mb-1">
          Feedback
        </label>
        <textarea
          class="w-full h-32 px-4 py-2 leading-6 border rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500">
          </textarea>
      </div>
      <UButton class="mt-4">
        Submit
      </UButton>
    </form>
  </div>
</template>

<script setup lang="ts">
</script>
