<script setup lang="ts">
import NotesIndexContent from '~/components/NotesIndexContent.vue';

const route = useRoute();

useSeoMeta({
  description: "Published Notes and Blog",
  ogDescription: "Published Notes and Blog",
});
</script>

<template>
  <NotesIndexContent :key="route.fullPath" />
</template>
