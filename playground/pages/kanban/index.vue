<template>
    <div>
      <KanbanBoard :feedback="feedbackData" />
    </div>
  </template>
  
  <script>
  import KanbanBoard from '../../src/runtime/components/KanbanBoard.vue';
  import  getAllCards  from '../../../src/runtime/composables/useGithub';
  
  export default {
    components: {
      KanbanBoard,
    },
    data() {
      return {
        feedbackData: [], // Initialize an empty array to hold the data
      };
    },
    async created() {
      // Call the getAllCards function to fetch data
      try {
        const cards = await getAllCards();
        this.feedbackData = cards; // Assign the fetched data to feedbackData
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    },
  };
  </script>
  