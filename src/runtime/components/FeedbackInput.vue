<template>
  <div class="flex flex-col gap-4 p-8 bg-black/30 rounded-lg shadow-lg">
    <div>
      <form class="flex flex-wrap gap-6">
        <div class="w-[50%]">
          <div v-if="popup">
            <label class="block text-sm font-medium text-gray-300">
              Write Feedback
            </label>
            <textarea
              v-model="feedbackText"
              class="w-full h-32 p-2 leading-6 border rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            ></textarea>
            <UButton class="mt-2" @click="submitFeedback">
              Submit
            </UButton>
          </div>
          <div v-else>
            <UButton @click="popup = true">
              Give a Feedback
            </UButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      popup: false,
      feedbackText: '',
    };
  },
  methods: {
    async submitFeedback() {
      const text = this.feedbackText;
      
      try {
        console.log("Submitting feedback:", text);
        
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    },
  },
};
</script>

<style scoped></style>
