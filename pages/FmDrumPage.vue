<script setup>
import FmDrum from '~/components/fm-dumkit/FmDrum.vue';
const isMenuShown = ref(false)
const theme = useTheme();
theme.setTheme("light");

useSeoMeta({
  description: "FmDrumkit",
  ogDescription: "FmDrumkit",
  ogUrl: "https://braveeeeen.com/fmdrumpage",
});

</script>

<template>
  <div class="flex-vert center- width-guard"
    @click="isMenuShown = isMenuShown = isMenuShown ? !isMenuShown : isMenuShown">
    <div class="playground">
      <FmDrum></FmDrum>
    </div>
    <div class="bottom"></div>
  </div>
  <Footer></Footer>

  <!-- nav box -->
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.playground {
  color: #222;
  margin: 72px 0;
}
</style>