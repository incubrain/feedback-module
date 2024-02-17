<template>
  <div
    v-if="tools.length > 0"
    class="flex gap-2 flex-col"
  >
    <button
      v-for="tool in tools"
      :key="`canvas-tool-${tool.name}`"
      class="icon-tool"
      @click="tool.action"
    >
      <UIcon :name="tool.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits([
  'redo',
  'undo',
  'clearCanvas',
  'draw',
  'highlighter',
  'arrow',
  'rectangle'
])

const tools = [
  {
    name: 'draw',
    icon: 'i-heroicons-pencil-solid',
    action: () => emit('draw')
  },
  {
    name: 'highlighter',
    icon: 'i-heroicons-pencil-square-16-solid',
    action: () => emit('highlighter')
  },
  {
    name: 'arrow',
    icon: 'i-heroicons-arrow-trending-down-16-solid',
    action: () => emit('arrow')
  },
  {
    name: 'rectangle',
    icon: 'i-heroicons-stop',
    action: () => emit('rectangle')
  },
  {
    name: 'undo',
    icon: 'i-heroicons-arrow-uturn-left-16-solid',
    action: () => emit('undo')
  },
  {
    name: 'redo',
    icon: 'i-heroicons-arrow-uturn-right-16-solid',
    action: () => emit('redo')
  },
  {
    name: 'clearCanvas',
    icon: 'i-heroicons-trash-16-solid',
    action: () => emit('clearCanvas')
  }
]
</script>

<style></style>
