<script setup lang="ts">
import EventsIndexContent from '~/components/EventsIndexContent.vue';
import EvnetCardSkelton from '~/components/organisms/EvnetCardSkelton.vue';

const route = useRoute();

useSeoMeta({
  description: "Upcoming Events and Archives",
  ogDescription: "Upcoming Events and Archives",
});
</script>

<template>
  <Suspense>
    <template #default>
      <EventsIndexContent :key="route.fullPath" />
    </template>
    <template #fallback>
      <div class="page">
        <div class="center- flex-vert gap-20">
          <div class="content-box">
            <h1>Events</h1>
            <Border></Border>
            <p>new → old</p>
            <Border></Border>
            <div class="article-list flex-vert gap-20" v-for="i in 5">
              <EvnetCardSkelton></EvnetCardSkelton>
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
