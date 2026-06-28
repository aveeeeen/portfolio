<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <Suspense>
    <template #default>
      <NotesDetailContent :key="route.fullPath" />
    </template>
    <template #fallback>
      <NoteDetailSkelton />
    </template>
  </Suspense>
</template>
