<script setup>
const props = defineProps({
  url: String,
})
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