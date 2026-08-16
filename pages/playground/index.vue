<script setup>
const route = useRoute();
const isMenuShown = ref(false)

useSeoMeta({
  description: "Playground, 実験や趣味で作っているものです。",
  ogDescription: "Playground, 実験や趣味で作っているものです。",
  ogUrl: "https://braveeeeen.com/playground",
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
      <div class="playground-box">
        <ContentCard title="Fm Drim Kit" description="tone.jsで作られているfmベースのドラムシンセです。意外と遊べます。"
          :path="`${route.fullPath}/fmdrumkit`">
        </ContentCard>
        <ContentCard title="Strudel Snippets"
          description="日記的に作ったJavaScriptのライブコーディング環境Strudelのコードです。Embedされているのでそのまま、編集できます。"
          :path="`${route.fullPath}/strudel-snippets`">
        </ContentCard>
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

<style lang="css" scoped>
p {
  margin: var(--space-m) 0;
}

.playground-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}
</style>