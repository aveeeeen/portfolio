<template>
  <button
    class="theme-toggle-circle"
    :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    @click.stop="toggleTheme"
  >
    <!-- Sun icon (shown when dark, click for light) -->
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-icon">
      <path
        class="icon-fill"
        d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zm-12.37 12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"
      />
    </svg>
    <!-- Moon icon (shown when light, click for dark) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="theme-icon">
      <path
        class="icon-fill"
        d="M12.3 2c.43 0 .77.35.73.78-.34 4.02 2.54 7.6 6.57 8.1.44.05.74.45.62.88-1.5 5.37-6.9 8.68-12.27 7.18S-1.73 12.04.14 6.67C1.22 3.56 4.06 1.5 7.35 1.5c.29 0 .58.02.87.06.39.05.7.35.68.74-.01.17-.03.33-.03.5 0 4.97 4.03 9 9 9 .17 0 .33-.02.5-.03z"
      />
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
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}

.icon-fill {
  fill: var(--text-color-a);
}
</style>
