<template>
  <div class="p-4 flex flex-col gap-4">
    <p class="bg-primary-50 rounded-md p-4">Telemetry: {{ $telemetry }}</p>
    <p class="bg-primary-50 rounded-md p-4">Browser Info: {{ $browserInfo }}</p>
    <p class="bg-primary-50 rounded-md p-4">Error Logs: {{ $errorLogs }}</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
