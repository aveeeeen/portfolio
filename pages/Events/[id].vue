<script setup lang="ts">
import EventDetailSkelton from '~/components/organisms/EventDetailSkelton.vue';

const route = useRoute();
</script>

<template>
  <Suspense>
    <template #default>
      <EventsDetailContent :key="route.fullPath" />
    </template>
    <template #fallback>
      <EventDetailSkelton />
    </template>
  </Suspense>
</template>
