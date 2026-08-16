<script setup lang="ts">
import EventsDetailContent from '~/components/templates/EventsDetailContent.vue';
import StrudelSnippetsContent from '~/components/templates/StrudelSnippetsContent.vue';

const route = useRoute();
</script>

<template>
  <StrudelSnippetsContent :key="route.fullPath" />
</template>
