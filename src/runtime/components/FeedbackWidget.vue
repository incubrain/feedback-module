<template>
  <div class="flex flex-col gap-4 bg-black/30 rounded-lg shadow-lg">
    <span>
      {{ title }}
    </span>
    <div>
      <slot />
    </div>
    <!-- <UButton>UButton Test</UButton> -->
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRaw, toRef } from "vue";
// import { UButton } from "@nuxt/ui";

export default defineComponent({
  // components: {
  //   UButton,
  // },
  props: {
    title: {
      type: String,
      default: "Feedback",
    },
  },
  // emits: ["update:modelValue"],
  setup(props, { emit, attrs: $attrs }) {
    // perform most logic here
  },
});
</script>

<style scoped></style>
