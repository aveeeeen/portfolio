<script setup lang="ts">
</script>

<template>
  <div class="page">
    <div class="flex-vert center-">
      <div class="notedetail-container">
        <NoteHeader>
          <template #title>
            <Skelton class="title-skeleton" />
          </template>
          <template #date>
            <Skelton class="date-skeleton" />
          </template>
          <template #tags>
            <Skelton class="tag-skeleton" v-for="i in 3" :key="i" />
          </template>
        </NoteHeader>
        <main>
          <div class="article-box article skeleton-body">
            <div class="paragraph-skeleton" v-for="p in 3" :key="p">
              <Skelton class="line-skeleton" />
              <Skelton class="line-skeleton long" />
              <Skelton class="line-skeleton short" />
              <Skelton class="line-skeleton medium" />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notedetail-container {
  width: 100%;
  max-width: 700px;
}

.article-box {
  display: block;
  background-color: var(--bg-color);
  padding: 20px;
  max-width: 700px;
  margin: 30px;
  overflow-x: hidden;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
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
    margin: 20px;
    padding: 10px;
    overflow-x: hidden;
    min-width: 80%;
  }
}
</style>
