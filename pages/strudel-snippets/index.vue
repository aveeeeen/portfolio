<script setup lang="ts">
import EventsIndexContent from '~/components/templates/EventsIndexContent.vue';

const route = useRoute();

useSeoMeta({
  description: "Snippets of Strudel Live-coding Environment",
  ogDescription: "Snippets of Strudel Live-coding Environment",
  ogUrl: () => `https://braveeeeen.com${route.fullPath}`,
});
</script>

<template>
  <StrudelSnippetsIndex :key="route.fullPath" />
</template>
