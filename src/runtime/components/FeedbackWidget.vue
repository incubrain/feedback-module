<template>
  <div>
    <span>
      {{ title }}
    </span>
    <slot></slot>
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
