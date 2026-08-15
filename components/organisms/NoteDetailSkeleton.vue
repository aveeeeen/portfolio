<script setup lang="ts">
const isMenuShown = ref(true);

function closeModal() {
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}
</script>

<template>
  <div class="flex-vert center- width-guard" @click="closeModal">
    <div class="content-box flex-vert center-">
      <NoteHeader>
        <template #title>
          <Skeleton class="title-skeleton" />
        </template>
        <template #date>
          <Skeleton class="date-skeleton" />
        </template>
        <template #tags>
          <Skeleton class="tag-skeleton" v-for="i in 3" :key="i" />
        </template>
      </NoteHeader>
      <main>
        <div class="article-box">
          <div class="paragraph-skeleton" v-for="p in 5" :key="p">
            <Skeleton class="line-skeleton" />
            <Skeleton class="line-skeleton long" />
            <Skeleton class="line-skeleton short" />
            <Skeleton class="line-skeleton medium" />
          </div>
        </div>
      </main>
    </div>
  </div>
  <div class="bottom"></div>
  <Footer></Footer>
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 800px;
}

.title-skeleton {
  width: 70%;
  height: 2.5rem;
  border-radius: 10px;
}

.date-skeleton {
  width: 25%;
  height: 1.2rem;
  border-radius: 6px;
  margin-top: 5px;
}

.tag-skeleton {
  width: 60px;
  height: 1.5rem;
  border-radius: 10px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.paragraph-skeleton {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 30px;
}

.line-skeleton {
  width: 100%;
  height: 1.2rem;
  border-radius: 6px;
}

.line-skeleton.long {
  width: 95%;
}

.line-skeleton.medium {
  width: 80%;
}

.line-skeleton.short {
  width: 55%;
}

@media (max-width: 800px) {
  .article-box {
    display: block;
    background-color: var(--bg-color);
    padding: 10px;
    overflow-x: hidden;
    width: 90%;
  }
}
</style>
