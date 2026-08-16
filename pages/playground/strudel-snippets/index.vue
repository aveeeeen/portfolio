<script setup lang="ts">
import EventsIndexContent from '~/components/templates/EventsIndexContent.vue';

const route = useRoute();

useSeoMeta({
  title: "Strudel Snippets",
  ogTitle: "Strudel Snippets",
  description: "Java SciptのライブコーディングライブラリStrudelで作った断片的なスニペットを日記的に載せています。",
  ogDescription: "Java SciptのライブコーディングライブラリStrudelで作った断片的なスニペットを日記的に載せています。",
  ogUrl: () => `https://braveeeeen.com${route.fullPath}`,
});
</script>

<template>
  <StrudelSnippetsIndex :key="route.fullPath" />
</template>
