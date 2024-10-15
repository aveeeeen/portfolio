<script setup>
const props = defineProps({
  url: String,
})
const isLoading = ref(true);
onMounted(() => {
    isLoading.value = false;
})
</script>

<template>
  <div v-if="isLoading">
    <Skelton class="mock"></Skelton>
  </div>
  <div class="pulse mock" v-else>
    <iframe
      width="100%"
      height="200"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="props.url"
    ></iframe>
  </div>
</template>

<style scoped>
.mock{
  width : 100%;
  height : 200px;
  border-radius: 20px;
}
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