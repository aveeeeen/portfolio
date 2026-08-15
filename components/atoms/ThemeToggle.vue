<template>
  <button
    class="theme-toggle-circle"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    @click.stop="toggleTheme"
  >
    <!-- Lucide Sun icon (shown when dark, click for light) -->
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-sun theme-icon"
    >
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
    <!-- Lucide Moon icon (shown when light, click for dark) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-moon theme-icon"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle-circle {
  background-color: var(--ui-bg-color);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--box-radius);
  border: none;
  cursor: pointer;
  padding: 0;
}

.theme-icon {
  width: 1.35rem;
  height: 1.35rem;
  display: block;
  color: var(--text-color-a);
}
</style>
