<template>
  <div class="flex justify-start">
    <div v-for="(column, category) in columns" :key="category" class="w-1/5 p-4 text-white">
      <h2 class="text-md font-semibold text-white">{{ category }}</h2>
      <KanbanCard v-for="item in column" :key="item.id" :feedback="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import KanbanCard from './KanbanCard.vue';
import useGithub from '../composables/useGithub';

export default {
  components: {
    KanbanCard,
  },
  props: {
    feedback: Array,
  },
  setup(props) {
    const { getAllCards } = useGithub();
    const feedback = ref(props.feedback);

    onMounted(async () => {
      try {
        const githubData = await getAllCards();
        feedback.value = githubData;
        console.log('Fetched GitHub data:', githubData);
        for (const item of githubData) {
          const category = item.fieldValues.nodes[1]?.name || 'Draft';
          console.log('category', category);
          if (!columns.value[category]) {
            columns.value[category] = [];
          }
          columns.value[category].push(item);
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      }
    });
    const columns = ref({});
    return {
      columns,
    };
  },
};
</script>
