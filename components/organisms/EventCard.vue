<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ListEventResult } from "../../server/service/event.service.types";

const dateToLocal = useDate;
const props = defineProps<Omit<ListEventResult, "createdAt" | "updatedAt">>();

const isPortrait = ref(false);
const isImageLoaded = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function handleImageLoad(event?: Event) {
  const img = (event?.target as HTMLImageElement) || ((imgRef.value as any)?.$el ?? imgRef.value);
  if (img && img.naturalWidth && img.naturalHeight) {
    isPortrait.value = img.naturalHeight > img.naturalWidth;
  }
  isImageLoaded.value = true;
}

function handleImageError() {
  isImageLoaded.value = true;
}

onMounted(() => {
  if (!props.imageUrl) {
    isImageLoaded.value = true;
    return;
  }
  const imgEl = (imgRef.value as any)?.$el || imgRef.value;
  if (imgEl && imgEl.complete && imgEl.naturalWidth) {
    handleImageLoad({ target: imgEl } as any);
  }
});
</script>

<template>
  <NuxtLink class="event-post" :to="'/events/' + props.id">
    <div class="event-content">
      <h2>
        {{ props.title }}
      </h2>
      <div class="event-details">
        <h3>
          開催日時:
          {{
            dateToLocal(props.date)
          }}
        </h3>
        <h3>
          会場: {{ props.venue }}
        </h3>
      </div>
    </div>
    <Skelton v-if="!isImageLoaded" class="img-skelton" :class="{ portrait: isPortrait }" />
    <NuxtImg v-show="isImageLoaded" ref="imgRef" :src="props.imageUrl" format="webp" :class="{ portrait: isPortrait }"
      @load="handleImageLoad" @error="handleImageError" />
  </NuxtLink>
</template>

<style scoped>
.img-skelton {
  width: 100%;
  max-width: 600px;
  height: 25svh;
  box-sizing: border-box;
  border-radius: 20px;
  align-self: center;
}

.img-skelton.portrait {
  height: 40vh;
  width: 250px;
  max-width: 100%;
  align-self: center;
}

img {
  width: 100%;
  max-width: 600px;
  height: auto;
  box-sizing: border-box;
}

img.portrait {
  height: 40vh;
  max-height: 40vh;
  width: auto;
  max-width: 100%;
  object-fit: contain;
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