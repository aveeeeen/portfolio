<script setup lang="ts">
const props = defineProps<{
  title: string,
  date: string,
}>();

// const formattedTitle = computed(() => props.title?.replace(/[\.(]/g, '-').replace(/[\s)]/g, '').toLowerCase() ?? '');
</script>

<template>
  <div class="snippet-header">
    <div class="path-like">
      <NuxtLink to="/playground/strudel-snippets">strudel-snippets</NuxtLink>
      <span>/</span>
      <span>{{ props.title ?? '' }}</span>
    </div>
    <p><span>{{ props.date ?? '' }}</span></p>
  </div>
</template>

<style scoped>
.snippet-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-m) 0;
  width: 100%;
  border-bottom: solid 2px var(--text-color);
}

p {
  margin: 0;
}

span {
  color: var(--text-color)
}

.path-like {
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-xs)
}
</style>