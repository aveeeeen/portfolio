<script setup lang="ts">
import EventsDetailContent from '~/components/templates/EventsDetailContent.vue';

const route = useRoute();
</script>

<template>
  <EventsDetailContent :key="route.fullPath" />
</template>
