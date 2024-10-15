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
      width="560"
      height="315"
      :src="props.url"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.mock{
  width : 560px;
  height : 315px;
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