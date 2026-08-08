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
  position: absolute;
  bottom: 10vh;
  left: 10vw;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  max-width: 400px;
}

a {
  display: block;
  width: fit-content;
  height: fit-content;
  background-color: var(--bg-color);
  color: var(--text-color-a);
  font-size: 1rem;
  min-width: 64px;
  line-height: 1.5;
  padding: 2px 8px;
  text-decoration: underline;
}

a:hover {
  color: white;
  background-color: blue;
}

@media (max-width: 800px) {
  .top-nav {
    position: absolute;
    left: auto;
    bottom: 0%;
    right: 0%;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-end;
    max-width: 400px;
  }
}
</style>
