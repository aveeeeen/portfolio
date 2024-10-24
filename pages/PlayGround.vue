<script setup>
import FmDrumPage from './FmDrumPage.vue';
const isMenuShown = ref(false)

useSeoMeta({
  title: "braveeeeen",
  ogTitle: "protfolio site of braven",
  description: "Playground",
  ogDescription: "Playground",
  ogUrl: "https://braveeeeen.vercel.app/playground",
  ogImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
});

</script>

<template>
  <div class="page">
    <div class="flex-vert center-">
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
  </div>
   <!-- nav box -->
   <Nav
    @click="isMenuShown = !isMenuShown"
    :close="isMenuShown"
    @isclose="(e) => (isMenuShown = e)"
  >
    <Menu></Menu>
  </Nav>
</template>