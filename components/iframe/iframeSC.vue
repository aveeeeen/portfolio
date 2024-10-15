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
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="props.url"
    ></iframe>
</template>

<style scoped>

.pulse {
  animation: pulse-animation 1.8s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse-animation {
  100% {
    background-color: rgba(240, 240, 240, 1);
  }
  0% {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>