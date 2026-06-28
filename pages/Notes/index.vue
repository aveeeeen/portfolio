<script setup lang="ts">
const route = useRoute();

useSeoMeta({
  title: "braveeeeen",
  ogTitle: "protfolio site of braven",
  description: "Published Notes and Blog",
  ogDescription: "Published Notes and Blog",
  ogUrl: "https://braveeeeen.vercel.app/notes",
  ogImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
});
</script>

<template>
  <Suspense>
    <template #default>
      <NotesIndexContent :key="route.fullPath" />
    </template>
    <template #fallback>
      <div class="page">
        <div class="center- flex-vert gap-10">
          <div class="content-box article-list">
            <h1>Notes</h1>
            <Border></Border>
            <p>new → old</p>
            <Border></Border>
            <div>
              <ul v-for="i in 5" :key="i">
                <li>
                  <NoteSkelton></NoteSkelton>
                </li>
              </ul>
            </div>
          </div>
          <div class="bottom"></div>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
ul {
  padding-left: 20px;
  display: block;
}

.article-list {
  max-width: 700px;
  min-height: 80svh;
}
</style>
