<script setup lang="ts">
import NotesDetailContent from '~/components/templates/NotesDetailContent.vue';

const route = useRoute();
</script>

<template>
  <NotesDetailContent :key="route.fullPath" />
</template>
