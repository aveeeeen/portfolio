<script setup>
import FmDrum from '~/components/fm-dumkit/FmDrum.vue';
const isMenuShown = ref(false)

useSeoMeta({
  description: "FmDrumkit",
  ogDescription: "FmDrumkit",
});

</script>

<template>
  <div @click="isMenuShown = isMenuShown ? !isMenuShown : isMenuShown" class="page">
    <div class="flex-vert center-">
      <div class="playground">
        <FmDrum></FmDrum>
      </div>
      <div class="bottom"></div>
    </div>
    <Footer></Footer>
  </div>

  <!-- nav box -->
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.playground {
  z-index: 1;
}
</style>