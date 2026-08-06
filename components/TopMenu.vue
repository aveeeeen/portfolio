<script setup>



</script>

<template>
  <div class="top-nav">
    <NuxtLink to="/about"> about </NuxtLink>
    <NuxtLink to="/works"> works </NuxtLink>
    <NuxtLink to="/events"> events</NuxtLink>
    <NuxtLink to="/playground"> playground </NuxtLink>
    <NuxtLink to="/notes?page=1"> notes </NuxtLink>
  </div>
</template>

<style scoped>
.top-nav {
  flex-direction: row;
  flex-wrap: wrap;
}

.top-nav>a {
  display: inline;
  width: fit-content;
  background-color: var(--text-bg-color-a);
  color: var(--text-color-a);
  font-size: 1.25rem;
  min-width: 64px;
  line-height: 1.5;
  padding: 2px 8px;
}

a:hover {
  color: white;
  display: inline;
  background-color: blue;
}

@media (max-width: 800px) {
  .top-nav {
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 400px;
  }
}
</style>
