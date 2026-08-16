<script setup lang="ts">
const props = defineProps<{
  title: string;
  date: string;
  id: string;
}>();

const date = ref<string>(useDate(props.date));
</script>

<template>
  <NuxtLink class="snippet-card" :to="`/strudel-snippets/${props.id}`">
    <p>{{ props.title }}</p>
    <span>{{ date }}</span>
  </NuxtLink>
</template>

<style scoped>
p {
  margin-top: 0;
  margin-bottom: 8px;
}

.snippet-card:hover>p {
  color: #fff;
}

.snippet-card {
  padding: var(--space-s) 0;
}
</style>