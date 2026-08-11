<script setup lang="ts">
import NotesIndexContent from '~/components/NotesIndexContent.vue';

const route = useRoute();

useSeoMeta({
  description: "Published Notes and Blog",
  ogDescription: "Published Notes and Blog",
  ogUrl: () => `https://braveeeeen.vercel.app${route.fullPath}`,
});
</script>

<template>
  <NotesIndexContent :key="route.fullPath" />
</template>
