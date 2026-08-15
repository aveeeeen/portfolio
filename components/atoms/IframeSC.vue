<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();
</script>

<template>
  <div class="iframe-box">
    <iframe
      class="pulse"
      width="100%"
      height="200"
      loading="lazy"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="props.url"
    ></iframe>
  </div>
</template>

<style scoped>
.pulse {
  background-color: rgba(240, 240, 240, 1);
}

.iframe-box {
  max-width: 1000px;
}
</style>
