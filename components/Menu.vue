<script setup>

</script>

<template>
  <div class="ui-box menu-list">
    <div class="flex-vert gap-5 show-right">
      <NuxtLink to="/works">works</NuxtLink>
      <NuxtLink to="/events">events</NuxtLink>
      <NuxtLink to="/playground">playground</NuxtLink>
      <NuxtLink to="/notes?page=1">notes</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.menu-list {
  text-align: right;
  padding: calc(var(--space-s) / 2) var(--space-s);
}
</style>
