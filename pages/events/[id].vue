<script setup lang="ts">
import EventsDetailContent from '~/components/EventsDetailContent.vue';

const route = useRoute();
</script>

<template>
  <EventsDetailContent :key="route.fullPath" />
</template>
