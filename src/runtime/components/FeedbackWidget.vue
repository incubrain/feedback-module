<template>
  <div class="flex flex-col gap-4 p-8 bg-black/30 rounded-lg shadow-lg">
    <div>
      <slot />
    </div>
    <UButton @click="github.getUser">Test GH</UButton>
    <span> {{ github.user }}</span>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRaw, toRef } from 'vue'
import useGithub from '../composables/useGithub'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: 'Feedback'
    }
  },
  // emits: ["update:modelValue"],
  setup(props, { emit, attrs: $attrs }) {
    // perform most logic here
    const github = useGithub()

    return {
      github
    }
  }
})
</script>

<style scoped></style>
