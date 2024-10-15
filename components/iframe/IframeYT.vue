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
  animation: pulse-animation 1.5s infinite;
  animation-timing-function: ease-in;
}

@keyframes pulse-animation {
  100% {
    background-color: rgba(0, 0, 0, 0.2);
  }
  50% {
    background-color: rgba(240, 240, 240, 1);
  }
  0% {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>