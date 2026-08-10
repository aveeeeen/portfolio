<script setup lang="ts">
import NotesDetailContent from '~/components/NotesDetailContent.vue';

const route = useRoute();
</script>

<template>
  <NotesDetailContent :key="route.fullPath" />
</template>
