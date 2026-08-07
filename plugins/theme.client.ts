export default defineNuxtPlugin(() => {
  const route = useRoute();
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  document.documentElement.style.removeProperty('background-color');

  // Enforce light mode when on index page ('/')
  if (route.path === '/') {
    document.documentElement.classList.remove('dark');
  } else if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
