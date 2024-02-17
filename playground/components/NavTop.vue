<template>
  <nav
    class="w-full sticky flex top-0 shadow-sm px-4 border-b border-color justify-between backdrop-blur-md background z-40 h-[60px]"
  >
    <div class="h-full flex justify-center items-center gap-4">
      <NuxtLink
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="text-gray-800 dark:text-gray-400 mr-4"
      >
        {{ route.name }}
      </NuxtLink>
      <!-- <DarkToggle>
        <template #default="{ isDark, toggle }">
          <button
            class="icon-tool"
            @click="toggle"
          >
            <UIcon :name="isDark ? 'i-heroicons-moon-16-solid' : 'i-heroicons-sun-16-solid'" />
          </button>
        </template>
      </DarkToggle> -->
    </div>
    <div class="flex gap-3 justify-end items-center">
      <FeedbackWidget>
        <template #toggle="toggle">
          <button @click="toggle">Feedback</button>
        </template>
        <template #cta>
          <div class="p-4 rounded-md border border-gray-200">
            <p>the user can write a CTA message as they please</p>
          </div>
        </template>
      </FeedbackWidget>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const routes = router.getRoutes()
</script>
