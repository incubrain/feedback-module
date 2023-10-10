<template>
  <div>
    <KanbanBoard :feedback="feedbackData" />
  </div>
</template>

<script lang="ts" setup>
const feedbackData = ref([]) // Initialize an empty array to hold the data
async function created() {
  // Call the getAllCards function to fetch data
  try {
    const cards = await getAllCards()
    feedbackData.value = cards // Assign the fetched data to feedbackData
  } catch (error) {
    console.error('Error fetching cards:', error)
  }
}
</script>
