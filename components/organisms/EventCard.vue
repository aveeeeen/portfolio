<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ListEventResult } from "../../server/service/event.service.types";
import EvnetCardSkelton from './EvnetCardSkelton.vue';

const dateToLocal = useDate;
const props = defineProps<ListEventResult>();

const isPortrait = ref(false);
const isLoaded = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function handleImageLoad(event?: Event) {
  const img = (event?.target as HTMLImageElement) || imgRef.value;
  if (img && img.naturalWidth && img.naturalHeight) {
    isPortrait.value = img.naturalHeight > img.naturalWidth;
  }
  isLoaded.value = true;
}

function handleImageError() {
  isLoaded.value = true;
}

onMounted(() => {
  if (!props.imageUrl) {
    isLoaded.value = true;
    return;
  }
  if (imgRef.value && imgRef.value.complete) {
    handleImageLoad();
  }
});
</script>

<template>
  <div v-if="!isLoaded" class="skeleton-container">
    <EvnetCardSkelton />
  </div>
  <NuxtLink v-show="isLoaded" class="event-post" :to="'events/' + props.id">
    <div class="event-content">
      <h2>
        {{ props.title }}
      </h2>
      <div class="event-details">
        <h3>
          開催日時:
          {{
            dateToLocal(new Date(props.date))
          }}
        </h3>
        <h3>
          場所: {{ props.venue }}
        </h3>
      </div>
    </div>
    <NuxtImg ref="imgRef" :src="props.imageUrl" format="webp" :class="{ portrait: isPortrait }" @load="handleImageLoad"
      @error="handleImageError" />
  </NuxtLink>
</template>

<style scoped>
.skeleton-container {
  width: 100%;
}

img {
  width: 100%;
  height: auto;
  box-sizing: border-box;
}

img.portrait {
  height: 50vh;
  width: auto;
}

.event-post {
  width: 100%;
  max-width: 1000px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
}

.event-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 60px;
  padding: 16px 4px;
  box-sizing: border-box;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

h2 {
  line-height: 1.0;
  margin: 0px;
}

a:hover h2 {
  color: #fff;
}

h3 {
  font-size: 1rem;
  line-height: 1.0;
  margin: 0;
}

a:hover h3 {
  color: #fff;
}

a {
  padding: 0%;
  height: fit-content;
}

@media (max-width: 800px) {
  .event-content {
    flex-direction: column;
    justify-content: flex-start;
    gap: 16px;
  }
}
</style>