<template>
    <div>
      Nuxt module playground!
      <FeedbackWidget title="hello from prop"> Hello from slot </FeedbackWidget>
      <FeedbackInput />
      <UButton class="my-2 mx-8" >
        <NuxtLink to="/kanban">Go to Kanban</NuxtLink>
      </UButton>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  