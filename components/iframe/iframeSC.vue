<script setup>
const props = defineProps({
  url: String,
})
</script>

<template>
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
</template>

<style scoped>
.pulse {
  background-color: rgba(240, 240, 240, 1);
}

</style>