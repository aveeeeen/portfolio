<script setup>
import FmDrum from '~/components/fm-dumkit/FmDrum.vue';
const isMenuShown = ref(false)

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