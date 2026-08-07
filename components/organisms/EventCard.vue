<script setup lang="ts">
import type { ListEventResult } from "../../server/service/event.service.types"
const props = defineProps<ListEventResult>()

const isPortrait = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function handleImageLoad(event?: Event) {
  const img = (event?.target as HTMLImageElement) || imgRef.value;
  if (img && img.naturalWidth && img.naturalHeight) {
    isPortrait.value = img.naturalHeight > img.naturalWidth;
  }
}

onMounted(() => {
  if (imgRef.value && imgRef.value.complete) {
    handleImageLoad();
  }
});
</script>

<template>
  <NuxtLink class="event-post" :to="'events/' + props.id">
    <div class="event-content">
      <h2>
        {{ props.title }}
      </h2>
      <div class="event-details">
        <h3>
          開催日: {{
            new Date(props.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\//g, '.')
          }}
        </h3>
        <h3>
          場所: {{ props.venue }}
        </h3>
      </div>
    </div>
    <NuxtImg ref="imgRef" :src="props.imageUrl" format="webp" :class="{ portrait: isPortrait }" @load="handleImageLoad" />
  </NuxtLink>
</template>

<style scoped>
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
  max-width: 1200px;
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