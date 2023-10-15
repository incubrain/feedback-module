<template id="DetailProperty">
  <div class="mt-4 flex justify-between">
    <div class="w-1/2 mb-2">
      <span class="text-gray-800 dark:text-gray-400 mr-4">{{ label }}</span>
      <p
        v-if="!badgeValue"
        class="text-sm text-gray-400 dark:text-gray-200 font-semibold"
      >
        {{ value }}
      </p>
      <UBadge
        v-if="badgeValue"
        :color="badgeColor"
        variant="soft"
        class="font-semibold"
      >
        {{ badgeValue }}
      </UBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    badgeValue: {
      type: String,
      default: null
    },
    badgeColor: {
      type: String,
      default: 'blue'
    }
  })
</script>
