<template>
  <div class="flex justify-start">
    <!-- !TODO: Discuss about this approach, it might be better to have a KanbanColumn component
    then our users can choose to only display on column if required
    -->
    <div
      v-for="(column, category) in columns"
      :key="category"
      class="w-1/5 p-4 text-black dark:text-white"
    >
      <h2 class="text-md font-semibold text-black dark:text-white">{{ category }}</h2>
      <KanbanCard
        v-for="item in column"
        :key="item.id"
        :feedback="item"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import KanbanCard from './KanbanCard.vue'
import { useFeedback } from '../composables/useFeedback'
import { OldFeedback } from '../types/feedback'


const p = defineProps({
  feedback: {
    type: Object as OldFeedback,
    required: true
  }
})

const { getFeedback } = useFeedback()
const feedback = ref(p.feedback)
const columns = ref({})

onMounted(async () => {
  try {
    // !TODO: discuss if we should fetch the feedback of leave that upto our users
    // state is also something to think about
    const githubData = await getFeedback()
    feedback.value = githubData
    console.log('Fetched GitHub data:', githubData)
    // !TODO avoid processing the data in components, do that in the helper folder
    for (const item of githubData) {
      const category = item.fieldValues.nodes[1]?.name || 'Draft'
      console.log('category', category)
      if (!columns.value[category]) {
        columns.value[category] = []
      }
      columns.value[category].push(item)
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
  }
})

</script>
