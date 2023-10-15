<template>
  <div>
    <KanbanBoard :feedback="feedbackData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFeedback } from '#imports'
const feedbackData = ref([]) // Initialize an empty array to hold the data
const { getFeedback } = useFeedback() // Import the getFeedback function from the useFeedback composable

async function created() {
  // Call the getFeedback function to fetch data
  try {
    const cards = await getFeedback()
    feedbackData.value = cards // Assign the fetched data to feedbackData
  } catch (error) {
    console.error('Error fetching cards:', error)
  }
}

onMounted(() => {
  created()
})
</script>
