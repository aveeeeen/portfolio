<script setup lang="ts">
const props = defineProps<{
  path: string;
  title: string;
  date: string;
  id: string;
}>();

const date = ref<string>(useDate(props.date));
</script>

<template>
  <div class="snippet-item">
    <NuxtLink :to="`${path}/${props.id}`">{{ props.title }}</NuxtLink>
    <p>{{ date }}</p>
  </div>
</template>

<style scoped>
p {
  margin: 8px 0;
}

a {
  width: 100%;
}

.snippet-item {
  margin-top: 32px;
  padding: 0 10px;
  width: 100%;
}
</style>