import { ref, computed, onMounted } from 'vue';

export type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark');

  const applyTheme = (t: Theme) => {
    theme.value = t;
    if (import.meta.client) {
      localStorage.setItem('theme', t);
      document.documentElement.style.removeProperty('background-color');
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  onMounted(() => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        theme.value = savedTheme;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.value = 'dark';
      } else {
        theme.value = 'light';
      }
      applyTheme(theme.value);
    }
  });

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme: applyTheme,
  };
}
