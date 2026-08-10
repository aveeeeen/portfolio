<script setup lang="ts">
const route = useRoute();
const isMenuShown = ref(false);

useSeoMeta({
  description: "Published Notes and Blog",
  ogDescription: "Published Notes and Blog",
});
</script>

<template>
  <Suspense>
    <template #default>
      <NotesIndexContent :key="route.fullPath" />
    </template>
    <template #fallback>
      <div class="page" @click="!isMenuShown">
        <div class="center- flex-vert gap-20">
          <div class="content-box">
            <h1>Notes</h1>
            <Border></Border>
            <p>new → old</p>
            <Border></Border>
            <div class="article-list">
              <ul v-for="i in 5" :key="i">
                <li>
                  <NoteSkelton></NoteSkelton>
                </li>
              </ul>
            </div>
          </div>
          <div class="bottom"></div>
        </div>
        <Footer></Footer>
        <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
          <Menu></Menu>
        </Nav>
      </div>
      <!-- nav box -->
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
