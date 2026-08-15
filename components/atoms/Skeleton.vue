<script setup lang="ts">
const { isDark } = useTheme();
</script>

<template>
  <div :class="isDark ? 'pulse-dark' : 'pulse'"></div>
</template>

<style scoped>
.pulse {
  background-color: rgba(0, 0, 0, 0.1);
  animation: pulse-animation 1.5s ease-in-out infinite;
}

.pulse-dark {
  background-color: rgba(255, 255, 255, 0.08);
  animation: pulse-animation-dark 1.5s ease-in-out infinite;
}

@keyframes pulse-animation {
  0%, 100% {
    background-color: rgba(0, 0, 0, 0.08);
  }
  50% {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

@keyframes pulse-animation-dark {
  0%, 100% {
    background-color: rgba(255, 255, 255, 0.08);
  }
  50% {
    background-color: rgba(255, 255, 255, 0.22);
  }
}
</style>
