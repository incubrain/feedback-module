<template>
  <div>
    <slot v-bind="context" />
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { computed, reactive } from "vue";

const mode = useColorMode();

const isDark = computed<boolean>({
  get() {
    return mode.value === "dark";
  },
  set() {
    mode.preference = isDark.value ? "light" : "dark";
  },
});
function toggle() {
  isDark.value = !isDark.value;
}

const context = reactive({
  mode,
  isDark,
  toggle,
});

</script>

<style scoped></style>
