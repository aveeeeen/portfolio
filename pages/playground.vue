<script setup>
import FmDrumPage from './FmDrumPage.vue';
const isMenuShown = ref(false)

useSeoMeta({
  description: "Playground",
  ogDescription: "Playground",
  ogUrl: "https://braveeeeen.vercel.app/playground",
});

</script>

<template>
  <div class="flex-vert center- width-guard"
    @click="isMenuShown = isMenuShown = isMenuShown ? !isMenuShown : isMenuShown">
    <div class="content-box">
      <h1>Playground</h1>
      <Border></Border>
      <p>
        実験や趣味で作っているものです。
      </p>
      <div class="flex-vert">
        <ContentTile>
          <h3>Fm Drum Kit</h3>
          <p>tone.jsで作られているfmベースのドラムシンセです。意外と遊べます。</p>
          <NuxtLink to="./fmdrumpage"> Fm Drum</NuxtLink>
        </ContentTile>
      </div>

    </div>
    <div class="bottom"></div>
  </div>
  <Footer></Footer>
  <!-- nav box -->
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>