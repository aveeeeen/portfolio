<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
</script>

<template>
  <div class="pulse"></div>
</template>

<style scoped>

.pulse {
  animation: pulse-animation 1.5s infinite;
  animation-timing-function: ease-in;
}

@keyframes pulse-animation {
  100% {
    background-color: rgba(0, 0, 0, 0.2);
  }
  50% {
    background-color: rgba(240, 240, 240, 1);
  }
  0% {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>