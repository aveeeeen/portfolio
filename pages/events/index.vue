<script setup lang="ts">
import EventsIndexContent from '~/components/EventsIndexContent.vue';

const route = useRoute();

useSeoMeta({
  description: "Upcoming Events and Archives",
  ogDescription: "Upcoming Events and Archives",
});
</script>

<template>
  <EventsIndexContent :key="route.fullPath" />
</template>
