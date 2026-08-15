<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();
</script>

<template>
  <iframe
    class="pulse"
    width="560"
    height="315"
    loading="lazy"
    :src="props.url"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</template>

<style scoped>
.pulse {
  background-color: rgb(180, 180, 180);
}
</style>
