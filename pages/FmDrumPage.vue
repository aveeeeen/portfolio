<script setup>
import FmDrum from '~/components/fm-dumkit/FmDrum.vue';
const isMenuShown = ref(false)

onBeforeMount(() => {
  let bgC = getComputedStyle(document.body).getPropertyValue("--bg-color");
  let html = document.querySelector("html");
  html.style.backgroundColor = bgC;
});

onUnmounted(() => {
  let html = document.querySelector("html");
  let contetnBox = document.querySelector("content-box");
  html.style.backgroundColor = "blue"
});

</script>

<template>
  <div class="page">
    <div class="flex-vert center-">
      <div class="playground">
        <FmDrum></FmDrum>
      </div>
      <div class="bottom"></div>
    </div>
  </div>

  <!-- nav box -->
  <Nav @click="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.playground {
  z-index: -1;
}
</style>