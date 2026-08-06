<script setup lang="ts">
import EventDetailHeader from './EventDetailHeader.vue';

</script>

<template>
  <div class="page">
    <div class="flex-vert center-">
      <EventDetailHeader>
        <template #title>
          <Skelton class="title-skeleton" />
        </template>
        <template #date>
          <Skelton class="date-skeleton" />
        </template>
        <template #venue>
          <Skelton class="tag-skeleton" />
        </template>
        <template #img>
          <Skelton class="img-skeleton" />
        </template>
      </EventDetailHeader>
      <main class="flex-vert center-">
        <div class="article-box skeleton-body">
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
</template>

<style scoped>
main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
}

.article-box {
  display: block;
  background-color: var(--bg-color);
  padding: 20px;
  max-width: 700px;
  overflow-x: hidden;
  width: 90%;
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

.img-skeleton {
  width: 100%;
  height: 25svh;
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
